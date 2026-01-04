import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useMyRequests, useUpdateRequestStatus } from '@/hooks/useHelpRequests';
import { getCategoryById, STATUS_CONFIG, URGENCY_CONFIG } from '@/lib/constants';
import { 
  PlusCircle, 
  Loader2, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { requests, loading, refetch } = useMyRequests();
  const { updateStatus, loading: updating } = useUpdateRequestStatus();

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const openRequests = requests.filter(r => r.status === 'open');
  const inProgressRequests = requests.filter(r => r.status === 'in_progress');
  const resolvedRequests = requests.filter(r => r.status === 'resolved' || r.status === 'closed');

  const handleStatusUpdate = async (requestId: string, status: 'in_progress' | 'resolved' | 'closed') => {
    await updateStatus(requestId, status);
    refetch();
  };

  const renderRequestList = (items: typeof requests) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No requests in this category
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((request) => {
          const category = getCategoryById(request.category);
          const status = STATUS_CONFIG[request.status];
          const urgency = URGENCY_CONFIG[request.urgency];
          const Icon = category?.icon;

          return (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {Icon && (
                      <div className={cn("p-2 rounded-lg", category?.bgColor)}>
                        <Icon className={cn("h-4 w-4", category?.color)} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <Badge variant="outline" className={category?.color}>
                          {category?.label}
                        </Badge>
                        {request.urgency !== 'normal' && (
                          <Badge variant="outline" className={cn(urgency.bgColor, urgency.color)}>
                            {urgency.label}
                          </Badge>
                        )}
                        <Badge variant="outline" className={cn(status.bgColor, status.color)}>
                          {status.label}
                        </Badge>
                      </div>
                      <h3 className="font-medium truncate">{request.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {request.status === 'open' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'in_progress')}
                        disabled={updating}
                      >
                        Mark In Progress
                      </Button>
                    )}
                    {request.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, 'resolved')}
                        disabled={updating}
                        className="text-success"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/request/${request.id}`)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name || 'User'}! Manage your help requests here.
            </p>
          </div>
          <Button onClick={() => navigate('/create')} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{openRequests.length}</div>
              <p className="text-sm text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">{inProgressRequests.length}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">{resolvedRequests.length}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>My Help Requests</CardTitle>
            <CardDescription>
              View and manage the help requests you've posted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven't posted any help requests yet
                </p>
                <Button onClick={() => navigate('/create')}>
                  Create Your First Request
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="open">
                <TabsList className="mb-4">
                  <TabsTrigger value="open" className="gap-2">
                    Open
                    <Badge variant="secondary">{openRequests.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="in_progress" className="gap-2">
                    In Progress
                    <Badge variant="secondary">{inProgressRequests.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="resolved" className="gap-2">
                    Resolved
                    <Badge variant="secondary">{resolvedRequests.length}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="open">
                  {renderRequestList(openRequests)}
                </TabsContent>
                <TabsContent value="in_progress">
                  {renderRequestList(inProgressRequests)}
                </TabsContent>
                <TabsContent value="resolved">
                  {renderRequestList(resolvedRequests)}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}