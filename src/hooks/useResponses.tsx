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

  const createResponse = async (requestId: string, message: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to respond',
        variant: 'destructive',
      });
      return { error: new Error('Not authenticated'), data: null };
    }

    setLoading(true);
    
    const { data, error } = await supabase
      .from('help_responses')
      .insert({
        request_id: requestId,
        helper_id: user.id,
        message,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Error creating response:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your response',
        variant: 'destructive',
      });
      return { error, data: null };
    }

    toast({
      title: 'Thank you!',
      description: 'Your offer to help has been sent',
    });

    return { error: null, data };
  };

  return { createResponse, loading };
}