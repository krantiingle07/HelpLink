import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  request_id: string | null;
  is_read: boolean | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string;
  last_message_time: string;
  is_read: boolean | null;
  unread_count: number;
  request_id: string | null;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Get all messages where user is sender or receiver
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        setConversations([]);
        return;
      }

      if (!messages || messages.length === 0) {
        setConversations([]);
        return;
      }

      // Group messages by conversation (with the other user)
      const conversationMap = new Map<string, Message[]>();

      (messages as Message[]).forEach((msg) => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const key = [user.id, otherUserId].sort().join('_');

        if (!conversationMap.has(key)) {
          conversationMap.set(key, []);
        }
        conversationMap.get(key)!.push(msg);
      });

      // Build conversation objects
      const convs: Conversation[] = [];

      for (const [, msgs] of conversationMap) {
        if (msgs.length === 0) continue;

        const lastMsg = msgs[0];
        const otherUserId = lastMsg.sender_id === user.id ? lastMsg.receiver_id : lastMsg.sender_id;

        // Fetch other user's profile
        const { data: profile } = await supabase
          .from('profiles_public')
          .select('full_name, avatar_url')
          .eq('user_id', otherUserId)
          .maybeSingle();

        // Count unread messages
        const unreadCount = msgs.filter(
          (m) => m.receiver_id === user.id && !m.is_read
        ).length;

        convs.push({
          id: `${user.id}_${otherUserId}`,
          other_user_id: otherUserId,
          other_user_name: profile?.full_name || 'Unknown',
          other_user_avatar: profile?.avatar_url || null,
          last_message: lastMsg.content,
          last_message_time: lastMsg.created_at,
          is_read: lastMsg.is_read,
          unread_count: unreadCount,
          request_id: lastMsg.request_id,
        });
      }

      setConversations(convs.sort((a, b) => 
        new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
      ));
    } catch (err) {
      console.error('Error processing conversations:', err);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useConversationMessages(otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async () => {
    if (!user || !otherUserId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Fetch messages between current user and other user
      // Using a simpler approach with proper filters
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},sender_id.eq.${otherUserId}`)
        .or(`receiver_id.eq.${user.id},receiver_id.eq.${otherUserId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } else {
        // Filter messages to only include those between these two users
        const filteredMessages = (data as Message[])?.filter(
          (msg) =>
            (msg.sender_id === user.id && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === user.id)
        ) || [];

        setMessages(filteredMessages);

        // Mark messages as read
        const unreadMsgs = filteredMessages.filter(
          (m) => m.receiver_id === user.id && !m.is_read
        );

        if (unreadMsgs.length > 0) {
          const { error: markError } = await supabase
            .from('messages')
            .update({ is_read: true })
            .in(
              'id',
              unreadMsgs.map((m) => m.id)
            );

          if (markError) {
            console.error('Failed to mark as read:', markError);
          }
        }
      }
    } catch (err) {
      console.error('Error processing messages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.id, otherUserId]);

  return { messages, loading, refetch: fetchMessages };
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendMessage = async (
    receiverId: string,
    content: string,
    requestId?: string
  ) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive',
      });
      return { error: new Error('Not authenticated'), data: null };
    }

    if (!content.trim()) {
      return { error: new Error('Message cannot be empty'), data: null };
    }

    if (!receiverId) {
      console.error('No receiver ID provided');
      return { error: new Error('No receiver ID'), data: null };
    }

    setLoading(true);

    try {
      console.log('Sending message:', { from: user.id, to: receiverId, content });

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          request_id: requestId || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive',
        });
        return { error, data: null };
      }

      console.log('Message sent successfully:', data);
      return { error: null, data };
    } catch (err) {
      console.error('Unexpected error sending message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return { error: err as Error, data: null };
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
}
