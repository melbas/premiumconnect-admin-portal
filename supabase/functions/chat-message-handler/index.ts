
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { action, conversationId, userId, sessionId, message, context } = await req.json();

    switch (action) {
      case 'create_conversation':
        return await createConversation(supabaseClient, userId, sessionId, context);
      
      case 'get_conversation':
        return await getConversation(supabaseClient, conversationId);
      
      case 'save_user_message':
        return await saveUserMessage(supabaseClient, conversationId, message);
      
      case 'get_conversation_history':
        return await getConversationHistory(supabaseClient, conversationId);
      
      case 'close_conversation':
        return await closeConversation(supabaseClient, conversationId);
      
      default:
        throw new Error(`Action non supportée: ${action}`);
    }

  } catch (error) {
    console.error('Error in chat-message-handler:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createConversation(supabaseClient: any, userId: string, sessionId: string, context: any) {
  const { data, error } = await supabaseClient
    .from('chat_conversations')
    .insert({
      user_id: userId || null,
      session_id: sessionId || null,
      conversation_type: context?.type || 'general',
      context_data: context || {}
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur création conversation: ${error.message}`);
  }

  return new Response(JSON.stringify({ conversation: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getConversation(supabaseClient: any, conversationId: string) {
  const { data, error } = await supabaseClient
    .from('chat_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error) {
    throw new Error(`Erreur récupération conversation: ${error.message}`);
  }

  return new Response(JSON.stringify({ conversation: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function saveUserMessage(supabaseClient: any, conversationId: string, message: string) {
  const { data, error } = await supabaseClient
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      content: message,
      sender_type: 'user'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur sauvegarde message: ${error.message}`);
  }

  // Mettre à jour le compteur de messages dans la conversation
  await supabaseClient
    .from('chat_conversations')
    .update({ 
      total_messages: supabaseClient.rpc('increment_total_messages', { conversation_id: conversationId }),
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId);

  return new Response(JSON.stringify({ message: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getConversationHistory(supabaseClient: any, conversationId: string) {
  const { data, error } = await supabaseClient
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Erreur récupération historique: ${error.message}`);
  }

  return new Response(JSON.stringify({ messages: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function closeConversation(supabaseClient: any, conversationId: string) {
  const { data, error } = await supabaseClient
    .from('chat_conversations')
    .update({ 
      status: 'closed',
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur fermeture conversation: ${error.message}`);
  }

  return new Response(JSON.stringify({ conversation: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
