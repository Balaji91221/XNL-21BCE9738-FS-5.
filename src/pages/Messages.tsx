
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, MessageCircle, Send, Image, Smile, Paperclip, MicIcon } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import webSocketService, { Message } from '@/utils/webSocketService';

// Mock data for demonstration
const MOCK_CONTACTS = [
  { id: 1, name: 'Emma Watson', avatar: null, status: 'online', lastSeen: 'Just now', unread: 3 },
  { id: 2, name: 'James Rodriguez', avatar: null, status: 'online', lastSeen: '2m ago', unread: 0 },
  { id: 3, name: 'Sarah Johnson', avatar: null, status: 'offline', lastSeen: '1h ago', unread: 0 },
  { id: 4, name: 'Mike Chen', avatar: null, status: 'offline', lastSeen: 'Yesterday', unread: 0 },
  { id: 5, name: 'Lisa Parker', avatar: null, status: 'online', lastSeen: 'Just now', unread: 1 },
];

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedContact, setSelectedContact] = useState(MOCK_CONTACTS[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Connect to WebSocket when component mounts or selectedContact changes
  useEffect(() => {
    // Reset messages when changing contacts
    setMessages([]);
    
    // Connect to WebSocket service
    webSocketService.connect(selectedContact.id);
    
    // Set up event listeners
    const handleOpen = () => {
      setIsConnected(true);
      toast({
        title: "Connected",
        description: `Connected to chat with ${selectedContact.name}`,
      });
    };
    
    const handleClose = () => {
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "You have been disconnected from the messaging service",
        variant: "destructive"
      });
    };
    
    const handleMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };
    
    const handleTyping = (isTyping: boolean) => {
      setIsTyping(isTyping);
    };
    
    // Register event handlers
    webSocketService.on('open', handleOpen);
    webSocketService.on('close', handleClose);
    webSocketService.on('message', handleMessage);
    webSocketService.on('typing', handleTyping);
    
    // Update connection status
    setIsConnected(webSocketService.isConnected());
    
    // Clean up event listeners on unmount
    return () => {
      webSocketService.off('open', handleOpen);
      webSocketService.off('close', handleClose);
      webSocketService.off('message', handleMessage);
      webSocketService.off('typing', handleTyping);
      webSocketService.disconnect();
    };
  }, [selectedContact, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !isConnected) return;
    
    // Send the message through the WebSocket service
    webSocketService.sendMessage(messageText);
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleContactSelect = (contact: typeof MOCK_CONTACTS[0]) => {
    if (contact.id !== selectedContact.id) {
      setSelectedContact(contact);
      
      // Update unread count
      const updatedContacts = MOCK_CONTACTS.map(c => 
        c.id === contact.id ? { ...c, unread: 0 } : c
      );
      // In a real app, you'd update the state or context with updated contacts
    }
  };

  return (
    <AppLayout className="p-0 pt-16 md:py-16 md:px-4">
      <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-white md:rounded-xl md:shadow-elevated">
        {/* Contacts Sidebar (hidden on mobile) */}
        <div className="hidden md:flex md:w-80 flex-col border-r border-border">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="relative mt-2">
              <Input 
                placeholder="Search conversations..." 
                className="pr-8"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {MOCK_CONTACTS.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleContactSelect(contact)}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary transition-colors",
                  selectedContact.id === contact.id && "bg-secondary"
                )}
              >
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={contact.avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-muted-foreground">{contact.lastSeen}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.status === 'online' ? (
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                          Online
                        </span>
                      ) : (
                        `Last seen ${contact.lastSeen}`
                      )}
                    </p>
                    {contact.unread > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={selectedContact.avatar || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedContact.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedContact.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedContact.status === 'online' ? (
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                      {isConnected ? 'Online' : 'Reconnecting...'}
                    </span>
                  ) : (
                    `Last seen ${selectedContact.lastSeen}`
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Image className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-secondary/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-muted-foreground max-w-md">
                  Send a message to {selectedContact.name} to start chatting
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === 'me' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl p-3",
                        msg.sender === 'me' 
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-accent rounded-tl-none"
                      )}
                    >
                      <p>{msg.text}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        msg.sender === 'me' ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-accent rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Empty div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="min-h-[40px] max-h-[120px] py-2 pr-12"
                  disabled={!isConnected}
                />
                <div className="absolute right-3 top-2 flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <MicIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || !isConnected}
                size="icon"
                className={isConnected ? "bg-primary" : "bg-muted"}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            
            {!isConnected && (
              <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 rounded-md flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
                <p className="text-xs">
                  Reconnecting to the messaging service...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Messages;
