import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import rate limiter for CoA (50 req/min - more restrictive for admin operations)
import { RateLimiter, getClientIP, createRateLimitHeaders } from '../_shared/rate-limiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiter for CoA - restricted for admin operations
const coaRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 50        // 50 requests per minute
})

interface CoARequest {
  session_id?: string;
  user_id?: string;
  action: 'disconnect' | 'coa' | 'process_pending';
  attributes?: Record<string, any>;
}

interface CoAResponse {
  status: 'ok' | 'error';
  message: string;
  processed_requests?: number;
}

// Simuler l'envoi de paquets CoA/Disconnect RADIUS
async function sendRadiusCoA(
  nasIp: string,
  nasPort: string | null,
  requestType: 'disconnect' | 'coa',
  attributes: Record<string, any>
): Promise<{ success: boolean; responseCode?: number; error?: string }> {
  
  console.log(`Sending RADIUS ${requestType.toUpperCase()} to ${nasIp}:${nasPort || '3799'}`);
  console.log('Attributes:', JSON.stringify(attributes, null, 2));

  // Dans un environnement réel, ici on utiliserait radclient ou une librairie RADIUS
  // Pour le développement, on simule la réponse
  
  try {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // Simulation de réussite/échec (90% de réussite)
    const success = Math.random() > 0.1;
    
    if (success) {
      return { 
        success: true, 
        responseCode: requestType === 'disconnect' ? 40 : 41 // Disconnect-ACK : CoA-ACK
      };
    } else {
      return { 
        success: false, 
        responseCode: requestType === 'disconnect' ? 41 : 42, // Disconnect-NAK : CoA-NAK
        error: 'Simulated network error'
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting for CoA operations
  const clientIP = getClientIP(req);
  const isLimited = coaRateLimiter.isLimited(clientIP);
  const rateLimitInfo = coaRateLimiter.getRateLimitInfo(clientIP);
  
  if (isLimited) {
    console.log(`Rate limit exceeded for RADIUS CoA from IP: ${clientIP}`);
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: {
        ...corsHeaders,
        ...createRateLimitHeaders(rateLimitInfo),
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const coaRequest: CoARequest = await req.json();
    console.log('CoA Request:', JSON.stringify(coaRequest, null, 2));

    if (coaRequest.action === 'process_pending') {
      // Traiter toutes les requêtes CoA en attente
      const { data: pendingRequests, error: fetchError } = await supabase
        .from('radius_coa_requests')
        .select(`
          *,
          radius_sessions (session_id, nas_ip_address, nas_port_id)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(50);

      if (fetchError) {
        throw fetchError;
      }

      let processedCount = 0;

      for (const request of pendingRequests || []) {
        if (!request.radius_sessions) {
          await supabase
            .from('radius_coa_requests')
            .update({
              status: 'nak',
              error_message: 'Session non trouvée',
              response_at: new Date().toISOString()
            })
            .eq('id', request.id);
          continue;
        }

        const session = request.radius_sessions;
        
        // Marquer comme envoyé
        await supabase
          .from('radius_coa_requests')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', request.id);

        // Envoyer la requête RADIUS
        const result = await sendRadiusCoA(
          request.nas_ip_address,
          request.nas_port_id,
          request.request_type as 'disconnect' | 'coa',
          request.attributes || {}
        );

        // Mettre à jour le statut
        await supabase
          .from('radius_coa_requests')
          .update({
            status: result.success ? 'ack' : 'nak',
            response_code: result.responseCode,
            error_message: result.error || null,
            response_at: new Date().toISOString()
          })
          .eq('id', request.id);

        processedCount++;
      }

      return Response.json({
        status: 'ok',
        message: `${processedCount} requêtes CoA traitées`,
        processed_requests: processedCount
      } as CoAResponse, { headers: corsHeaders });
    }

    // Traitement des requêtes CoA spécifiques
    let targetSessions: any[] = [];

    if (coaRequest.session_id) {
      const { data: session, error: sessionError } = await supabase
        .from('radius_sessions')
        .select('*')
        .eq('session_id', coaRequest.session_id)
        .eq('state', 'active')
        .single();

      if (sessionError || !session) {
        return Response.json({
          status: 'error',
          message: 'Session non trouvée ou inactive'
        } as CoAResponse, { headers: corsHeaders });
      }

      targetSessions = [session];
    } else if (coaRequest.user_id) {
      const { data: sessions, error: sessionsError } = await supabase
        .from('radius_sessions')
        .select('*')
        .eq('user_id', coaRequest.user_id)
        .eq('state', 'active');

      if (sessionsError) {
        throw sessionsError;
      }

      targetSessions = sessions || [];
    } else {
      return Response.json({
        status: 'error',
        message: 'session_id ou user_id requis'
      } as CoAResponse, { headers: corsHeaders });
    }

    if (targetSessions.length === 0) {
      return Response.json({
        status: 'error',
        message: 'Aucune session active trouvée'
      } as CoAResponse, { headers: corsHeaders });
    }

    // Créer les requêtes CoA pour chaque session
    const coaRequests = targetSessions.map(session => ({
      session_id: session.id,
      request_type: coaRequest.action,
      attributes: coaRequest.attributes || {},
      nas_ip_address: session.nas_ip_address,
      nas_port_id: session.nas_port_id
    }));

    const { data: insertedRequests, error: insertError } = await supabase
      .from('radius_coa_requests')
      .insert(coaRequests)
      .select();

    if (insertError) {
      throw insertError;
    }

    // Si action = disconnect, marquer les sessions comme terminées
    if (coaRequest.action === 'disconnect') {
      await supabase
        .from('radius_sessions')
        .update({
          state: 'stopped',
          stop_time: new Date().toISOString(),
          terminate_cause: 'admin_disconnect'
        })
        .in('id', targetSessions.map(s => s.id));
    }

    console.log(`Created ${coaRequests.length} CoA requests for action: ${coaRequest.action}`);

    return Response.json({
      status: 'ok',
      message: `${coaRequests.length} requête(s) CoA créée(s) pour ${coaRequest.action}`,
      processed_requests: coaRequests.length
    } as CoAResponse, { headers: corsHeaders });

  } catch (error) {
    console.error('CoA Error:', error);
    return Response.json({
      status: 'error',
      message: 'Erreur serveur: ' + error.message
    } as CoAResponse, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});