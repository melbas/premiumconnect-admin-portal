import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

// Import rate limiter for webhook protection
import { RateLimiter, getClientIP, createRateLimitHeaders } from '../_shared/rate-limiter.ts';

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
};

// Rate limiter for webhook - strict limiting to prevent abuse
const webhookRateLimiter = new RateLimiter({
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 100       // 100 webhook calls per minute
});

// HMAC validation function
function validateHMAC(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');
    const providedSignature = signature.replace('sha256=', '');
    
    // Timing-safe comparison
    if (expectedSignature.length !== providedSignature.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      result |= expectedSignature.charCodeAt(i) ^ providedSignature.charCodeAt(i);
    }
    
    return result === 0;
  } catch (error) {
    console.error('HMAC validation error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting for webhook
  const clientIP = getClientIP(req);
  const isLimited = webhookRateLimiter.isLimited(clientIP);
  const rateLimitInfo = webhookRateLimiter.getRateLimitInfo(clientIP);
  
  if (isLimited) {
    console.log(`Rate limit exceeded for mobile money webhook from IP: ${clientIP}`);
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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get webhook secrets from environment - optional for now
    const orangeMoneySecret = Deno.env.get('ORANGE_MONEY_WEBHOOK_SECRET');
    const waveSecret = Deno.env.get('WAVE_WEBHOOK_SECRET');
    
    // TODO: Make secrets required once configured
    if (!orangeMoneySecret && !waveSecret) {
      console.warn('No webhook secrets configured - validation disabled');
    }

    const body = await req.text();
    const signature = req.headers.get('x-signature') || req.headers.get('signature');
    const userAgent = req.headers.get('user-agent') || '';
    
    // Determine provider and validate HMAC
    let provider = 'unknown';
    let isValidSignature = false;
    
    if (userAgent.includes('Orange') || userAgent.includes('orange')) {
      provider = 'orange_money';
      isValidSignature = orangeMoneySecret && signature ? validateHMAC(body, signature, orangeMoneySecret) : !orangeMoneySecret;
    } else if (userAgent.includes('Wave') || userAgent.includes('wave')) {
      provider = 'wave';
      isValidSignature = waveSecret && signature ? validateHMAC(body, signature, waveSecret) : !waveSecret;
    } else {
      // If no provider detected, allow if no secrets configured
      isValidSignature = !orangeMoneySecret && !waveSecret;
    }
    
    // Reject requests without valid HMAC signatures only if secrets are configured
    if (!isValidSignature && (orangeMoneySecret || waveSecret)) {
      console.error(`Invalid HMAC signature for ${provider} webhook from IP: ${clientIP}`);
      
      // Log security alert
      await supabase.from('security_alerts').insert({
        title: 'Invalid Mobile Money Webhook Signature',
        description: `Received webhook with invalid signature from ${provider}`,
        alert_type: 'webhook_security',
        severity: 'high',
        ip_address: clientIP,
        metadata: {
          provider,
          user_agent: userAgent,
          has_signature: !!signature,
          timestamp: new Date().toISOString()
        }
      });
      
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    console.log(`Valid ${provider} webhook received:`, payload);

    // Process based on provider
    let transaction_id = null;
    let status = 'pending';
    let amount = 0;
    let user_phone = null;

    if (provider === 'orange_money') {
      // Orange Money webhook format
      transaction_id = payload.transaction_id || payload.reference;
      status = payload.status === 'SUCCESS' ? 'completed' : 'failed';
      amount = parseFloat(payload.amount || 0);
      user_phone = payload.customer_phone || payload.phone;
    } else if (provider === 'wave') {
      // Wave webhook format
      transaction_id = payload.id || payload.transaction_id;
      status = payload.status === 'completed' ? 'completed' : 'failed';
      amount = parseFloat(payload.amount || 0);
      user_phone = payload.receiver_phone || payload.phone;
    }

    // Update transaction in database
    if (transaction_id) {
      const { data, error } = await supabase
        .from('transactions')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('transaction_reference', transaction_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating transaction:', error);
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Transaction ${transaction_id} updated to ${status}`);
      
      // If successful payment, activate user session
      if (status === 'completed' && data) {
        // Create or update wifi session for the user
        await supabase.from('wifi_sessions').insert({
          user_id: data.user_id,
          plan_id: data.plan_id,
          transaction_id: data.id,
          started_at: new Date().toISOString(),
          is_active: true
        });
        
        console.log(`Activated wifi session for user ${data.user_id}`);
      }
    }

    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      provider,
      transaction_id,
      status 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Mobile money webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});