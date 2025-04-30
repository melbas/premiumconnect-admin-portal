
import React, { useState } from "react";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

interface ChatSectionProps {
  initialMessages: Message[];
}

const ChatSection = ({ initialMessages }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log("Message sent:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="dashboard-card">
      <h2 className="font-medium text-lg mb-4">Chat Support</h2>
      <div className="flex flex-col h-[300px]">
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex flex-col ${
                message.sender === "admin" ? "items-start" : "items-end"
              }`}
            >
              <div 
                className={`px-3 py-2 rounded-lg max-w-[85%] ${
                  message.sender === "admin" 
                    ? "bg-muted text-foreground" 
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {message.timestamp}
              </span>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            type="submit"
            className="btn btn-primary"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;
