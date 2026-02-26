import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface HelpResponse {
  id: string;
  request_id: string;
  helper_id: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export function useRequestResponses(requestId: string) {
  const [responses, setResponses] = useState<HelpResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchResponses = async () => {
    if (!requestId) {
      setResponses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase
      .from('help_responses')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching responses:', error);
      setResponses([]);
    } else {
      // Fetch profile data from the public view for each helper
      const responsesWithProfiles = await Promise.all(
        (data || []).map(async (response: any) => {
          const { data: profile } = await supabase
            .from('profiles_public')
            .select('full_name, avatar_url')
            .eq('user_id', response.helper_id)
            .maybeSingle();
          
          return {
            ...response,
            profiles: profile || null,
          };
        })
      );
      setResponses(responsesWithProfiles as HelpResponse[]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchResponses();
  }, [requestId]);

  return { responses, loading, refetch: fetchResponses };
}

export function useCreateResponse() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createResponse = async (requestId: string, message: string, seekerId: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to respond',
        variant: 'destructive',
      });
      return { error: new Error('Not authenticated'), data: null };
    }

    if (!seekerId) {
      console.error('No seekerId provided to createResponse');
      toast({
        title: 'Error',
        description: 'Unable to identify the help seeker',
        variant: 'destructive',
      });
      return { error: new Error('No seekerId'), data: null };
    }

    setLoading(true);
    
    try {
      console.log('Creating response:', { requestId, helper_id: user.id, seekerId });

      // Create the help response
      const { data: responseData, error: responseError } = await supabase
        .from('help_responses')
        .insert({
          request_id: requestId,
          helper_id: user.id,
          message,
        })
        .select()
        .single();

      if (responseError) {
        console.error('Error creating help response:', responseError);
        throw responseError;
      }

      console.log('Help response created:', responseData);

      // Create a private message from helper to seeker (fire and forget)
      supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: seekerId,
          content: message,
          request_id: requestId,
        })
        .then(() => console.log('Message created successfully'))
        .catch((err) => console.error('Error creating message:', err));

      setLoading(false);

      toast({
        title: 'Thank you!',
        description: 'Your offer to help has been sent. Check Messages to communicate with the seeker.',
      });

      return { error: null, data: responseData };
    } catch (err: unknown) {
      setLoading(false);

      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in createResponse:', errorMessage);

      toast({
        title: 'Error',
        description: `Failed to submit your response: ${errorMessage}`,
        variant: 'destructive',
      });
      return { error: err as Error, data: null };
    }
  };

  return { createResponse, loading };
}