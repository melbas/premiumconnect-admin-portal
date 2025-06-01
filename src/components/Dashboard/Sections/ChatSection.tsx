
import React from "react";
import EnhancedChatSection from "./EnhancedChatSection";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

interface ChatSectionProps {
  initialMessages: Message[];
}

// Legacy wrapper for backward compatibility
const ChatSection = ({ initialMessages }: ChatSectionProps) => {
  return (
    <EnhancedChatSection 
      title="Chat Support IA"
      placeholder="Tapez votre message..."
      aiContext="support"
      enableMultilingual={true}
      enableRecommendations={true}
    />
  );
};

export default ChatSection;
