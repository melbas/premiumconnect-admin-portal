
import { useState, useCallback } from 'react';
import { chatAIService, type ChatConversation, type ChatMessage } from '@/services/chatAIService';

export interface ChatState {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  totalCost: number;
}

export const useChatAI = () => {
  const [state, setState] = useState<ChatState>({
    conversation: null,
    messages: [],
    isLoading: false,
    error: null,
    totalCost: 0
  });

  const createConversation = useCallback(async (userId?: string, sessionId?: string, context?: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const conversation = await chatAIService.createConversation(userId, sessionId, context);
      if (conversation) {
        setState(prev => ({ 
          ...prev, 
          conversation, 
          messages: [],
          isLoading: false 
        }));
        return conversation;
      } else {
        throw new Error('Impossible de créer la conversation');
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      }));
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (message: string, userId?: string, sessionId?: string) => {
    if (!state.conversation) {
      setState(prev => ({ ...prev, error: 'Aucune conversation active' }));
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Ajouter le message utilisateur à l'état local immédiatement
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: state.conversation.id,
        content: message,
        sender_type: 'user',
        tokens_used: 0,
        cost: 0,
        created_at: new Date().toISOString()
      };

      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, userMessage]
      }));

      const response = await chatAIService.sendMessage(
        state.conversation.id, 
        message, 
        userId, 
        sessionId
      );

      if (response) {
        // Ajouter la réponse IA à l'état local
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          conversation_id: state.conversation.id,
          content: response.response,
          sender_type: 'ai',
          ai_provider: response.provider,
          tokens_used: response.tokens_used || 0,
          cost: response.cost,
          created_at: new Date().toISOString()
        };

        setState(prev => ({ 
          ...prev, 
          messages: [...prev.messages, aiMessage],
          totalCost: prev.totalCost + response.cost,
          isLoading: false
        }));

        return response;
      } else {
        throw new Error('Impossible d\'obtenir une réponse');
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      }));
      return null;
    }
  }, [state.conversation]);

  const loadConversationHistory = useCallback(async (conversationId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const messages = await chatAIService.getConversationHistory(conversationId);
      const totalCost = messages.reduce((sum, msg) => sum + (msg.cost || 0), 0);
      
      setState(prev => ({ 
        ...prev, 
        messages,
        totalCost,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        isLoading: false 
      }));
    }
  }, []);

  const closeConversation = useCallback(async () => {
    if (!state.conversation) return false;

    try {
      const success = await chatAIService.closeConversation(state.conversation.id);
      if (success) {
        setState(prev => ({
          ...prev,
          conversation: prev.conversation ? { ...prev.conversation, status: 'closed' } : null
        }));
      }
      return success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
      return false;
    }
  }, [state.conversation]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetChat = useCallback(() => {
    setState({
      conversation: null,
      messages: [],
      isLoading: false,
      error: null,
      totalCost: 0
    });
  }, []);

  return {
    ...state,
    createConversation,
    sendMessage,
    loadConversationHistory,
    closeConversation,
    clearError,
    resetChat
  };
};
