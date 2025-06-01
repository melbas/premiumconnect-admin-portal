
import { supabase } from "@/integrations/supabase/client";

export interface MobileMoneyProvider {
  id: string;
  name: string;
  code: string;
  ussdCode: string;
  apiEndpoint?: string;
  fees: {
    deposit: number;
    withdrawal: number;
    transfer: number;
  };
  limits: {
    daily: number;
    monthly: number;
    transaction: number;
  };
  popularity: number; // Score de popularité au Sénégal
}

export interface PaymentRecommendation {
  provider: MobileMoneyProvider;
  reason: string;
  confidence: number;
  culturalContext: string;
  estimatedFees: number;
  isOptimal: boolean;
}

export interface UserPaymentProfile {
  preferredLanguage: 'fr' | 'wo' | 'ff';
  averageTransactionAmount: number;
  frequencyPattern: 'occasional' | 'regular' | 'frequent';
  deviceType: 'feature_phone' | 'smartphone';
  locationPattern: string[];
  familyGroup?: boolean;
}

export const mobileMoneyAIService = {
  /**
   * Fournisseurs Mobile Money populaires au Sénégal
   */
  getProviders(): MobileMoneyProvider[] {
    return [
      {
        id: 'orange_money',
        name: 'Orange Money',
        code: 'OM',
        ussdCode: '#144#',
        fees: { deposit: 0, withdrawal: 100, transfer: 50 },
        limits: { daily: 500000, monthly: 2000000, transaction: 200000 },
        popularity: 0.95
      },
      {
        id: 'wave',
        name: 'Wave',
        code: 'WAVE',
        ussdCode: '*700#',
        fees: { deposit: 0, withdrawal: 0, transfer: 0 },
        limits: { daily: 1000000, monthly: 5000000, transaction: 500000 },
        popularity: 0.85
      },
      {
        id: 'free_money',
        name: 'Free Money',
        code: 'FM',
        ussdCode: '#555#',
        fees: { deposit: 0, withdrawal: 50, transfer: 25 },
        limits: { daily: 300000, monthly: 1500000, transaction: 150000 },
        popularity: 0.65
      },
      {
        id: 'wizall',
        name: 'Wizall Money',
        code: 'WM',
        ussdCode: '*515#',
        fees: { deposit: 0, withdrawal: 75, transfer: 30 },
        limits: { daily: 400000, monthly: 1800000, transaction: 180000 },
        popularity: 0.45
      }
    ];
  },

  /**
   * Recommande le meilleur fournisseur basé sur l'IA et le profil utilisateur
   */
  async recommendProvider(
    amount: number,
    userProfile: UserPaymentProfile,
    context: string
  ): Promise<PaymentRecommendation[]> {
    try {
      console.log('🤖 Generating AI-powered Mobile Money recommendations');

      const providers = this.getProviders();
      const recommendations: PaymentRecommendation[] = [];

      for (const provider of providers) {
        const analysis = await this.analyzeProviderMatch(provider, amount, userProfile, context);
        recommendations.push(analysis);
      }

      // Trier par confiance et optimalité
      return recommendations.sort((a, b) => {
        if (a.isOptimal && !b.isOptimal) return -1;
        if (!a.isOptimal && b.isOptimal) return 1;
        return b.confidence - a.confidence;
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(amount);
    }
  },

  /**
   * Analyse l'adéquation d'un fournisseur avec le profil utilisateur
   */
  async analyzeProviderMatch(
    provider: MobileMoneyProvider,
    amount: number,
    userProfile: UserPaymentProfile,
    context: string
  ): Promise<PaymentRecommendation> {
    let confidence = provider.popularity;
    let reason = `${provider.name} est populaire au Sénégal`;
    let culturalContext = '';
    let isOptimal = false;

    // Analyse des frais
    const totalFees = this.calculateFees(provider, amount, context);
    if (totalFees === 0) {
      confidence += 0.3;
      reason = `${provider.name} - Transferts gratuits`;
      isOptimal = true;
    }

    // Analyse des limites
    if (amount <= provider.limits.transaction) {
      confidence += 0.2;
    } else {
      confidence -= 0.5;
      reason += ' (montant dépassé)';
    }

    // Contexte culturel et linguistique
    if (userProfile.preferredLanguage === 'wo') {
      if (provider.id === 'orange_money') {
        confidence += 0.15;
        culturalContext = 'Interface disponible en wolof, très utilisé en famille';
      } else if (provider.id === 'wave') {
        confidence += 0.1;
        culturalContext = 'Application moderne, populaire chez les jeunes';
      }
    }

    // Analyse du type d'appareil
    if (userProfile.deviceType === 'feature_phone') {
      if (provider.ussdCode) {
        confidence += 0.2;
        culturalContext += ' Compatible téléphone basique';
      }
    }

    // Analyse du pattern familial
    if (userProfile.familyGroup && provider.id === 'orange_money') {
      confidence += 0.25;
      culturalContext += ' Excellent pour les transferts familiaux';
    }

    return {
      provider,
      reason,
      confidence: Math.min(confidence, 1),
      culturalContext,
      estimatedFees: totalFees,
      isOptimal
    };
  },

  /**
   * Calcule les frais pour une transaction
   */
  calculateFees(provider: MobileMoneyProvider, amount: number, context: string): number {
    switch (context) {
      case 'wifi_payment':
        return provider.fees.deposit;
      case 'transfer':
        return provider.fees.transfer;
      case 'withdrawal':
        return provider.fees.withdrawal;
      default:
        return provider.fees.transfer;
    }
  },

  /**
   * Génère des instructions de paiement adaptées culturellement
   */
  generatePaymentInstructions(
    provider: MobileMoneyProvider,
    amount: number,
    language: 'fr' | 'wo' = 'fr'
  ): string {
    const instructions = {
      fr: {
        orange_money: `Composez ${provider.ussdCode} puis suivez les instructions pour payer ${amount} FCFA`,
        wave: `Ouvrez l'app Wave ou composez ${provider.ussdCode} pour envoyer ${amount} FCFA`,
        default: `Utilisez ${provider.name} pour payer ${amount} FCFA`
      },
      wo: {
        orange_money: `Daal ${provider.ussdCode} te suqali takku yi ngir def ${amount} FCFA`,
        wave: `Ubbi Wave app walla daal ${provider.ussdCode} ngir yónnee ${amount} FCFA`,
        default: `Jëfandikoo ${provider.name} ngir def ${amount} FCFA`
      }
    };

    return instructions[language][provider.id] || instructions[language].default;
  },

  /**
   * Détecte les problèmes de paiement et propose des solutions IA
   */
  async troubleshootPayment(
    error: string,
    provider: MobileMoneyProvider,
    userProfile: UserPaymentProfile
  ): Promise<string> {
    const solutions = {
      'insufficient_funds': {
        fr: 'Solde insuffisant. Rechargez votre compte ou utilisez un montant plus petit.',
        wo: 'Xaalis la gën. Yokk sa compte walla jëfandikoo xaalis gën a.'
      },
      'daily_limit_exceeded': {
        fr: `Limite journalière dépassée (${provider.limits.daily} FCFA). Réessayez demain.`,
        wo: 'Pàlale bu bësu jàll la gën. Ceetal tantu.'
      },
      'network_error': {
        fr: 'Problème de réseau. Vérifiez votre connexion et réessayez.',
        wo: 'Jàmm bu réseau. Seet sa connexion te ceetal.'
      },
      'invalid_pin': {
        fr: 'Code PIN incorrect. Vérifiez votre code secret.',
        wo: 'Code PIN u baax. Seet sa code bi nga suul.'
      }
    };

    const errorType = this.detectErrorType(error);
    const lang = userProfile.preferredLanguage === 'wo' ? 'wo' : 'fr';
    
    return solutions[errorType]?.[lang] || solutions.network_error[lang];
  },

  /**
   * Détecte le type d'erreur à partir du message
   */
  detectErrorType(error: string): string {
    const errorPatterns = {
      'insufficient_funds': ['insufficient', 'solde', 'balance', 'xaalis'],
      'daily_limit_exceeded': ['limit', 'dépassé', 'exceeded', 'pàlal'],
      'network_error': ['network', 'réseau', 'connexion', 'timeout'],
      'invalid_pin': ['pin', 'code', 'incorrect', 'wrong']
    };

    for (const [type, patterns] of Object.entries(errorPatterns)) {
      if (patterns.some(pattern => error.toLowerCase().includes(pattern))) {
        return type;
      }
    }

    return 'network_error';
  },

  /**
   * Recommandations de secours
   */
  getFallbackRecommendations(amount: number): PaymentRecommendation[] {
    const providers = this.getProviders();
    
    return providers.slice(0, 2).map(provider => ({
      provider,
      reason: 'Recommandation basique',
      confidence: provider.popularity,
      culturalContext: 'Fournisseur populaire au Sénégal',
      estimatedFees: this.calculateFees(provider, amount, 'wifi_payment'),
      isOptimal: provider.id === 'wave'
    }));
  }
};
