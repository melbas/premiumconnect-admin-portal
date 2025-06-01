import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Brain, Globe, Shield } from "lucide-react";
import { useChatAI } from "@/hooks/use-chat-ai";
import { enhancedChatAIService } from "@/services/enhancedChatAIService";
import { useAuth } from "@/context/AuthContext";

interface EnhancedMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  language?: string;
  sentiment?: any;
  recommendations?: any[];
  culturalAdaptation?: boolean;
}

interface EnhancedChatSectionProps {
  title?: string;
  placeholder?: string;
  aiContext?: 'captive-portal' | 'support' | 'onboarding';
  enableMultilingual?: boolean;
  enableRecommendations?: boolean;
}

const EnhancedChatSection: React.FC<EnhancedChatSectionProps> = ({
  title = "Assistant IA Intelligent",
  placeholder = "Tapez votre message...",
  aiContext = 'captive-portal',
  enableMultilingual = true,
  enableRecommendations = true
}) => {
  const { user } = useAuth();
  const { conversation, createConversation, sendMessage, isLoading, error } = useChatAI();
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>('fr');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversation && user?.id) {
      initializeConversation();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = async () => {
    const context = {
      type: aiContext,
      language: 'fr',
      culturalContext: 'senegal',
      features: {
        multilingual: enableMultilingual,
        recommendations: enableRecommendations,
        sentimentAnalysis: true
      }
    };

    await createConversation(user?.id, undefined, context);

    // Message de bienvenue adapté
    const welcomeMessage: EnhancedMessage = {
      id: 'welcome',
      content: getWelcomeMessage(aiContext),
      sender: 'ai',
      timestamp: new Date().toISOString(),
      language: 'fr',
      culturalAdaptation: true
    };

    setMessages([welcomeMessage]);
  };

  const getWelcomeMessage = (context: string): string => {
    const messages = {
      'captive-portal': 'As-salaamou aleykoum ! Je suis votre assistant WiFi intelligent. Comment puis-je vous aider aujourd\'hui ? 🇸🇳',
      'support': 'Bonjour ! Je suis là pour vous aider avec vos questions techniques.',
      'onboarding': 'Bienvenue ! Laissez-moi vous guider pour votre première connexion.'
    };
    return messages[context] || messages['captive-portal'];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || isLoading) return;

    const userMessage: EnhancedMessage = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      language: detectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await enhancedChatAIService.sendEnhancedMessage(
        conversation.id,
        newMessage,
        user?.id,
        undefined,
        {
          language: detectedLanguage,
          culturalContext: true,
          recommendations: enableRecommendations,
          sentimentAnalysis: true
        }
      );

      if (response) {
        const aiMessage: EnhancedMessage = {
          id: `ai-${Date.now()}`,
          content: response.response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          language: detectedLanguage,
          sentiment: 'sentiment' in response ? response.sentiment : null,
          recommendations: 'recommendations' in response ? response.recommendations : [],
          culturalAdaptation: 'culturalAdaptation' in response ? response.culturalAdaptation : false
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending enhanced message:', error);
    }
  };

  const handleLanguageDetection = (text: string) => {
    // Détection basique de langue
    const wolofWords = ['nit', 'yow', 'man', 'waaw', 'dëgg'];
    const hasWolof = wolofWords.some(word => text.toLowerCase().includes(word));
    
    if (hasWolof) {
      setDetectedLanguage('wo');
    } else {
      setDetectedLanguage('fr');
    }
  };

  const getSentimentBadge = (sentiment: any) => {
    if (!sentiment) return null;
    
    const colors = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[sentiment.sentiment] || colors.neutral}>
        {sentiment.sentiment} ({Math.round(sentiment.confidence * 100)}%)
      </Badge>
    );
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          {title}
          {enableMultilingual && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {detectedLanguage.toUpperCase()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex flex-col ${
                message.sender === "ai" ? "items-start" : "items-end"
              }`}
            >
              <div 
                className={`px-4 py-3 rounded-lg max-w-[85%] ${
                  message.sender === "ai" 
                    ? "bg-blue-50 text-blue-900 border border-blue-200" 
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {/* Sentiment et adaptations culturelles */}
                {message.sender === 'ai' && (message.sentiment || message.culturalAdaptation) && (
                  <div className="flex gap-2 mt-2">
                    {getSentimentBadge(message.sentiment)}
                    {message.culturalAdaptation && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Adapté culturellement
                      </Badge>
                    )}
                  </div>
                )}

                {/* Recommandations */}
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-blue-700">Recommandations :</p>
                    {message.recommendations.slice(0, 2).map((rec, idx) => (
                      <div key={idx} className="bg-white p-2 rounded border text-xs">
                        <p className="font-medium">{rec.title}</p>
                        <p className="text-gray-600">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {message.language && message.language !== 'fr' && (
                  <Badge variant="outline" className="text-xs">
                    {message.language.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">L'IA réfléchit...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleLanguageDetection(e.target.value);
            }}
            placeholder={placeholder}
            disabled={isLoading || !conversation}
            className="flex-1 px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <Button 
            type="submit"
            disabled={isLoading || !conversation || !newMessage.trim()}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedChatSection;
