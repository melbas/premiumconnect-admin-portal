
/**
 * Enhanced Chat Section Component
 * Composant de Section de Chat Amélioré
 * 
 * EN: Provides an AI-powered chat interface with multilingual support,
 *     cultural context adaptation, and real-time translation capabilities
 * FR: Fournit une interface de chat alimentée par l'IA avec support multilingue,
 *     adaptation du contexte culturel, et capacités de traduction en temps réel
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Globe, 
  Zap,
  Heart,
  DollarSign,
  Clock
} from "lucide-react";
import { EnhancedChatAIService, type EnhancedChatRequest, type EnhancedChatResponse } from "@/services/ai/enhancedChatAIService";
import { toast } from "sonner";

// EN: Interface for chat messages with metadata
// FR: Interface pour les messages de chat avec métadonnées
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language?: 'fr' | 'wo';
  sentiment?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  cost?: number;
  provider?: string;
}

// EN: Props interface for the EnhancedChatSection component
// FR: Interface des props pour le composant EnhancedChatSection
interface EnhancedChatSectionProps {
  userId?: string;
  initialLanguage?: 'fr' | 'wo';
  enableCulturalContext?: boolean;
}

/**
 * EN: Enhanced Chat Section component with AI capabilities
 * FR: Composant de section de chat amélioré avec capacités IA
 */
export function EnhancedChatSection({ 
  userId, 
  initialLanguage = 'fr',
  enableCulturalContext = true 
}: EnhancedChatSectionProps) {
  // EN: State management for chat functionality
  // FR: Gestion d'état pour les fonctionnalités de chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'wo'>(initialLanguage);
  const [totalCost, setTotalCost] = useState(0);
  const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // EN: Auto-scroll to bottom when new messages arrive
  // FR: Défilement automatique vers le bas lors de l'arrivée de nouveaux messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // EN: Focus input on component mount
  // FR: Focus sur l'input au montage du composant
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * EN: Handles sending a message to the AI chat service
   * FR: Gère l'envoi d'un message au service de chat IA
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    // EN: Add user message and clear input
    // FR: Ajouter le message utilisateur et vider l'input
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // EN: Prepare AI chat request with cultural context
      // FR: Préparer la requête de chat IA avec contexte culturel
      const chatRequest: EnhancedChatRequest = {
        message: messageToSend,
        conversationId,
        userId,
        language: currentLanguage,
        culturalContext: enableCulturalContext,
        enableRecommendations: true
      };

      console.log('🤖 Sending AI chat request:', chatRequest);

      // EN: Call the enhanced AI chat service
      // FR: Appeler le service de chat IA amélioré
      const response: EnhancedChatResponse = await EnhancedChatAIService.sendMessage(chatRequest);

      // EN: Create AI response message with metadata
      // FR: Créer le message de réponse IA avec métadonnées
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        content: response.response,
        sender: 'ai',
        timestamp: new Date(),
        language: currentLanguage,
        sentiment: response.sentiment,
        cost: response.cost,
        provider: response.provider
      };

      setMessages(prev => [...prev, aiMessage]);

      // EN: Update total cost tracking
      // FR: Mettre à jour le suivi des coûts totaux
      if (response.cost) {
        setTotalCost(prev => prev + response.cost);
      }

      // EN: Show recommendations if available
      // FR: Afficher les recommandations si disponibles
      if (response.recommendations && response.recommendations.length > 0) {
        const recommendationsText = currentLanguage === 'wo' 
          ? 'Sañ-sañ yu rafet:' 
          : 'Recommandations:';
        
        const recommendationsList = response.recommendations
          .map(rec => `• ${rec.title}: ${rec.description}`)
          .join('\n');

        const recommendationMessage: ChatMessage = {
          id: `msg_${Date.now()}_recommendations`,
          content: `${recommendationsText}\n\n${recommendationsList}`,
          sender: 'ai',
          timestamp: new Date(),
          language: currentLanguage
        };

        setMessages(prev => [...prev, recommendationMessage]);
      }

      // EN: Show success toast with provider info
      // FR: Afficher un toast de succès avec info du provider
      toast.success(
        currentLanguage === 'wo' 
          ? `Yaangi ñu response (${response.provider})` 
          : `Réponse reçue (${response.provider})`,
        {
          description: response.cost 
            ? `Coût: $${response.cost.toFixed(4)}` 
            : 'Cache local utilisé'
        }
      );

    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // EN: Add error message to chat
      // FR: Ajouter un message d'erreur au chat
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        content: currentLanguage === 'wo' 
          ? 'Mbaa problema am. Jànga koy seeti.' 
          : 'Désolé, une erreur est survenue. Veuillez réessayer.',
        sender: 'ai',
        timestamp: new Date(),
        language: currentLanguage
      };

      setMessages(prev => [...prev, errorMessage]);

      toast.error(
        currentLanguage === 'wo' ? 'Problema am' : 'Erreur',
        {
          description: currentLanguage === 'wo' 
            ? 'Jànga koy seeti' 
            : 'Veuillez réessayer'
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * EN: Handles Enter key press for sending messages
   * FR: Gère la pression de la touche Entrée pour envoyer des messages
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * EN: Toggles between French and Wolof languages
   * FR: Bascule entre les langues française et wolof
   */
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'fr' ? 'wo' : 'fr';
    setCurrentLanguage(newLanguage);
    
    toast.info(
      newLanguage === 'wo' ? 'Wolof la' : 'Français sélectionné',
      {
        description: newLanguage === 'wo' 
          ? 'Naka nga bëgg a teddooo ak man' 
          : 'Comment puis-je vous aider?'
      }
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            {currentLanguage === 'wo' ? 'Chat ak IA' : 'Chat avec IA'}
          </CardTitle>
          
          {/* EN: Language toggle and stats / FR: Basculeur de langue et statistiques */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              {currentLanguage.toUpperCase()}
            </Button>
            
            {totalCost > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${totalCost.toFixed(4)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* EN: Messages area / FR: Zone des messages */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-medium">
                {currentLanguage === 'wo' 
                  ? 'Naka nga bëgg a wax ak man?' 
                  : 'Comment puis-je vous aider?'}
              </p>
              <p className="text-sm mt-2">
                {currentLanguage === 'wo'
                  ? 'Chat ak IA bu rafet ci WiFi ak mobile money'
                  : 'Assistant IA pour WiFi et mobile money'}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'ai' && (
                    <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                  )}
                  {message.sender === 'user' && (
                    <User className="h-4 w-4 mt-0.5" />
                  )}
                  
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {/* EN: Message metadata / FR: Métadonnées du message */}
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString()}
                      
                      {message.sentiment && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            message.sentiment.sentiment === 'positive' ? 'border-green-500' :
                            message.sentiment.sentiment === 'negative' ? 'border-red-500' :
                            'border-gray-500'
                          }`}
                        >
                          {message.sentiment.sentiment === 'positive' && <Heart className="h-2 w-2 mr-1" />}
                          {message.sentiment.sentiment}
                        </Badge>
                      )}
                      
                      {message.cost && message.cost > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-2 w-2 mr-1" />
                          ${message.cost.toFixed(4)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* EN: Input area / FR: Zone de saisie */}
      <div className="p-4 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentLanguage === 'wo' 
                ? 'Bind sa lakk...' 
                : 'Tapez votre message...'
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="default"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* EN: Cultural context indicator / FR: Indicateur de contexte culturel */}
        {enableCulturalContext && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {currentLanguage === 'wo'
              ? 'Adaptation culturelle sénégalaise activée'
              : 'Adaptation culturelle sénégalaise activée'
            }
          </p>
        )}
      </div>
    </Card>
  );
}
