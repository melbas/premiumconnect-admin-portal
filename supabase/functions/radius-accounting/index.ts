import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import rate limiter for accounting (200 req/min)
import { RateLimiter, getClientIP, createRateLimitHeaders } from '../_shared/rate-limiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiter for accounting - higher limit due to frequent updates
const accountingRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 200       // 200 requests per minute
})

interface RadiusAccountingRequest {
  session_id: string;
  username: string;
  mac_address: string;
  nas_ip_address: string;
  nas_port_id?: string;
  status_type: 'start' | 'interim-update' | 'stop';
  session_time?: number; // en secondes
  input_octets?: number;
  output_octets?: number;
  input_packets?: number;
  output_packets?: number;
  terminate_cause?: string;
  ap_name?: string;
  ssid?: string;
}

interface RadiusAccountingResponse {
  status: 'ok' | 'error';
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting for accounting
  const clientIP = getClientIP(req);
  const isLimited = accountingRateLimiter.isLimited(clientIP);
  const rateLimitInfo = accountingRateLimiter.getRateLimitInfo(clientIP);
  
  if (isLimited) {
    console.log(`Rate limit exceeded for RADIUS accounting from IP: ${clientIP}`);
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

    const acctRequest: RadiusAccountingRequest = await req.json();
    console.log('RADIUS Accounting Request:', JSON.stringify(acctRequest, null, 2));

    // Récupérer la session existante
    const { data: session, error: sessionError } = await supabase
      .from('radius_sessions')
      .select(`
        *,
        access_profiles (*)
      `)
      .eq('session_id', acctRequest.session_id)
      .single();

    if (sessionError || !session) {
      console.log('Session not found:', acctRequest.session_id);
      return Response.json({
        status: 'error',
        message: 'Session non trouvée'
      } as RadiusAccountingResponse, { headers: corsHeaders });
    }

    switch (acctRequest.status_type) {
      case 'start':
        // Session déjà créée lors de l'auth, juste mettre à jour si nécessaire
        await supabase
          .from('radius_sessions')
          .update({
            start_time: new Date().toISOString(),
            last_seen: new Date().toISOString(),
            state: 'active',
            ap_name: acctRequest.ap_name || session.ap_name,
            ssid: acctRequest.ssid || session.ssid
          })
          .eq('id', session.id);
        
        console.log('Accounting Start processed for session:', acctRequest.session_id);
        break;

      case 'interim-update':
        // Mettre à jour les compteurs de la session
        const updateData: any = {
          last_seen: new Date().toISOString(),
          session_time: acctRequest.session_time || session.session_time,
        };

        if (acctRequest.input_octets !== undefined) {
          updateData.rx_bytes = acctRequest.input_octets;
        }
        if (acctRequest.output_octets !== undefined) {
          updateData.tx_bytes = acctRequest.output_octets;
        }
        if (acctRequest.input_packets !== undefined) {
          updateData.rx_packets = acctRequest.input_packets;
        }
        if (acctRequest.output_packets !== undefined) {
          updateData.tx_packets = acctRequest.output_packets;
        }

        await supabase
          .from('radius_sessions')
          .update(updateData)
          .eq('id', session.id);

        // Mettre à jour les quotas utilisateur si applicable
        if (session.user_id && session.profile_id) {
          const totalMB = Math.round(((acctRequest.input_octets || 0) + (acctRequest.output_octets || 0)) / (1024 * 1024));
          const totalMinutes = Math.round((acctRequest.session_time || 0) / 60);

          await supabase
            .from('user_access')
            .update({
              quota_used_mb: totalMB,
              minutes_used: totalMinutes,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', session.user_id)
            .eq('profile_id', session.profile_id);

          // Vérifier les quotas et déclencher CoA si nécessaire
          if (session.access_profiles) {
            const profile = session.access_profiles;
            let quotaExceeded = false;

            if (profile.quota_mb && totalMB >= profile.quota_mb) {
              quotaExceeded = true;
              console.log('Data quota exceeded for user:', session.user_id);
            }

            if (profile.quota_minutes && totalMinutes >= profile.quota_minutes) {
              quotaExceeded = true;
              console.log('Time quota exceeded for user:', session.user_id);
            }

            if (quotaExceeded) {
              // Créer une requête CoA pour déconnecter
              await supabase
                .from('radius_coa_requests')
                .insert({
                  session_id: session.id,
                  request_type: 'disconnect',
                  attributes: { reason: 'quota_exceeded' },
                  nas_ip_address: session.nas_ip_address,
                  nas_port_id: session.nas_port_id
                });

              // Marquer la session comme expirée
              await supabase
                .from('radius_sessions')
                .update({
                  state: 'expired',
                  terminate_cause: 'quota_exceeded'
                })
                .eq('id', session.id);
            }
          }
        }

        console.log('Accounting Interim-Update processed for session:', acctRequest.session_id);
        break;

      case 'stop':
        // Terminer la session
        const stopData: any = {
          stop_time: new Date().toISOString(),
          last_seen: new Date().toISOString(),
          state: 'stopped',
          session_time: acctRequest.session_time || session.session_time,
          terminate_cause: acctRequest.terminate_cause || 'user_request'
        };

        if (acctRequest.input_octets !== undefined) {
          stopData.rx_bytes = acctRequest.input_octets;
        }
        if (acctRequest.output_octets !== undefined) {
          stopData.tx_bytes = acctRequest.output_octets;
        }
        if (acctRequest.input_packets !== undefined) {
          stopData.rx_packets = acctRequest.input_packets;
        }
        if (acctRequest.output_packets !== undefined) {
          stopData.tx_packets = acctRequest.output_packets;
        }

        await supabase
          .from('radius_sessions')
          .update(stopData)
          .eq('id', session.id);

        // Mettre à jour les quotas finaux utilisateur
        if (session.user_id && session.profile_id) {
          const totalMB = Math.round(((acctRequest.input_octets || 0) + (acctRequest.output_octets || 0)) / (1024 * 1024));
          const totalMinutes = Math.round((acctRequest.session_time || 0) / 60);

          await supabase
            .from('user_access')
            .update({
              quota_used_mb: totalMB,
              minutes_used: totalMinutes,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', session.user_id)
            .eq('profile_id', session.profile_id);
        }

        console.log('Accounting Stop processed for session:', acctRequest.session_id);
        break;

      default:
        return Response.json({
          status: 'error',
          message: 'Type de comptabilité non supporté'
        } as RadiusAccountingResponse, { 
          status: 400,
          headers: corsHeaders 
        });
    }

    return Response.json({
      status: 'ok',
      message: `Accounting ${acctRequest.status_type} traité avec succès`
    } as RadiusAccountingResponse, { headers: corsHeaders });

  } catch (error) {
    console.error('RADIUS Accounting Error:', error);
    return Response.json({
      status: 'error',
      message: 'Erreur serveur'
    } as RadiusAccountingResponse, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});