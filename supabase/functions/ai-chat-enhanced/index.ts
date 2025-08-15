
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { chatRateLimiter, getClientIP, createRateLimitHeaders } from '../_shared/rate-limiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversationId: string;
  userId?: string;
  language?: 'fr' | 'wo';
  culturalContext?: boolean;
  enableRecommendations?: boolean;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimitInfo = chatRateLimiter.getRateLimitInfo(clientIP);
  
  if (chatRateLimiter.isLimited(clientIP)) {
    console.log(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
    return new Response(JSON.stringify({ 
      error: 'Trop de requêtes. Veuillez patienter.' 
    }), {
      status: 429,
      headers: { 
        ...corsHeaders, 
        ...createRateLimitHeaders(rateLimitInfo),
        'Content-Type': 'application/json' 
      }
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, conversationId, userId, language = 'fr', culturalContext = true, enableRecommendations = true }: ChatRequest = await req.json();

    console.log('🤖 Processing enhanced AI chat request:', { conversationId, userId, language, culturalContext });

    // 1. Vérifier d'abord la base de connaissances locale (coût 0€)
    const knowledgeResponse = await checkLocalKnowledge(supabaseClient, message, language);
    if (knowledgeResponse) {
      await saveAIMessage(supabaseClient, conversationId, knowledgeResponse.answer, 'local_cache', 0);
      
      return new Response(JSON.stringify({
        response: knowledgeResponse.answer,
        source: 'knowledge_base',
        cost: 0,
        provider: 'local_cache',
        culturalAdaptation: true,
        sentiment: { sentiment: 'neutral', confidence: 1.0 },
        recommendations: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 2. Préparer le système prompt adapté au contexte
    const systemPrompt = createCulturalSystemPrompt(language, culturalContext);

    // 3. Appeler OpenAI avec le contexte culturel
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData: OpenAIResponse = await openAIResponse.json();
    const aiResponse = openAIData.choices[0].message.content;
    const tokensUsed = openAIData.usage.total_tokens;
    const cost = (tokensUsed / 1000) * 0.00015; // Prix gpt-4o-mini

    // 4. Analyse de sentiment rapide
    const sentimentData = await analyzeSentiment(message, language);

    // 5. Générer des recommandations si activées
    let recommendations = [];
    if (enableRecommendations && userId) {
      recommendations = await generateQuickRecommendations(supabaseClient, userId, message, language);
    }

    // 6. Adapter la réponse au contexte culturel
    const culturalResponse = culturalContext 
      ? await adaptToCulture(aiResponse, sentimentData, language)
      : aiResponse;

    // 7. Sauvegarder la réponse
    await saveAIMessage(supabaseClient, conversationId, culturalResponse, 'openai', cost);

    // 8. Mettre à jour les analytics
    await updateChatAnalytics(supabaseClient, 'openai', cost, tokensUsed);

    return new Response(JSON.stringify({
      response: culturalResponse,
      source: 'ai_provider',
      provider: 'openai',
      cost,
      tokens_used: tokensUsed,
      sentiment: sentimentData,
      recommendations: recommendations.slice(0, 3),
      culturalAdaptation: culturalContext
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error in AI chat enhanced:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: getErrorFallback(req.headers.get('accept-language') || 'fr')
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function checkLocalKnowledge(supabaseClient: any, message: string, language: string) {
  try {
    const { data: knowledge } = await supabaseClient
      .from('chat_knowledge_base')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });

    if (!knowledge) return null;

    const messageWords = message.toLowerCase().split(' ');
    
    for (const item of knowledge) {
      const keywords = item.keywords || [];
      const matchCount = keywords.filter((keyword: string) => 
        messageWords.some(word => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word))
      ).length;

      if (matchCount >= 1) {
        // Adapter la réponse à la langue
        const answer = language === 'wo' && item.answer_wo 
          ? item.answer_wo 
          : item.answer;

        // Incrémenter usage
        await supabaseClient
          .from('chat_knowledge_base')
          .update({ usage_count: item.usage_count + 1 })
          .eq('id', item.id);

        return { answer, category: item.category };
      }
    }

    return null;
  } catch (error) {
    console.error('Error checking local knowledge:', error);
    return null;
  }
}

function createCulturalSystemPrompt(language: string, culturalContext: boolean): string {
  const basePrompt = `Tu es un assistant IA pour un portail captif WiFi au Sénégal. Tu aides les utilisateurs avec la connexion WiFi, les plans tarifaires, et les questions techniques.`;

  if (!culturalContext) return basePrompt;

  if (language === 'wo') {
    return `${basePrompt}

CONTEXTE CULTUREL SÉNÉGALAIS:
- Utilise des expressions wolof appropriées quand c'est naturel
- Respecte les valeurs familiales et communautaires
- Sois conscient des réalités économiques locales
- Utilise "Insha Allah" ou "Si Dieu le veut" pour les projets futurs
- Sois respectueux des pratiques religieuses

EXPRESSIONS WOLOF UTILES:
- "Na nga def" (comment allez-vous)
- "Jërejëf" (merci)
- "Mën na la" (c'est possible)
- "Baax na" (c'est bien)

Réponds de manière respectueuse, chaleureuse et pratique.`;
  }

  return `${basePrompt}

CONTEXTE CULTUREL SÉNÉGALAIS:
- Sois respectueux des valeurs familiales et communautaires
- Prends en compte les réalités économiques locales
- Utilise "Insha Allah" pour les projets futurs quand approprié
- Sois sensible aux pratiques religieuses
- Privilégie des solutions abordables et pratiques

Réponds en français de manière chaleureuse et respectueuse.`;
}

async function analyzeSentiment(message: string, language: string) {
  // Analyse de sentiment basique pour éviter des coûts supplémentaires
  const positiveWords = language === 'wo' 
    ? ['baax', 'rafet', 'mën', 'jërejëf', 'bëgg']
    : ['bien', 'bon', 'merci', 'excellent', 'parfait', 'super'];
    
  const negativeWords = language === 'wo'
    ? ['amul', 'bon', 'dafa', 'problem']
    : ['problème', 'mal', 'difficile', 'impossible', 'mauvais', 'lent'];

  const words = message.toLowerCase().split(' ');
  const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
  const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;

  let sentiment = 'neutral';
  let confidence = 0.5;

  if (positiveCount > negativeCount) {
    sentiment = 'positive';
    confidence = Math.min(0.9, 0.5 + (positiveCount * 0.2));
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
    confidence = Math.min(0.9, 0.5 + (negativeCount * 0.2));
  }

  return { sentiment, confidence, language };
}

async function generateQuickRecommendations(supabaseClient: any, userId: string, message: string, language: string) {
  // Recommandations basiques basées sur le contenu du message
  const recommendations = [];

  if (message.toLowerCase().includes('connexion') || message.toLowerCase().includes('connect')) {
    recommendations.push({
      title: language === 'wo' ? 'Xalaat WiFi' : 'Guide de Connexion',
      description: language === 'wo' ? 'Jàng nga connecter WiFi' : 'Comment se connecter au WiFi',
      type: 'connection_guide'
    });
  }

  if (message.toLowerCase().includes('prix') || message.toLowerCase().includes('plan') || message.toLowerCase().includes('tarif')) {
    recommendations.push({
      title: language === 'wo' ? 'Sàñ-sàñ yu jëkk' : 'Plans Familiaux',
      description: language === 'wo' ? 'Sàñ-sàñ bu jëkk ak sa ñoom' : 'Plans WiFi pour toute la famille',
      type: 'family_plan'
    });
  }

  if (message.toLowerCase().includes('mobile money') || message.toLowerCase().includes('orange money')) {
    recommendations.push({
      title: language === 'wo' ? 'Fey ak Mobile Money' : 'Paiement Mobile Money',
      description: language === 'wo' ? 'Fey nga ak Orange Money walla Wave' : 'Payez avec Orange Money ou Wave',
      type: 'mobile_payment'
    });
  }

  return recommendations;
}

async function adaptToCulture(response: string, sentiment: any, language: string): Promise<string> {
  let adaptedResponse = response;

  // Ajouter des salutations culturelles
  if (sentiment?.sentiment === 'positive' && language === 'wo') {
    adaptedResponse = `Na nga def! ${adaptedResponse}`;
  }

  // Ajouter du contexte religieux approprié
  if (response.includes('demain') || response.includes('avenir') || response.includes('futur')) {
    adaptedResponse += language === 'wo' ? ' Bi Yalla bëgg.' : ' Insha Allah.';
  }

  // Adapter le ton selon le sentiment
  if (sentiment?.sentiment === 'negative') {
    const empathy = language === 'wo' ? 'Dégg naa, am na solo.' : 'Je comprends votre préoccupation.';
    adaptedResponse = `${empathy} ${adaptedResponse}`;
  }

  return adaptedResponse;
}

async function saveAIMessage(supabaseClient: any, conversationId: string, content: string, provider: string, cost: number) {
  try {
    await supabaseClient
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        content,
        sender_type: 'ai',
        ai_provider: provider,
        cost,
        tokens_used: provider === 'local_cache' ? 0 : Math.ceil(content.length / 4)
      });
  } catch (error) {
    console.error('Error saving AI message:', error);
  }
}

async function updateChatAnalytics(supabaseClient: any, provider: string, cost: number, tokens: number) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existing } = await supabaseClient
      .from('chat_analytics')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    if (existing) {
      const providerUsage = existing.provider_usage || {};
      providerUsage[provider] = (providerUsage[provider] || 0) + 1;

      await supabaseClient
        .from('chat_analytics')
        .update({
          total_messages: existing.total_messages + 1,
          total_cost: existing.total_cost + cost,
          provider_usage: providerUsage
        })
        .eq('id', existing.id);
    } else {
      await supabaseClient
        .from('chat_analytics')
        .insert({
          date: today,
          total_messages: 1,
          total_cost: cost,
          provider_usage: { [provider]: 1 }
        });
    }
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
}

function getErrorFallback(language: string): string {
  if (language.includes('wo')) {
    return 'Mbaa problema am. Jànga koy seeti.';
  }
  return 'Désolé, je rencontre un problème technique. Veuillez réessayer.';
}
