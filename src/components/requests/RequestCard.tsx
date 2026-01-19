import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HelpRequest } from '@/hooks/useHelpRequests';
import { getCategoryById, URGENCY_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface RequestCardProps {
  request: HelpRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const category = getCategoryById(request.category);
  const urgency = URGENCY_CONFIG[request.urgency];
  const status = STATUS_CONFIG[request.status];
  const Icon = category?.icon;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden",
      request.urgency === 'critical' && "border-critical/50 shadow-critical/10",
      request.urgency === 'urgent' && "border-warning/50 shadow-warning/10"
    )}>
      {/* Urgency indicator bar */}
      {request.urgency !== 'normal' && (
        <div className={cn(
          "h-1 w-full",
          request.urgency === 'critical' && "bg-critical",
          request.urgency === 'urgent' && "bg-warning"
        )} />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                "p-2.5 rounded-xl transition-transform group-hover:scale-110", 
                category?.bgColor
              )}>
                <Icon className={cn("h-5 w-5", category?.color)} />
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className={cn("font-medium", category?.color)}>
                {category?.label}
              </Badge>
              {request.urgency !== 'normal' && (
                <Badge 
                  className={cn(
                    "font-medium",
                    urgency.bgColor, 
                    urgency.color,
                    request.urgency === 'critical' && "animate-pulse"
                  )} 
                  variant="outline"
                >
                  {urgency.label}
                </Badge>
              )}
            </div>
          </div>
          <Badge className={cn("font-medium", status.bgColor, status.color)} variant="outline">
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {request.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {request.description}
        </p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
          {request.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span>{request.city}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t bg-muted/30">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
            <AvatarImage src={request.profiles?.avatar_url || ''} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
              {request.profiles?.full_name ? getInitials(request.profiles.full_name) : 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-muted-foreground">
            {request.profiles?.full_name || 'Anonymous'}
          </span>
        </div>
        
        <Button asChild size="sm" className="gap-1.5 group/btn">
          <Link to={`/request/${request.id}`}>
            View
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
