
import { supabase } from "@/integrations/supabase/client";

export interface AIProvider {
  id: string;
  name: string;
  provider_type: string;
  api_endpoint?: string;
  api_key_encrypted?: string;
  model_name?: string;
  pricing_per_1k_tokens: number;
  max_tokens: number;
  temperature: number;
  is_active: boolean;
  priority: number;
  fallback_provider_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChatConversation {
  id: string;
  user_id?: string;
  session_id?: string;
  conversation_type: string;
  status: string;
  user_satisfaction_score?: number;
  total_messages: number;
  total_cost: number;
  primary_provider_used?: string;
  context_data?: any;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'system';
  ai_provider?: string;
  response_time_ms?: number;
  tokens_used: number;
  cost: number;
  confidence_score?: number;
  metadata?: any;
  created_at: string;
}

export interface KnowledgeBaseItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  keywords: string[];
  priority: number;
  usage_count: number;
  is_active: boolean;
  context_triggers?: any;
  created_at: string;
  updated_at: string;
}

export interface ChatAnalytics {
  id: string;
  date: string;
  total_conversations: number;
  total_messages: number;
  avg_response_time_ms: number;
  total_cost: number;
  satisfaction_avg: number;
  provider_usage: any; // Changed from Record<string, number> to any to match Supabase Json type
  popular_questions: any;
  created_at: string;
}

/**
 * Service pour gérer le système de chat IA hybride
 */
export const chatAIService = {
  /**
   * Créer une nouvelle conversation
   */
  async createConversation(userId?: string, sessionId?: string, context?: any): Promise<ChatConversation | null> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-message-handler', {
        body: {
          action: 'create_conversation',
          userId,
          sessionId,
          context
        }
      });

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      return data.conversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      return null;
    }
  },

  /**
   * Envoyer un message et obtenir une réponse IA
   */
  async sendMessage(conversationId: string, message: string, userId?: string, sessionId?: string): Promise<{
    response: string;
    source: string;
    provider?: string;
    cost: number;
    tokens_used?: number;
  } | null> {
    try {
      // Sauvegarder le message utilisateur
      await supabase.functions.invoke('chat-message-handler', {
        body: {
          action: 'save_user_message',
          conversationId,
          message
        }
      });

      // Obtenir la réponse IA via le routeur
      const { data, error } = await supabase.functions.invoke('chat-ai-router', {
        body: {
          message,
          conversationId,
          userId,
          sessionId
        }
      });

      if (error) {
        console.error('Error getting AI response:', error);
        return null;
      }

      return {
        response: data.response,
        source: data.source,
        provider: data.provider,
        cost: data.cost || 0,
        tokens_used: data.tokens_used || 0
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  },

  /**
   * Récupérer l'historique d'une conversation
   */
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-message-handler', {
        body: {
          action: 'get_conversation_history',
          conversationId
        }
      });

      if (error) {
        console.error('Error getting conversation history:', error);
        return [];
      }

      return data.messages || [];
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      return [];
    }
  },

  /**
   * Fermer une conversation
   */
  async closeConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('chat-message-handler', {
        body: {
          action: 'close_conversation',
          conversationId
        }
      });

      if (error) {
        console.error('Error closing conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to close conversation:', error);
      return false;
    }
  },

  /**
   * Récupérer tous les providers IA
   */
  async getAllProviders(): Promise<AIProvider[]> {
    try {
      const { data, error } = await supabase
        .from('ai_providers_config')
        .select('*')
        .order('priority', { ascending: true });

      if (error) {
        console.error('Error fetching AI providers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch AI providers:', error);
      return [];
    }
  },

  /**
   * Créer ou mettre à jour un provider IA
   */
  async upsertProvider(provider: Omit<AIProvider, 'id' | 'created_at' | 'updated_at'>): Promise<AIProvider | null> {
    try {
      const { data, error } = await supabase
        .from('ai_providers_config')
        .upsert(provider)
        .select()
        .single();

      if (error) {
        console.error('Error upserting AI provider:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to upsert AI provider:', error);
      return null;
    }
  },

  /**
   * Récupérer la base de connaissances
   */
  async getKnowledgeBase(): Promise<KnowledgeBaseItem[]> {
    try {
      const { data, error } = await supabase
        .from('chat_knowledge_base')
        .select('*')
        .order('priority', { ascending: true });

      if (error) {
        console.error('Error fetching knowledge base:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch knowledge base:', error);
      return [];
    }
  },

  /**
   * Ajouter ou mettre à jour un élément de la base de connaissances
   */
  async upsertKnowledgeItem(item: Omit<KnowledgeBaseItem, 'id' | 'created_at' | 'updated_at'>): Promise<KnowledgeBaseItem | null> {
    try {
      const { data, error } = await supabase
        .from('chat_knowledge_base')
        .upsert(item)
        .select()
        .single();

      if (error) {
        console.error('Error upserting knowledge item:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to upsert knowledge item:', error);
      return null;
    }
  },

  /**
   * Récupérer les métriques de chat
   */
  async getChatAnalytics(startDate?: string, endDate?: string): Promise<ChatAnalytics[]> {
    try {
      let query = supabase
        .from('chat_analytics')
        .select('*')
        .order('date', { ascending: true });

      if (startDate) {
        query = query.gte('date', startDate);
      }

      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching chat analytics:', error);
        return [];
      }

      // Cast the data to match our interface
      return (data || []).map(item => ({
        ...item,
        provider_usage: item.provider_usage || {},
        popular_questions: item.popular_questions || {}
      })) as ChatAnalytics[];
    } catch (error) {
      console.error('Failed to fetch chat analytics:', error);
      return [];
    }
  }
};
