
import { supabase } from "@/integrations/supabase/client";

export interface UserRecommendation {
  id: string;
  type: 'plan' | 'content' | 'offer' | 'game';
  title: string;
  description: string;
  score: number;
  reason: string;
  culturalContext?: string;
  localizedPrice?: string;
}

export interface UserPreferences {
  language: 'fr' | 'wo' | 'ff' | 'en';
  spendingPattern: 'low' | 'medium' | 'high';
  connectionFrequency: 'occasional' | 'regular' | 'frequent';
  contentPreferences: string[];
  deviceType: 'mobile' | 'desktop' | 'tablet';
  locationPattern: string[];
}

export interface LocalMarketContext {
  averageIncome: number;
  popularPaymentMethods: string[];
  culturalEvents: string[];
  seasonalTrends: string[];
  localCompetitors: string[];
}

export const recommendationService = {
  /**
   * Génère des recommandations personnalisées basées sur le contexte africain
   */
  async generatePersonalizedRecommendations(
    userId: string, 
    preferences: UserPreferences,
    marketContext?: LocalMarketContext
  ): Promise<UserRecommendation[]> {
    try {
      console.log('🎯 Generating personalized recommendations for user:', userId);

      // Récupérer l'historique utilisateur
      const userHistory = await this.getUserBehaviorHistory(userId);
      
      // Analyser les patterns locaux
      const localPatterns = await this.analyzeLocalPatterns(preferences.language);
      
      // Générer les recommandations via IA
      const recommendations = await this.generateAIRecommendations(
        userHistory,
        preferences,
        localPatterns,
        marketContext
      );

      // Adapter au contexte sénégalais
      const localizedRecommendations = await this.localizeRecommendations(
        recommendations,
        preferences
      );

      console.log('✅ Generated recommendations:', localizedRecommendations.length);
      return localizedRecommendations;
    } catch (error) {
      console.error('❌ Error generating recommendations:', error);
      return this.getFallbackRecommendations(preferences);
    }
  },

  /**
   * Analyse les patterns de comportement locaux
   */
  async analyzeLocalPatterns(language: string) {
    const { data: patterns } = await supabase
      .from('user_segments')
      .select('*')
      .contains('criteria', { language });

    return {
      popularTimeSlots: ['18:00-22:00', '12:00-14:00'], // Heures de pointe au Sénégal
      culturalPreferences: language === 'wo' ? ['musique_locale', 'actualites_senegal'] : ['international'],
      seasonalTrends: this.getSeasonalTrends(),
      localEvents: ['tabaski', 'korité', 'magal']
    };
  },

  /**
   * Génère des recommandations via IA
   */
  async generateAIRecommendations(
    userHistory: any,
    preferences: UserPreferences,
    localPatterns: any,
    marketContext?: LocalMarketContext
  ): Promise<UserRecommendation[]> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          userHistory,
          preferences,
          localPatterns,
          marketContext,
          context: 'senegal_market'
        }
      });

      if (error) throw error;
      return data.recommendations || [];
    } catch (error) {
      console.error('AI recommendation error:', error);
      return [];
    }
  },

  /**
   * Localise les recommandations pour le marché sénégalais
   */
  async localizeRecommendations(
    recommendations: UserRecommendation[],
    preferences: UserPreferences
  ): Promise<UserRecommendation[]> {
    return recommendations.map(rec => ({
      ...rec,
      title: this.translateContent(rec.title, preferences.language),
      description: this.translateContent(rec.description, preferences.language),
      localizedPrice: this.convertToLocalCurrency(rec.type),
      culturalContext: this.addCulturalContext(rec.type, preferences.language)
    }));
  },

  /**
   * Récupère l'historique comportemental de l'utilisateur
   */
  async getUserBehaviorHistory(userId: string) {
    const { data: sessions } = await supabase
      .from('wifi_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(50);

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    return { sessions: sessions || [], events: events || [] };
  },

  /**
   * Traduit le contenu selon la langue
   */
  translateContent(content: string, language: string): string {
    // Implémentation basique - à enrichir avec un service de traduction IA
    const translations: Record<string, Record<string, string>> = {
      'wo': {
        'WiFi Plan': 'Connections WiFi',
        'Premium': 'Premium',
        'Game': 'Wale',
        'Special Offer': 'Promotion bu bees'
      },
      'fr': {
        'WiFi Plan': 'Forfait WiFi',
        'Premium': 'Premium',
        'Game': 'Jeu',
        'Special Offer': 'Offre Spéciale'
      }
    };

    return translations[language]?.[content] || content;
  },

  /**
   * Convertit en devise locale
   */
  convertToLocalCurrency(type: string): string {
    const prices: Record<string, string> = {
      'plan': '500 FCFA',
      'premium': '1500 FCFA',
      'game': 'Gratuit',
      'offer': '300 FCFA'
    };
    return prices[type] || 'N/A';
  },

  /**
   * Ajoute le contexte culturel
   */
  addCulturalContext(type: string, language: string): string {
    if (language === 'wo') {
      return type === 'game' ? 'Wale yi nekk ci mbir' : 'Connections bu rafet';
    }
    return type === 'game' ? 'Adapté à la culture locale' : 'Optimisé pour le Sénégal';
  },

  /**
   * Obtient les tendances saisonnières
   */
  getSeasonalTrends() {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) { // Saison des pluies
      return ['indoor_entertainment', 'family_plans', 'video_content'];
    }
    return ['outdoor_events', 'social_gaming', 'music_streaming'];
  },

  /**
   * Recommandations de secours
   */
  getFallbackRecommendations(preferences: UserPreferences): UserRecommendation[] {
    return [
      {
        id: 'fallback-1',
        type: 'plan',
        title: 'Forfait Étudiant',
        description: 'Parfait pour les étudiants sénégalais',
        score: 0.8,
        reason: 'Adapté aux besoins locaux',
        localizedPrice: '300 FCFA'
      },
      {
        id: 'fallback-2',
        type: 'content',
        title: 'Actualités Locales',
        description: 'Restez connecté avec le Sénégal',
        score: 0.7,
        reason: 'Contenu local populaire',
        culturalContext: 'Information locale'
      }
    ];
  }
};
