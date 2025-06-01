
/**
 * Enhanced AI Chat Service for Senegalese Context
 * Service de Chat IA Amélioré pour le Contexte Sénégalais
 * 
 * EN: Provides intelligent chat functionality with cultural adaptation, 
 *     multilingual support (FR/Wolof), and cost optimization
 * FR: Fournit des fonctionnalités de chat intelligent avec adaptation culturelle,
 *     support multilingue (FR/Wolof), et optimisation des coûts
 */

import { supabase } from "@/integrations/supabase/client";

// EN: Interface for chat requests with cultural context options
// FR: Interface pour les requêtes de chat avec options de contexte culturel
export interface EnhancedChatRequest {
  message: string;
  conversationId: string;
  userId?: string;
  language?: 'fr' | 'wo'; // French or Wolof
  culturalContext?: boolean; // Enable cultural adaptation
  enableRecommendations?: boolean; // Generate contextual recommendations
}

// EN: Response structure with AI provider information and cultural adaptation
// FR: Structure de réponse avec informations du provider IA et adaptation culturelle
export interface EnhancedChatResponse {
  response: string;
  source: 'knowledge_base' | 'ai_provider';
  provider?: 'openai' | 'local_cache';
  cost?: number;
  tokens_used?: number;
  sentiment?: {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    language: string;
  };
  recommendations?: Array<{
    title: string;
    description: string;
    type: string;
  }>;
  culturalAdaptation?: boolean;
}

/**
 * EN: Main service class for enhanced AI chat functionality
 * FR: Classe de service principale pour les fonctionnalités de chat IA amélioré
 */
export class EnhancedChatAIService {
  
  /**
   * EN: Sends a message to the AI chat service with cultural context
   * FR: Envoie un message au service de chat IA avec contexte culturel
   * 
   * @param request - Chat request with message and context options
   * @returns Promise<EnhancedChatResponse> - AI response with cultural adaptation
   */
  static async sendMessage(request: EnhancedChatRequest): Promise<EnhancedChatResponse> {
    try {
      console.log('🤖 Sending enhanced AI chat request:', {
        language: request.language,
        culturalContext: request.culturalContext,
        messageLength: request.message.length
      });

      // EN: Call the Supabase Edge Function for AI chat processing
      // FR: Appeler la fonction Edge Supabase pour le traitement du chat IA
      const { data, error } = await supabase.functions.invoke('ai-chat-enhanced', {
        body: {
          message: request.message,
          conversationId: request.conversationId,
          userId: request.userId,
          language: request.language || 'fr',
          culturalContext: request.culturalContext ?? true,
          enableRecommendations: request.enableRecommendations ?? true
        }
      });

      if (error) {
        console.error('❌ Error calling AI chat function:', error);
        throw new Error(`AI Chat Error: ${error.message}`);
      }

      // EN: Log successful response for analytics
      // FR: Logger la réponse réussie pour les analytics
      console.log('✅ AI Chat response received:', {
        source: data.source,
        provider: data.provider,
        cost: data.cost,
        culturalAdaptation: data.culturalAdaptation
      });

      return data as EnhancedChatResponse;

    } catch (error) {
      console.error('❌ Enhanced Chat AI Service Error:', error);
      
      // EN: Return fallback response in case of error
      // FR: Retourner une réponse de secours en cas d'erreur
      return {
        response: request.language === 'wo' 
          ? 'Mbaa problema am. Jànga koy seeti.' 
          : 'Désolé, je rencontre un problème technique. Veuillez réessayer.',
        source: 'knowledge_base',
        provider: 'local_cache',
        cost: 0,
        culturalAdaptation: false
      };
    }
  }

  /**
   * EN: Translates text between French and Wolof using AI
   * FR: Traduit le texte entre le français et le wolof en utilisant l'IA
   * 
   * @param text - Text to translate
   * @param from - Source language ('fr' or 'wo')
   * @param to - Target language ('fr' or 'wo') 
   * @param context - Context for better translation (wifi, payment, support, general)
   */
  static async translateText(
    text: string, 
    from: 'fr' | 'wo', 
    to: 'fr' | 'wo',
    context: 'wifi' | 'payment' | 'support' | 'general' = 'general'
  ): Promise<{ translatedText: string; source: string; cost: number }> {
    try {
      console.log('🌍 Requesting translation:', { from, to, context, textLength: text.length });

      const { data, error } = await supabase.functions.invoke('ai-translation', {
        body: { text, from, to, context }
      });

      if (error) {
        throw new Error(`Translation Error: ${error.message}`);
      }

      console.log('✅ Translation completed:', {
        source: data.source,
        cost: data.cost
      });

      return data;
    } catch (error) {
      console.error('❌ Translation service error:', error);
      return {
        translatedText: text, // Return original text as fallback
        source: 'error',
        cost: 0
      };
    }
  }

  /**
   * EN: Gets AI-powered insights for business analytics
   * FR: Obtient des insights alimentés par l'IA pour l'analytics business
   */
  static async getAIInsights(
    type: 'user_behavior' | 'network_optimization' | 'revenue_prediction' | 'anomaly_detection',
    timeframe: string = '7d',
    userId?: string
  ) {
    try {
      console.log('📊 Requesting AI insights:', { type, timeframe });

      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { type, timeframe, userId }
      });

      if (error) {
        throw new Error(`AI Insights Error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('❌ AI Insights service error:', error);
      throw error;
    }
  }

  /**
   * EN: Gets mobile money assistance with AI recommendations
   * FR: Obtient une assistance mobile money avec des recommandations IA
   */
  static async getMobileMoneyAssistance(
    amount: number,
    context: 'wifi_payment' | 'family_plan' | 'business_plan' | 'student_plan',
    language: 'fr' | 'wo' = 'fr',
    userId?: string,
    location?: string
  ) {
    try {
      console.log('💳 Requesting mobile money assistance:', { amount, context, language });

      const { data, error } = await supabase.functions.invoke('ai-mobile-money', {
        body: { amount, context, language, userId, location }
      });

      if (error) {
        throw new Error(`Mobile Money AI Error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Mobile Money AI service error:', error);
      throw error;
    }
  }
}
