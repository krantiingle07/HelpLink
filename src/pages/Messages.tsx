import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useConversations, useConversationMessages, useSendMessage } from '@/hooks/useMessages';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, Loader2, Send, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedOtherUserId, setSelectedOtherUserId] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  
  const { conversations, loading: conversationsLoading, refetch: refetchConversations } = useConversations();
  const { messages, loading: messagesLoading, refetch: refetchMessages } = useConversationMessages(selectedOtherUserId);
  const { sendMessage, loading: sendingMessage } = useSendMessage();

  // Auto-select conversation from URL param
  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId && user?.id) {
      setSelectedOtherUserId(userId);
      const convId = [user.id, userId].sort().join('_');
      setSelectedConversationId(convId);
    }
  }, [searchParams, user?.id]);

  const handleSelectConversation = (conv: any) => {
    setSelectedConversationId(conv.id);
    setSelectedOtherUserId(conv.other_user_id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedOtherUserId) return;

    const { error } = await sendMessage(selectedOtherUserId, messageText);
    if (!error) {
      setMessageText('');
      // refresh both lists
      refetchConversations();
      refetchMessages();
    }
  };

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

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Messages
        </h1>

        <div className="grid gap-6 lg:grid-cols-3 min-h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
                <CardDescription>
                  {conversations.length === 0 ? 'No conversations yet' : `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-2 p-4 -mx-6 px-6">
                {conversationsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-colors hover:bg-muted',
                        selectedConversationId === conv.id && 'bg-primary/10 border border-primary/30'
                      )}
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={conv.other_user_avatar || ''} />
                          <AvatarFallback>{conv.other_user_name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{conv.other_user_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{conv.last_message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: true })}
                          </p>
                        </div>
                        {conv.unread_count > 0 && (
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No conversations yet</p>
                    <p className="text-xs">
                      Respond to help requests to start messaging helpers
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat View */}
          {selectedConversation ? (
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedConversationId(null);
                        setSelectedOtherUserId('');
                      }}
                      className="lg:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.other_user_avatar || ''} />
                      <AvatarFallback>{selectedConversation.other_user_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.other_user_name}</CardTitle>
                      {selectedConversation.request_id && (
                        <CardDescription className="text-xs">
                          Regarding a help request
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn('flex gap-2', msg.sender_id === user.id && 'justify-end')}
                      >
                        {msg.sender_id !== user.id && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={selectedConversation.other_user_avatar || ''} />
                            <AvatarFallback>{selectedConversation.other_user_name[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-xs lg:max-w-md rounded-lg p-3',
                            msg.sender_id === user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <p className="text-sm break-words">{msg.content}</p>
                          <p className={cn('text-xs mt-1', msg.sender_id === user.id ? 'opacity-70' : 'opacity-60')}>
                            {format(new Date(msg.created_at), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-center">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  )}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4 space-y-3">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    className="w-full gap-2"
                  >
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Send Message
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-2 hidden lg:flex">
              <Card className="w-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}