
import { chatAIService } from './chatAIService';
import { sentimentAnalysisService } from './ai/sentimentAnalysisService';
import { recommendationService } from './ai/recommendationService';
import { behaviorPredictionService } from './ai/behaviorPredictionService';
import { fraudDetectionService } from './ai/fraudDetectionService';

/**
 * Service IA enrichi pour le marché africain
 * Extension du chatAIService existant avec des capacités avancées
 */
export const enhancedChatAIService = {
  // Re-export des fonctions existantes
  ...chatAIService,

  /**
   * Chat IA avec analyse de sentiment et recommandations contextuelles
   */
  async sendEnhancedMessage(
    conversationId: string, 
    message: string, 
    userId?: string, 
    sessionId?: string,
    options?: {
      language?: string;
      culturalContext?: boolean;
      recommendations?: boolean;
      sentimentAnalysis?: boolean;
    }
  ) {
    try {
      console.log('🤖 Sending enhanced AI message with cultural context');

      // Analyse de sentiment du message utilisateur
      let sentimentData = null;
      if (options?.sentimentAnalysis !== false) {
        sentimentData = await sentimentAnalysisService.analyzeSentiment(
          message, 
          options?.language
        );
      }

      // Obtenir la réponse IA standard
      const response = await chatAIService.sendMessage(
        conversationId, 
        message, 
        userId, 
        sessionId
      );

      if (!response) return null;

      // Enrichir avec des recommandations si demandé
      let recommendations = null;
      if (options?.recommendations && userId) {
        recommendations = await recommendationService.generatePersonalizedRecommendations(
          userId,
          {
            language: (options.language as any) || 'fr',
            spendingPattern: 'medium',
            connectionFrequency: 'regular',
            contentPreferences: [],
            deviceType: 'mobile',
            locationPattern: []
          }
        );
      }

      // Adapter la réponse au contexte culturel
      let culturalResponse = response.response;
      if (options?.culturalContext && sentimentData) {
        culturalResponse = await this.adaptResponseToCulture(
          response.response,
          sentimentData,
          options.language || 'fr'
        );
      }

      return {
        ...response,
        response: culturalResponse,
        sentiment: sentimentData,
        recommendations: recommendations?.slice(0, 3) || [],
        culturalAdaptation: options?.culturalContext || false
      };
    } catch (error) {
      console.error('❌ Error in enhanced chat:', error);
      return chatAIService.sendMessage(conversationId, message, userId, sessionId);
    }
  },

  /**
   * Adapte la réponse au contexte culturel sénégalais
   */
  async adaptResponseToCulture(
    originalResponse: string,
    sentiment: any,
    language: string
  ): Promise<string> {
    const culturalAdaptations: Record<string, any> = {
      'wo': {
        greetings: ['As-salaamou aleykoum', 'Na nga def', 'Ni nga fii'],
        politeness: ['Waw, baax na', 'Jërejëf', 'Mën na la'],
        family: ['sa mbokk', 'sa ñoom', 'sa wa keur']
      },
      'fr': {
        greetings: ['Bonjour', 'Bonsoir selon l\'heure'],
        politeness: ['Avec plaisir', 'Volontiers', 'Bien sûr'],
        respect: ['Insha Allah', 'Si Dieu le veut']
      }
    };

    let adaptedResponse = originalResponse;

    // Ajouter des salutations culturelles appropriées
    if (sentiment?.sentiment === 'positive' && language === 'wo') {
      adaptedResponse = `Na nga def! ${adaptedResponse}`;
    }

    // Ajouter du contexte religieux approprié
    if (originalResponse.includes('demain') || originalResponse.includes('avenir')) {
      adaptedResponse += language === 'fr' ? ' Insha Allah.' : ' Bi Yalla bëgg.';
    }

    // Adapter le ton selon le sentiment
    if (sentiment?.sentiment === 'negative') {
      const empathy = language === 'wo' ? 'Dégg naa nit, am solo' : 'Je comprends votre préoccupation';
      adaptedResponse = `${empathy}. ${adaptedResponse}`;
    }

    return adaptedResponse;
  },

  /**
   * Analyse prédictive des besoins utilisateur
   */
  async analyzeUserNeeds(userId: string, conversationHistory: string[]) {
    try {
      const [behaviorPrediction, sentimentTrends] = await Promise.all([
        behaviorPredictionService.predictUserBehavior(userId),
        this.analyzeSentimentTrends(conversationHistory)
      ]);

      return {
        behaviorPrediction,
        sentimentTrends,
        recommendations: this.generateProactiveRecommendations(
          behaviorPrediction,
          sentimentTrends
        )
      };
    } catch (error) {
      console.error('Error analyzing user needs:', error);
      return null;
    }
  },

  /**
   * Analyse les tendances de sentiment dans l'historique
   */
  async analyzeSentimentTrends(messages: string[]) {
    try {
      const analyses = await sentimentAnalysisService.analyzeBatchSentiments(messages);
      
      const trends = {
        overall: this.calculateOverallSentiment(analyses),
        progression: this.calculateSentimentProgression(analyses),
        culturalPatterns: this.identifyCulturalPatterns(analyses)
      };

      return trends;
    } catch (error) {
      console.error('Error analyzing sentiment trends:', error);
      return null;
    }
  },

  /**
   * Génère des recommandations proactives
   */
  generateProactiveRecommendations(behaviorPrediction: any, sentimentTrends: any) {
    const recommendations = [];

    if (behaviorPrediction?.churnRisk > 0.7) {
      recommendations.push({
        type: 'retention',
        priority: 'high',
        message: 'Utilisateur à risque de désabonnement',
        action: 'offer_special_discount'
      });
    }

    if (sentimentTrends?.overall === 'negative') {
      recommendations.push({
        type: 'support',
        priority: 'medium',
        message: 'Sentiment négatif détecté',
        action: 'proactive_support_contact'
      });
    }

    if (behaviorPrediction?.localContext?.familyOriented) {
      recommendations.push({
        type: 'upsell',
        priority: 'low',
        message: 'Profil familial détecté',
        action: 'suggest_family_plan'
      });
    }

    return recommendations;
  },

  /**
   * Surveillance sécuritaire en temps réel
   */
  async performSecurityCheck(userId: string, message: string) {
    try {
      const [threats, sentiment] = await Promise.all([
        fraudDetectionService.detectAnomalies(userId),
        sentimentAnalysisService.analyzeSentiment(message)
      ]);

      // Vérifier des patterns suspects dans le message
      const suspiciousPatterns = [
        'partager mot de passe',
        'vendre compte',
        'multiple connexions'
      ];

      const hasSuspiciousContent = suspiciousPatterns.some(pattern =>
        message.toLowerCase().includes(pattern)
      );

      return {
        threats,
        sentimentRisk: sentiment.sentiment === 'negative' && sentiment.confidence > 0.8,
        suspiciousContent: hasSuspiciousContent,
        overallRisk: threats.length > 0 || hasSuspiciousContent ? 'high' : 'low'
      };
    } catch (error) {
      console.error('Error in security check:', error);
      return { overallRisk: 'unknown' };
    }
  },

  // Méthodes utilitaires
  calculateOverallSentiment(analyses: any[]) {
    if (analyses.length === 0) return 'neutral';
    
    const sentimentScores = analyses.map(a => {
      if (a.sentiment === 'positive') return 1;
      if (a.sentiment === 'negative') return -1;
      return 0;
    });

    const average = sentimentScores.reduce((sum, score) => sum + score, 0) / analyses.length;
    
    if (average > 0.3) return 'positive';
    if (average < -0.3) return 'negative';
    return 'neutral';
  },

  calculateSentimentProgression(analyses: any[]) {
    if (analyses.length < 2) return 'stable';

    const recent = analyses.slice(-3);
    const older = analyses.slice(0, -3);

    const recentScore = this.getAverageSentimentScore(recent);
    const olderScore = this.getAverageSentimentScore(older);

    if (recentScore > olderScore + 0.3) return 'improving';
    if (recentScore < olderScore - 0.3) return 'declining';
    return 'stable';
  },

  identifyCulturalPatterns(analyses: any[]) {
    const patterns = {
      wolofUsage: analyses.filter(a => a.language === 'wo').length,
      familyMentions: analyses.filter(a => 
        a.localInsights?.some(insight => insight.includes('famille'))
      ).length,
      religiousContext: analyses.filter(a =>
        a.culturalContext?.includes('religieux')
      ).length
    };

    return patterns;
  },

  getAverageSentimentScore(analyses: any[]) {
    if (analyses.length === 0) return 0;
    
    const scores = analyses.map(a => {
      if (a.sentiment === 'positive') return a.confidence;
      if (a.sentiment === 'negative') return -a.confidence;
      return 0;
    });

    return scores.reduce((sum, score) => sum + score, 0) / analyses.length;
  }
};
