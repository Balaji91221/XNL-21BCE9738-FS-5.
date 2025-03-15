
// This is a mock WebSocket service that simulates real-time messaging
// In a real app, you would use an actual WebSocket connection

export interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

type MessageCallback = (message: Message) => void;
type ConnectionCallback = () => void;

class WebSocketService {
  private callbacks: { [key: string]: Function[] } = {
    message: [],
    open: [],
    close: [],
    typing: []
  };
  private connected: boolean = false;
  private mockMessages: Message[] = [
    { id: 1, sender: 'other', text: 'Hey there! How are you doing?', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: 2, sender: 'me', text: 'I\'m doing great! Just finished that project we talked about.', timestamp: new Date(Date.now() - 24 * 60000).toISOString() },
    { id: 3, sender: 'other', text: 'That\'s awesome! Can you show me a preview?', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
  ];
  private connectionLatency: number = 500; // Simulated network latency
  private responseLatency: number = 1500; // Simulated response time
  private typingTimeout: NodeJS.Timeout | null = null;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private connectionDropInterval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('WebSocket service initialized');
  }

  connect(contactId?: number): void {
    // Simulate connection establishment with delay
    setTimeout(() => {
      this.connected = true;
      this.executeCallbacks('open');
      
      // Load initial messages
      setTimeout(() => {
        this.mockMessages.forEach(message => {
          this.executeCallbacks('message', message);
        });
      }, 300);
      
      // Set up occasional connection drops for realism
      this.setupConnectionDrops();
      
    }, this.connectionLatency);
  }

  disconnect(): void {
    if (this.connected) {
      this.connected = false;
      this.executeCallbacks('close');
      
      // Clear all intervals
      if (this.typingTimeout) clearTimeout(this.typingTimeout);
      if (this.reconnectInterval) clearInterval(this.reconnectInterval);
      if (this.connectionDropInterval) clearInterval(this.connectionDropInterval);
    }
  }

  sendMessage(text: string): void {
    if (!this.connected) {
      console.warn('Cannot send message: not connected');
      return;
    }

    const newId = this.mockMessages.length + 1;
    const newMessage: Message = {
      id: newId,
      sender: 'me',
      text,
      timestamp: new Date().toISOString()
    };
    
    // Add to mock data and notify
    this.mockMessages.push(newMessage);
    this.executeCallbacks('message', newMessage);
    
    // Simulate "other user" typing
    setTimeout(() => {
      this.executeCallbacks('typing', true);
      
      // Simulate a response after a delay
      this.typingTimeout = setTimeout(() => {
        const responseMsg: Message = {
          id: this.mockMessages.length + 1,
          sender: 'other',
          text: this.generateResponse(text),
          timestamp: new Date().toISOString()
        };
        this.mockMessages.push(responseMsg);
        this.executeCallbacks('typing', false);
        this.executeCallbacks('message', responseMsg);
      }, this.responseLatency + Math.random() * 2000);
    }, 500);
  }

  on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.callbacks[event]) return;
    this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Private methods
  private executeCallbacks(event: string, data?: any): void {
    if (!this.callbacks[event]) return;
    this.callbacks[event].forEach(callback => {
      callback(data);
    });
  }

  private generateResponse(message: string): string {
    // Simple response generator based on the incoming message
    const responses = [
      `Thanks for your message: "${message.substring(0, 20)}${message.length > 20 ? '...' : ''}"`,
      "That's interesting! Tell me more about it.",
      "I see what you mean. What do you think we should do next?",
      "Great! I'll keep that in mind.",
      "I agree with you. Let's discuss this further soon.",
      "Thanks for sharing that with me!"
    ];
    
    // If the message is a question, generate a question-specific response
    if (message.endsWith('?')) {
      const questionResponses = [
        "That's a good question. Let me think about it.",
        "I'm not entirely sure, but I think so.",
        "Yes, absolutely!",
        "No, I don't think that's the case.",
        "Maybe, let me check and get back to you."
      ];
      return questionResponses[Math.floor(Math.random() * questionResponses.length)];
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private setupConnectionDrops(): void {
    // Occasionally drop the connection to simulate real network conditions
    this.connectionDropInterval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance of connection drop
        this.connected = false;
        this.executeCallbacks('close');
        console.log('WebSocket connection dropped');
        
        // Try to reconnect after a short delay
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          this.connected = true;
          this.executeCallbacks('open');
        }, 3000);
      }
    }, 30000); // Check every 30 seconds
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
