
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MobileMoneyRequest {
  amount: number;
  context: 'wifi_payment' | 'family_plan' | 'business_plan' | 'student_plan';
  language: 'fr' | 'wo';
  userId?: string;
  location?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { amount, context, language, userId, location }: MobileMoneyRequest = await req.json();

    console.log('💳 Processing mobile money AI request:', { amount, context, language, userId });

    // Analyse intelligente du contexte de paiement
    const paymentAnalysis = await analyzePaymentContext(amount, context, language, location);
    
    // Recommandations de providers optimisées
    const providerRecommendations = await getOptimalProviders(amount, context, location);
    
    // Messages culturellement adaptés
    const culturalMessages = getCulturalMessages(language, context, amount);
    
    // Détection de fraude basique
    const fraudCheck = await performFraudCheck(supabaseClient, amount, userId);

    const response = {
      paymentAnalysis,
      providerRecommendations,
      culturalMessages,
      fraudCheck,
      alternatives: generateAlternatives(amount, context, language),
      tips: getPaymentTips(language, context)
    };

    // Log analytics
    await logMobileMoneyAnalytics(supabaseClient, {
      amount,
      context,
      language,
      providersShown: providerRecommendations.length,
      userId
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error in mobile money AI:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function analyzePaymentContext(amount: number, context: string, language: string, location?: string) {
  const contextAnalysis = {
    wifi_payment: {
      urgency: 'high',
      typical_amount: 500,
      peak_times: ['18:00-20:00', '12:00-14:00'],
      user_type: 'individual'
    },
    family_plan: {
      urgency: 'medium',
      typical_amount: 2000,
      peak_times: ['weekend', 'month_end'],
      user_type: 'family'
    },
    business_plan: {
      urgency: 'medium',
      typical_amount: 5000,
      peak_times: ['business_hours'],
      user_type: 'business'
    },
    student_plan: {
      urgency: 'high',
      typical_amount: 300,
      peak_times: ['evening', 'weekend'],
      user_type: 'student'
    }
  };

  const analysis = contextAnalysis[context as keyof typeof contextAnalysis];
  
  return {
    ...analysis,
    amount_category: categorizeAmount(amount, analysis.typical_amount),
    payment_strategy: getPaymentStrategy(amount, context, language),
    cultural_considerations: getCulturalConsiderations(context, language)
  };
}

async function getOptimalProviders(amount: number, context: string, location?: string) {
  // Logique d'optimisation des providers basée sur le contexte
  const providers = [
    {
      name: 'Orange Money',
      availability: 98,
      fees: calculateFees(amount, 'orange'),
      speed: 'fast',
      reliability: 95,
      cultural_preference: 'high',
      recommended: amount >= 500
    },
    {
      name: 'Wave',
      availability: 92,
      fees: calculateFees(amount, 'wave'),
      speed: 'very_fast',
      reliability: 88,
      cultural_preference: 'medium',
      recommended: amount <= 1000
    },
    {
      name: 'Free Money',
      availability: 85,
      fees: calculateFees(amount, 'free'),
      speed: 'medium',
      reliability: 90,
      cultural_preference: 'medium',
      recommended: amount >= 1000
    }
  ];

  // Tri par recommandation contextuelle
  return providers
    .filter(p => p.recommended)
    .sort((a, b) => {
      if (context === 'student_plan') return a.fees - b.fees; // Étudiant = prix
      if (context === 'business_plan') return b.reliability - a.reliability; // Business = fiabilité
      return b.cultural_preference === 'high' ? 1 : -1; // Défaut = préférence culturelle
    });
}

function getCulturalMessages(language: string, context: string, amount: number) {
  const messages = {
    fr: {
      wifi_payment: `Connectez-vous facilement avec ${amount} FCFA. Paiement sécurisé avec votre mobile money préféré.`,
      family_plan: `Plan familial ${amount} FCFA - Toute la famille connectée, Insha Allah.`,
      business_plan: `Solution professionnelle ${amount} FCFA pour votre entreprise.`,
      student_plan: `Offre étudiante ${amount} FCFA - Étudiez connecté !`
    },
    wo: {
      wifi_payment: `Connecter nga ak ${amount} FCFA. Fey nga ak sa mobile money.`,
      family_plan: `Sàñ-sàñ bu mbokk ${amount} FCFA - Ñépp ci kër ga dañu connecter.`,
      business_plan: `Sàñ-sàñ bu liggéey ${amount} FCFA ci sa bopp.`,
      student_plan: `Sàñ-sàñ bu jàngkat ${amount} FCFA - Jàng nga ak connexion !`
    }
  };

  return {
    main_message: messages[language][context as keyof typeof messages[typeof language]],
    encouragement: language === 'wo' ? 'Mën na la, jànga' : 'C\'est possible, essayez !',
    security: language === 'wo' ? 'Sécurisé la' : 'Paiement 100% sécurisé'
  };
}

async function performFraudCheck(supabaseClient: any, amount: number, userId?: string) {
  // Vérifications basiques de fraude
  const checks = {
    amount_reasonable: amount <= 50000, // Max raisonnable
    amount_minimum: amount >= 100, // Min raisonnable
    risk_score: calculateRiskScore(amount, userId),
    status: 'approved'
  };

  if (!checks.amount_reasonable || !checks.amount_minimum) {
    checks.status = 'review_required';
  }

  if (checks.risk_score > 75) {
    checks.status = 'high_risk';
  }

  return checks;
}

function generateAlternatives(amount: number, context: string, language: string) {
  const alternatives = [];

  if (amount > 1000) {
    alternatives.push({
      type: 'split_payment',
      description: language === 'wo' 
        ? 'Payer nañu ci yépp yépp' 
        : 'Paiement en plusieurs fois',
      amounts: [Math.ceil(amount / 2), Math.floor(amount / 2)]
    });
  }

  if (context === 'wifi_payment' && amount >= 500) {
    alternatives.push({
      type: 'bulk_purchase',
      description: language === 'wo'
        ? 'Jël nga xaalis boo gën a bari'
        : 'Économisez avec un pack mensuel',
      suggested_amount: amount * 4,
      savings: Math.ceil(amount * 0.15)
    });
  }

  return alternatives;
}

function getPaymentTips(language: string, context: string) {
  const tips = {
    fr: [
      'Vérifiez votre solde mobile money avant le paiement',
      'Gardez votre téléphone chargé pendant la transaction',
      'Notez le numéro de transaction pour le support'
    ],
    wo: [
      'Xool nga sa solde bi ñu bëgga fey',
      'Defal sa telefon charge na',
      'Bind numéro transaction bi'
    ]
  };

  return tips[language];
}

function calculateFees(amount: number, provider: string) {
  const feeStructures = {
    orange: (amount: number) => Math.max(25, amount * 0.01),
    wave: (amount: number) => amount <= 1000 ? 0 : amount * 0.005,
    free: (amount: number) => amount * 0.008
  };

  return Math.ceil(feeStructures[provider as keyof typeof feeStructures](amount));
}

function categorizeAmount(amount: number, typical: number) {
  if (amount < typical * 0.5) return 'low';
  if (amount > typical * 1.5) return 'high';
  return 'normal';
}

function getPaymentStrategy(amount: number, context: string, language: string) {
  if (amount >= 5000) {
    return language === 'wo' 
      ? 'Xaalis yu bari - xool nga bi ñu bari bees'
      : 'Gros montant - choisissez le provider le plus fiable';
  }
  
  if (context === 'student_plan') {
    return language === 'wo'
      ? 'Jàngkat - xool nga fees yu ndaw'
      : 'Étudiant - privilégiez les frais les plus bas';
  }

  return language === 'wo'
    ? 'Fey nga ak provider bu gën a gis'
    : 'Choisissez votre provider habituel';
}

function getCulturalConsiderations(context: string, language: string) {
  const considerations = {
    family_plan: language === 'wo' 
      ? 'Mbokk mi ñépp dañu bëgg internet'
      : 'Plan idéal pour les familles nombreuses sénégalaises',
    business_plan: language === 'wo'
      ? 'Liggéey bi dafa soxla connexion bu baax'
      : 'Essentiel pour les entreprises locales',
    student_plan: language === 'wo'
      ? 'Jàngkat yu ndaw ñu la bëgg'
      : 'Soutien aux étudiants sénégalais'
  };

  return considerations[context as keyof typeof considerations] || '';
}

function calculateRiskScore(amount: number, userId?: string) {
  let score = 0;
  
  if (amount > 10000) score += 30;
  if (amount < 100) score += 20;
  if (!userId) score += 25;
  
  return Math.min(100, score);
}

async function logMobileMoneyAnalytics(supabaseClient: any, data: any) {
  try {
    await supabaseClient
      .from('mobile_money_analytics')
      .insert({
        amount: data.amount,
        context: data.context,
        language: data.language,
        providers_shown: data.providersShown,
        user_id: data.userId,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging mobile money analytics:', error);
  }
}
