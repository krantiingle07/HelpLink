import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UrgencyBadge } from '@/components/requests/UrgencyBadge';
import { useAuth } from '@/hooks/useAuth';
import { useRequestResponses, useCreateResponse } from '@/hooks/useResponses';
import { getCategoryById, STATUS_CONFIG } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { HelpRequest } from '@/hooks/useHelpRequests';
import { 
  MapPin, 
  Clock, 
  Phone, 
  ArrowLeft, 
  Send, 
  Loader2,
  HandHeart,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  
  const { responses, loading: responsesLoading, refetch: refetchResponses } = useRequestResponses(id || '');
  const { createResponse, loading: submitting } = useCreateResponse();

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id, user]);

  const fetchRequest = async () => {
    if (!id) return;
    
    setLoading(true);
    
    // Fetch request - will get full details if user is owner/helper, limited otherwise
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      // If RLS blocks access, try fetching from public view (without contact_phone)
      const { data: publicData, error: publicError } = await supabase
        .from('help_requests_public')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (publicError || !publicData) {
        console.error('Error fetching request:', error || publicError);
        navigate('/browse');
        return;
      }
      
      // Get requester profile from public view
      const { data: profile } = await supabase
        .from('profiles_public')
        .select('full_name, avatar_url')
        .eq('user_id', publicData.user_id)
        .maybeSingle();
      
      setRequest({
        ...publicData,
        contact_phone: null, // Not accessible
        profiles: profile || undefined,
      } as unknown as HelpRequest);
    } else {
      // User has full access - get profile data
      const { data: profile } = await supabase
        .from('profiles_public')
        .select('full_name, avatar_url')
        .eq('user_id', data.user_id)
        .maybeSingle();
      
      setRequest({
        ...data,
        profiles: profile || undefined,
      } as unknown as HelpRequest);
    }
    setLoading(false);
  };

  const handleSubmitResponse = async () => {
    if (!id || !responseMessage.trim()) return;

    const { error } = await createResponse(id, responseMessage);
    if (!error) {
      setResponseMessage('');
      refetchResponses();
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <Button onClick={() => navigate('/browse')}>Browse Requests</Button>
        </div>
      </Layout>
    );
  }

  const category = getCategoryById(request.category);
  const status = STATUS_CONFIG[request.status];
  const Icon = category?.icon;
  const isOwner = user?.id === request.user_id;
  const hasResponded = responses.some(r => r.helper_id === user?.id);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/browse')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start gap-3 mb-4">
                  {Icon && (
                    <div className={cn("p-3 rounded-xl", category?.bgColor)}>
                      <Icon className={cn("h-6 w-6", category?.color)} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className={category?.color}>
                        {category?.label}
                      </Badge>
                      <UrgencyBadge urgency={request.urgency} />
                      <Badge className={cn(status.bgColor, status.color)} variant="outline">
                        {status.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{request.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  {request.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{request.city}{request.location && `, ${request.location}`}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Posted {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                {request.contact_phone && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="font-medium">{request.contact_phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Responses Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Responses ({responses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {responsesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : responses.length > 0 ? (
                  <div className="space-y-4">
                    {responses.map((response) => (
                      <div key={response.id} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={response.profiles?.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {response.profiles?.full_name ? getInitials(response.profiles.full_name) : 'H'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {response.profiles?.full_name || 'Helper'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(response.created_at), 'MMM d, yyyy h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{response.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No responses yet. Be the first to help!
                  </p>
                )}

                {/* Response Form */}
                {user && !isOwner && request.status === 'open' && (
                  <div className="mt-6 pt-6 border-t">
                    {hasResponded ? (
                      <p className="text-center text-muted-foreground">
                        You have already responded to this request
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write your response... How can you help?"
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          rows={3}
                        />
                        <Button
                          onClick={handleSubmitResponse}
                          disabled={!responseMessage.trim() || submitting}
                          className="gap-2"
                        >
                          {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Send Response
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {!user && (
                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-muted-foreground mb-3">
                      Sign in to respond to this help request
                    </p>
                    <Button onClick={() => navigate('/auth')}>
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requester Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.profiles?.avatar_url || ''} />
                    <AvatarFallback>
                      {request.profiles?.full_name ? getInitials(request.profiles.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.profiles?.full_name || 'Anonymous'}</p>
                    <p className="text-sm text-muted-foreground">Help Seeker</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {!isOwner && user && request.status === 'open' && !hasResponded && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <HandHeart className="h-12 w-12 mx-auto text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Can You Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your help can make a real difference in someone's life
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => document.querySelector('textarea')?.focus()}
                    >
                      Offer Your Help
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share this request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Help spread the word by sharing this request
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Copy Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}