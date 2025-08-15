
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { RateLimiter, getClientIP, createRateLimitHeaders } from '../_shared/rate-limiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Translation specific rate limiter - 30 requests per minute per IP
const translationRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 30        // 30 requests per minute for translation
});

interface TranslationRequest {
  text: string;
  from: 'fr' | 'wo';
  to: 'fr' | 'wo';
  context?: 'wifi' | 'payment' | 'support' | 'general';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, from, to, context = 'general' }: TranslationRequest = await req.json();

    console.log('🌍 Translation request:', { from, to, context, textLength: text.length });

    // Cache de traductions communes pour économiser les coûts
    const commonTranslations = getCommonTranslations();
    const cached = commonTranslations[`${from}-${to}`]?.[text.toLowerCase()];
    
    if (cached) {
      return new Response(JSON.stringify({
        translatedText: cached,
        source: 'cache',
        cost: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Pour les traductions complexes, utiliser OpenAI
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = createTranslationPrompt(from, to, context);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();
    const tokensUsed = data.usage.total_tokens;
    const cost = (tokensUsed / 1000) * 0.00015;

    return new Response(JSON.stringify({
      translatedText,
      source: 'ai',
      cost,
      tokens_used: tokensUsed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Translation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      translatedText: "Erreur de traduction"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function getCommonTranslations() {
  return {
    'fr-wo': {
      'bonjour': 'na nga def',
      'merci': 'jërejëf',
      'oui': 'waaw',
      'non': 'déedéet',
      'comment ça va': 'na nga def',
      'wifi': 'wifi',
      'connexion': 'connexion',
      'internet': 'internet',
      'téléphone': 'telefon',
      'argent': 'xaalis',
      'famille': 'mbokk',
      'aide': 'wallou'
    },
    'wo-fr': {
      'na nga def': 'bonjour',
      'jërejëf': 'merci',
      'waaw': 'oui',
      'déedéet': 'non',
      'telefon': 'téléphone',
      'xaalis': 'argent',
      'mbokk': 'famille',
      'wallou': 'aide'
    }
  };
}

function createTranslationPrompt(from: string, to: string, context: string): string {
  const contextMap = {
    wifi: 'contexte de connexion WiFi et portail captif',
    payment: 'contexte de paiement mobile money',
    support: 'contexte de support technique',
    general: 'contexte général'
  };

  if (from === 'fr' && to === 'wo') {
    return `Tu es un traducteur expert français-wolof pour le Sénégal. 
    
CONTEXTE: ${contextMap[context]}

INSTRUCTIONS:
- Traduis le texte français en wolof sénégalais naturel
- Préserve le ton et l'intention du message
- Utilise des expressions wolof courantes quand approprié
- Pour les termes techniques (WiFi, mobile money), tu peux garder l'anglais/français si c'est l'usage
- Sois respectueux du contexte culturel sénégalais

Réponds UNIQUEMENT avec la traduction en wolof, sans explication.`;
  }

  return `Tu es un traducteur expert wolof-français pour le Sénégal.

CONTEXTE: ${contextMap[context]}

INSTRUCTIONS:
- Traduis le texte wolof en français naturel
- Préserve le ton et l'intention du message
- Adapte au contexte sénégalais
- Sois respectueux du contexte culturel

Réponds UNIQUEMENT avec la traduction en français, sans explication.`;
}
