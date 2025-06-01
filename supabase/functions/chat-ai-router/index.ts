
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIProvider {
  id: string;
  name: string;
  provider_type: string;
  api_endpoint: string;
  api_key_encrypted: string;
  model_name: string;
  pricing_per_1k_tokens: number;
  max_tokens: number;
  temperature: number;
  is_active: boolean;
  priority: number;
}

interface ChatMessage {
  conversation_id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'system';
  context?: any;
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

    const { message, conversationId, userId, sessionId } = await req.json();

    console.log('Chat AI Router - Processing message:', { conversationId, userId, sessionId });

    // 1. Vérifier d'abord la base de connaissances locale (coût 0€)
    const knowledgeResponse = await checkKnowledgeBase(supabaseClient, message);
    if (knowledgeResponse) {
      await saveMessage(supabaseClient, {
        conversation_id: conversationId,
        content: knowledgeResponse.answer,
        sender_type: 'ai',
        context: { source: 'knowledge_base', category: knowledgeResponse.category }
      });

      return new Response(JSON.stringify({
        response: knowledgeResponse.answer,
        source: 'knowledge_base',
        cost: 0,
        provider: 'local_cache'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Routage intelligent vers les providers IA
    const providers = await getActiveProviders(supabaseClient);
    let response = null;
    let usedProvider = null;

    for (const provider of providers) {
      try {
        console.log(`Trying provider: ${provider.name}`);
        response = await callAIProvider(provider, message);
        usedProvider = provider;
        break;
      } catch (error) {
        console.error(`Provider ${provider.name} failed:`, error);
        continue;
      }
    }

    if (!response || !usedProvider) {
      throw new Error('Tous les providers IA sont indisponibles');
    }

    // 3. Sauvegarder la réponse
    await saveMessage(supabaseClient, {
      conversation_id: conversationId,
      content: response.content,
      sender_type: 'ai',
      context: {
        provider: usedProvider.name,
        model: usedProvider.model_name,
        tokens_used: response.tokens_used || 0,
        cost: response.cost || 0,
        response_time_ms: response.response_time_ms || 0
      }
    });

    // 4. Mettre à jour les métriques
    await updateChatAnalytics(supabaseClient, usedProvider.name, response.cost || 0);

    return new Response(JSON.stringify({
      response: response.content,
      source: 'ai_provider',
      provider: usedProvider.name,
      cost: response.cost || 0,
      tokens_used: response.tokens_used || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-ai-router:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkKnowledgeBase(supabaseClient: any, message: string) {
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
      // Incrémenter le compteur d'usage
      await supabaseClient
        .from('chat_knowledge_base')
        .update({ usage_count: item.usage_count + 1 })
        .eq('id', item.id);

      return {
        answer: item.answer,
        category: item.category
      };
    }
  }

  return null;
}

async function getActiveProviders(supabaseClient: any): Promise<AIProvider[]> {
  const { data: providers } = await supabaseClient
    .from('ai_providers_config')
    .select('*')
    .eq('is_active', true)
    .neq('provider_type', 'local')
    .order('priority', { ascending: true });

  return providers || [];
}

async function callAIProvider(provider: AIProvider, message: string) {
  const startTime = Date.now();

  switch (provider.provider_type) {
    case 'openai':
      return await callOpenAI(provider, message, startTime);
    case 'groq':
      return await callGroq(provider, message, startTime);
    default:
      throw new Error(`Provider type ${provider.provider_type} not implemented`);
  }
}

async function callOpenAI(provider: AIProvider, message: string, startTime: number) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.api_key_encrypted}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.model_name,
      messages: [
        { 
          role: 'system', 
          content: 'Tu es un assistant IA pour un portail captif WiFi. Réponds de manière concise et utile en français. Aide les utilisateurs avec la connexion WiFi, les plans tarifaires, les jeux disponibles et les questions techniques.' 
        },
        { role: 'user', content: message }
      ],
      max_tokens: provider.max_tokens,
      temperature: provider.temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const responseTime = Date.now() - startTime;
  const tokensUsed = data.usage?.total_tokens || 0;
  const cost = (tokensUsed / 1000) * provider.pricing_per_1k_tokens;

  return {
    content: data.choices[0].message.content,
    tokens_used: tokensUsed,
    cost: cost,
    response_time_ms: responseTime
  };
}

async function callGroq(provider: AIProvider, message: string, startTime: number) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.api_key_encrypted}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.model_name,
      messages: [
        { 
          role: 'system', 
          content: 'Tu es un assistant IA pour un portail captif WiFi. Réponds de manière concise et utile en français. Aide les utilisateurs avec la connexion WiFi, les plans tarifaires, les jeux disponibles et les questions techniques.' 
        },
        { role: 'user', content: message }
      ],
      max_tokens: provider.max_tokens,
      temperature: provider.temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const responseTime = Date.now() - startTime;
  const tokensUsed = data.usage?.total_tokens || 0;
  const cost = (tokensUsed / 1000) * provider.pricing_per_1k_tokens;

  return {
    content: data.choices[0].message.content,
    tokens_used: tokensUsed,
    cost: cost,
    response_time_ms: responseTime
  };
}

async function saveMessage(supabaseClient: any, message: ChatMessage) {
  const { error } = await supabaseClient
    .from('chat_messages')
    .insert({
      conversation_id: message.conversation_id,
      content: message.content,
      sender_type: message.sender_type,
      ai_provider: message.context?.provider,
      response_time_ms: message.context?.response_time_ms,
      tokens_used: message.context?.tokens_used,
      cost: message.context?.cost,
      metadata: message.context
    });

  if (error) {
    console.error('Error saving message:', error);
  }
}

async function updateChatAnalytics(supabaseClient: any, providerName: string, cost: number) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: existing } = await supabaseClient
    .from('chat_analytics')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    const providerUsage = existing.provider_usage || {};
    providerUsage[providerName] = (providerUsage[providerName] || 0) + 1;

    await supabaseClient
      .from('chat_analytics')
      .update({
        total_messages: existing.total_messages + 1,
        total_cost: existing.total_cost + cost,
        provider_usage: providerUsage
      })
      .eq('id', existing.id);
  } else {
    const providerUsage = { [providerName]: 1 };
    
    await supabaseClient
      .from('chat_analytics')
      .insert({
        date: today,
        total_messages: 1,
        total_cost: cost,
        provider_usage: providerUsage
      });
  }
}
