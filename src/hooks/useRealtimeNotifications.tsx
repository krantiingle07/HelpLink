import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export function useRealtimeNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user) return;

    // Subscribe to new responses on help requests owned by the current user
    const channel = supabase
      .channel('help-responses-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'help_responses',
        },
        async (payload) => {
          // Check if the response is for one of the user's requests
          const { data: request } = await supabase
            .from('help_requests')
            .select('id, title, user_id')
            .eq('id', payload.new.request_id)
            .single();

          if (request && request.user_id === user.id) {
            // Get helper's profile
            const { data: helperProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', payload.new.helper_id)
              .single();

            toast({
              title: '🔔 New Response!',
              description: `${helperProfile?.full_name || 'Someone'} offered to help with "${request.title}"`,
              duration: 8000,
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, toast]);

  return null;
}

// Component to use in layout
export function RealtimeNotifications() {
  useRealtimeNotifications();
  return null;
}
