
import { supabase } from "@/integrations/supabase/client";

export interface BehaviorPrediction {
  userId: string;
  predictedActions: PredictedAction[];
  churnRisk: number;
  lifetimeValue: number;
  nextPurchaseProbability: number;
  recommendedInterventions: string[];
  culturalFactors: string[];
  localContext: LocalBehaviorContext;
}

export interface PredictedAction {
  action: string;
  probability: number;
  timeframe: string;
  confidence: number;
  culturalInfluence: number;
}

export interface LocalBehaviorContext {
  economicSegment: 'low' | 'medium' | 'high';
  socialInfluence: number;
  familyOriented: boolean;
  religiousEvents: string[];
  seasonalPatterns: string[];
}

export const behaviorPredictionService = {
  /**
   * Prédit les comportements utilisateur selon les habitudes sénégalaises
   */
  async predictUserBehavior(userId: string): Promise<BehaviorPrediction> {
    try {
      console.log('🔮 Predicting user behavior for:', userId);

      const userHistory = await this.getUserCompleteHistory(userId);
      const localContext = await this.getLocalBehaviorContext(userId);
      const culturalFactors = await this.analyzeCulturalFactors(userId);
      
      const predictions = await this.generateBehaviorPredictions(
        userHistory,
        localContext,
        culturalFactors
      );

      console.log('✅ Behavior prediction completed');
      return predictions;
    } catch (error) {
      console.error('❌ Error in behavior prediction:', error);
      return this.getFallbackPrediction(userId);
    }
  },

  /**
   * Récupère l'historique complet de l'utilisateur
   */
  async getUserCompleteHistory(userId: string) {
    const [sessions, transactions, events, user] = await Promise.all([
      supabase.from('wifi_sessions').select('*').eq('user_id', userId),
      supabase.from('transactions').select('*').eq('user_id', userId),
      supabase.from('events').select('*').eq('user_id', userId),
      supabase.from('wifi_users').select('*').eq('id', userId).single()
    ]);

    return {
      sessions: sessions.data || [],
      transactions: transactions.data || [],
      events: events.data || [],
      user: user.data,
      joinDate: user.data?.created_at,
      loyaltyPoints: user.data?.loyalty_points || 0
    };
  },

  /**
   * Obtient le contexte comportemental local
   */
  async getLocalBehaviorContext(userId: string): Promise<LocalBehaviorContext> {
    const { data: user } = await supabase
      .from('wifi_users')
      .select('*')
      .eq('id', userId)
      .single();

    // Analyse basée sur les patterns locaux sénégalais
    const preferences = user?.preferences || {};
    
    return {
      economicSegment: this.determineEconomicSegment(user),
      socialInfluence: this.calculateSocialInfluence(preferences),
      familyOriented: this.isFamilyOriented(preferences),
      religiousEvents: this.getRelevantReligiousEvents(),
      seasonalPatterns: this.getSeasonalBehaviorPatterns()
    };
  },

  /**
   * Analyse les facteurs culturels sénégalais
   */
  async analyzeCulturalFactors(userId: string): Promise<string[]> {
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    const factors: string[] = [];
    const eventData = events || [];

    // Facteurs de "teranga" (hospitalité sénégalaise)
    if (this.hasShareBehavior(eventData)) {
      factors.push('teranga_hospitality');
    }

    // Facteurs religieux
    if (this.hasReligiousPatterns(eventData)) {
      factors.push('religious_observance');
    }

    // Facteurs familiaux
    if (this.hasFamilyPatterns(eventData)) {
      factors.push('family_centered');
    }

    // Facteurs économiques (système tontine, etc.)
    if (this.hasCollectiveEconomicBehavior(eventData)) {
      factors.push('collective_economy');
    }

    // Facteurs linguistiques
    factors.push(...this.getLanguageCulturalFactors(eventData));

    return factors;
  },

  /**
   * Génère les prédictions comportementales
   */
  async generateBehaviorPredictions(
    userHistory: any,
    localContext: LocalBehaviorContext,
    culturalFactors: string[]
  ): Promise<BehaviorPrediction> {
    const predictedActions = await this.predictSpecificActions(userHistory, localContext);
    const churnRisk = this.calculateChurnRisk(userHistory, localContext);
    const lifetimeValue = this.predictLifetimeValue(userHistory, localContext);
    const nextPurchaseProbability = this.predictNextPurchase(userHistory, localContext);
    const interventions = this.recommendInterventions(churnRisk, localContext, culturalFactors);

    return {
      userId: userHistory.user?.id || '',
      predictedActions,
      churnRisk,
      lifetimeValue,
      nextPurchaseProbability,
      recommendedInterventions: interventions,
      culturalFactors,
      localContext
    };
  },

  /**
   * Prédit des actions spécifiques
   */
  async predictSpecificActions(userHistory: any, localContext: LocalBehaviorContext): Promise<PredictedAction[]> {
    const actions: PredictedAction[] = [];

    // Prédiction d'achat pendant les événements religieux
    if (localContext.religiousEvents.length > 0) {
      actions.push({
        action: 'purchase_religious_event',
        probability: localContext.familyOriented ? 0.8 : 0.6,
        timeframe: 'next_religious_event',
        confidence: 0.7,
        culturalInfluence: 0.9
      });
    }

    // Prédiction de partage familial
    if (localContext.familyOriented) {
      actions.push({
        action: 'family_plan_upgrade',
        probability: 0.7,
        timeframe: '30_days',
        confidence: 0.8,
        culturalInfluence: 0.8
      });
    }

    // Prédiction de sensibilité au prix (important au Sénégal)
    if (localContext.economicSegment === 'low') {
      actions.push({
        action: 'seek_promotions',
        probability: 0.9,
        timeframe: '7_days',
        confidence: 0.9,
        culturalInfluence: 0.6
      });
    }

    // Prédiction d'usage social
    const socialUsage = this.calculateSocialUsagePattern(userHistory);
    if (socialUsage > 0.7) {
      actions.push({
        action: 'social_feature_adoption',
        probability: 0.8,
        timeframe: '14_days',
        confidence: 0.7,
        culturalInfluence: 0.8
      });
    }

    return actions;
  },

  /**
   * Calcule le risque de désabonnement
   */
  calculateChurnRisk(userHistory: any, localContext: LocalBehaviorContext): number {
    let risk = 0.3; // Risque de base

    // Facteurs d'augmentation du risque
    const daysSinceLastConnection = this.getDaysSinceLastConnection(userHistory.sessions);
    if (daysSinceLastConnection > 14) risk += 0.3;
    if (daysSinceLastConnection > 30) risk += 0.4;

    // Facteurs économiques (très important au Sénégal)
    if (localContext.economicSegment === 'low') {
      risk += 0.2;
    }

    // Facteurs de réduction du risque
    if (localContext.familyOriented) risk -= 0.15; // Les plans familiaux sont plus stables
    if (userHistory.loyaltyPoints > 1000) risk -= 0.1;

    // Facteurs saisonniers
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 6 && currentMonth <= 9) { // Saison des pluies
      risk += 0.1; // Plus de risque pendant la saison économiquement difficile
    }

    return Math.max(0, Math.min(1, risk));
  },

  /**
   * Prédit la valeur vie client
   */
  predictLifetimeValue(userHistory: any, localContext: LocalBehaviorContext): number {
    let baseValue = 5000; // FCFA de base

    // Ajustements basés sur le contexte économique
    if (localContext.economicSegment === 'high') baseValue *= 3;
    else if (localContext.economicSegment === 'medium') baseValue *= 1.5;

    // Bonus familial (important dans la culture sénégalaise)
    if (localContext.familyOriented) baseValue *= 1.4;

    // Ajustement sur l'historique
    const avgTransactionValue = this.calculateAverageTransactionValue(userHistory.transactions);
    if (avgTransactionValue > 0) {
      baseValue = baseValue * 0.7 + avgTransactionValue * 24 * 0.3; // 24 mois de prédiction
    }

    return Math.round(baseValue);
  },

  /**
   * Prédit la probabilité du prochain achat
   */
  predictNextPurchase(userHistory: any, localContext: LocalBehaviorContext): number {
    let probability = 0.4; // Base

    // Facteurs d'augmentation
    const daysSinceLastPurchase = this.getDaysSinceLastPurchase(userHistory.transactions);
    if (daysSinceLastPurchase > 30) probability += 0.3;

    // Événements religieux proches
    if (this.isReligiousEventNear()) probability += 0.2;

    // Facteurs économiques
    if (localContext.economicSegment === 'low') {
      probability *= 0.7; // Moins probable mais plus sensible aux promotions
    }

    // Patterns familiaux
    if (localContext.familyOriented && this.isWeekend()) {
      probability += 0.15;
    }

    return Math.max(0, Math.min(1, probability));
  },

  /**
   * Recommande des interventions
   */
  recommendInterventions(
    churnRisk: number,
    localContext: LocalBehaviorContext,
    culturalFactors: string[]
  ): string[] {
    const interventions: string[] = [];

    if (churnRisk > 0.7) {
      interventions.push('Offre de rétention urgente');
      interventions.push('Contact personnel en wolof si approprié');
    }

    if (churnRisk > 0.5) {
      interventions.push('Promotion ciblée selon le segment économique');
    }

    if (localContext.familyOriented) {
      interventions.push('Proposition de plan familial');
    }

    if (culturalFactors.includes('religious_observance')) {
      interventions.push('Offres spéciales pour événements religieux');
    }

    if (localContext.economicSegment === 'low') {
      interventions.push('Options de paiement flexibles');
      interventions.push('Promotions de volume');
    }

    return interventions;
  },

  // Fonctions utilitaires
  determineEconomicSegment(user: any): 'low' | 'medium' | 'high' {
    const preferences = user?.preferences || {};
    const spendingPattern = preferences.spendingPattern;
    
    if (spendingPattern === 'high') return 'high';
    if (spendingPattern === 'medium') return 'medium';
    return 'low';
  },

  calculateSocialInfluence(preferences: any): number {
    // Basé sur les patterns de partage et d'interaction
    return preferences.socialSharing ? 0.8 : 0.4;
  },

  isFamilyOriented(preferences: any): boolean {
    return preferences.familyPlan || preferences.sharedUsage || false;
  },

  getRelevantReligiousEvents(): string[] {
    const currentMonth = new Date().getMonth();
    const events = [];
    
    // Calendrier islamique approximatif
    if (currentMonth === 3 || currentMonth === 4) events.push('ramadan');
    if (currentMonth === 5) events.push('korité');
    if (currentMonth === 7) events.push('tabaski');
    if (currentMonth === 9) events.push('tamkharit');
    
    return events;
  },

  getSeasonalBehaviorPatterns(): string[] {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) return ['rainy_season', 'indoor_activities'];
    return ['dry_season', 'outdoor_activities'];
  },

  // Méthodes d'analyse des patterns
  hasShareBehavior(events: any[]): boolean {
    return events.some(e => e.event_name?.includes('share') || e.event_name?.includes('refer'));
  },

  hasReligiousPatterns(events: any[]): boolean {
    const religiousKeywords = ['prayer', 'mosque', 'ramadan', 'korité', 'tabaski'];
    return events.some(e => 
      religiousKeywords.some(keyword => 
        e.event_data?.location?.toLowerCase().includes(keyword) ||
        e.event_name?.toLowerCase().includes(keyword)
      )
    );
  },

  hasFamilyPatterns(events: any[]): boolean {
    return events.some(e => e.event_name?.includes('family') || e.event_data?.shared);
  },

  hasCollectiveEconomicBehavior(events: any[]): boolean {
    return events.some(e => e.event_name?.includes('group') || e.event_data?.collective);
  },

  getLanguageCulturalFactors(events: any[]): string[] {
    const factors = [];
    const hasWolofUsage = events.some(e => e.event_data?.language === 'wo');
    const hasFrenchUsage = events.some(e => e.event_data?.language === 'fr');
    
    if (hasWolofUsage) factors.push('wolof_speaker');
    if (hasFrenchUsage) factors.push('french_speaker');
    
    return factors;
  },

  calculateSocialUsagePattern(userHistory: any): number {
    const socialEvents = userHistory.events.filter((e: any) => 
      e.event_name?.includes('social') || e.event_name?.includes('share')
    );
    return socialEvents.length / Math.max(1, userHistory.events.length);
  },

  getDaysSinceLastConnection(sessions: any[]): number {
    if (sessions.length === 0) return 999;
    const lastSession = new Date(sessions[0].started_at);
    return Math.floor((Date.now() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
  },

  getDaysSinceLastPurchase(transactions: any[]): number {
    if (transactions.length === 0) return 999;
    const lastTransaction = new Date(transactions[0].created_at);
    return Math.floor((Date.now() - lastTransaction.getTime()) / (1000 * 60 * 60 * 24));
  },

  calculateAverageTransactionValue(transactions: any[]): number {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    return total / transactions.length;
  },

  isReligiousEventNear(): boolean {
    // Logique simplifiée - à améliorer avec un calendrier islamique précis
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    
    // Approximation des dates d'événements religieux
    return (month === 4 && day > 20) || (month === 6 && day > 15);
  },

  isWeekend(): boolean {
    const day = new Date().getDay();
    return day === 5 || day === 6; // Vendredi et Samedi au Sénégal
  },

  getFallbackPrediction(userId: string): BehaviorPrediction {
    return {
      userId,
      predictedActions: [{
        action: 'basic_usage',
        probability: 0.6,
        timeframe: '7_days',
        confidence: 0.5,
        culturalInfluence: 0.3
      }],
      churnRisk: 0.4,
      lifetimeValue: 3000,
      nextPurchaseProbability: 0.4,
      recommendedInterventions: ['Surveillance de base'],
      culturalFactors: ['general_african'],
      localContext: {
        economicSegment: 'medium',
        socialInfluence: 0.5,
        familyOriented: false,
        religiousEvents: [],
        seasonalPatterns: []
      }
    };
  }
};
