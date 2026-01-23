import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type HelpCategoryEnum = Database['public']['Enums']['help_category'];
type UrgencyLevelEnum = Database['public']['Enums']['urgency_level'];
type RequestStatusEnum = Database['public']['Enums']['request_status'];

export interface HelpRequest {
  id: string;
  user_id: string;
  category: HelpCategoryEnum;
  title: string;
  description: string;
  urgency: UrgencyLevelEnum;
  status: RequestStatusEnum;
  city: string | null;
  location: string | null;
  contact_phone: string | null;
  additional_info: Record<string, unknown> | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface CreateRequestInput {
  category: HelpCategoryEnum;
  title: string;
  description: string;
  urgency: UrgencyLevelEnum;
  city?: string;
  location?: string;
  contact_phone?: string;
  additional_info?: Record<string, unknown>;
  image_url?: string;
}

export function useHelpRequests(filters?: {
  category?: HelpCategoryEnum;
  status?: RequestStatusEnum;
  urgency?: UrgencyLevelEnum;
  city?: string;
}) {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    
    // Use public view to hide sensitive data (contact_phone) for browsing
    let query = supabase
      .from('help_requests_public')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }
    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch help requests',
        variant: 'destructive',
      });
    } else {
      // Map view data to HelpRequest type (contact_phone will be null from view)
      const requests = (data || []).map((item: any) => ({
        ...item,
        contact_phone: null, // Not exposed in public view
      })) as HelpRequest[];
      setRequests(requests);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [filters?.category, filters?.status, filters?.urgency, filters?.city]);

  return { requests, loading, refetch: fetchRequests };
}

export function useMyRequests() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMyRequests = async () => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your requests',
        variant: 'destructive',
      });
    } else {
      setRequests((data as unknown as HelpRequest[]) || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchMyRequests();
  }, [user]);

  return { requests, loading, refetch: fetchMyRequests };
}

export function useCreateRequest() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createRequest = async (input: CreateRequestInput) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a request',
        variant: 'destructive',
      });
      return { error: new Error('Not authenticated'), data: null };
    }

    setLoading(true);
    
    const insertData = {
      user_id: user.id,
      category: input.category,
      title: input.title,
      description: input.description,
      urgency: input.urgency,
      city: input.city || null,
      location: input.location || null,
      contact_phone: input.contact_phone || null,
      additional_info: input.additional_info || {},
      image_url: input.image_url || null,
    };
    
    const { data, error } = await supabase
      .from('help_requests')
      .insert(insertData as any)
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Error creating request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create help request',
        variant: 'destructive',
      });
      return { error, data: null };
    }

    toast({
      title: 'Success',
      description: 'Your help request has been posted!',
    });

    return { error: null, data };
  };

  return { createRequest, loading };
}

export function useUpdateRequestStatus() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (requestId: string, status: RequestStatusEnum) => {
    setLoading(true);
    
    const { error } = await supabase
      .from('help_requests')
      .update({ status })
      .eq('id', requestId);

    setLoading(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update request status',
        variant: 'destructive',
      });
      return { error };
    }

    toast({
      title: 'Success',
      description: 'Request status updated',
    });

    return { error: null };
  };

  return { updateStatus, loading };
}