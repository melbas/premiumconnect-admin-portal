import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RadiusAuthRequest {
  username: string;
  password?: string;
  mac_address: string;
  nas_ip_address: string;
  nas_port_id?: string;
  calling_station_id?: string;
  called_station_id?: string;
  session_id: string;
  ap_name?: string;
  ssid?: string;
}

interface RadiusAuthResponse {
  access: 'accept' | 'reject' | 'challenge';
  attributes?: {
    'Tunnel-Type'?: number;
    'Tunnel-Medium-Type'?: number;
    'Tunnel-Private-Group-Id'?: string;
    'Mikrotik-Rate-Limit'?: string;
    'Cisco-AVPair'?: string[];
    'Session-Timeout'?: number;
    'Idle-Timeout'?: number;
    'Acct-Interim-Interval'?: number;
  };
  reply_message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authRequest: RadiusAuthRequest = await req.json();
    console.log('RADIUS Auth Request:', JSON.stringify(authRequest, null, 2));

    let userId: string | null = null;
    let profileId: string | null = null;
    let accessProfile: any = null;

    // 1. Authentification par voucher
    if (authRequest.username.startsWith('voucher:')) {
      const voucherCode = authRequest.username.replace('voucher:', '');
      
      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .select(`
          *,
          access_profiles (*)
        `)
        .eq('code', voucherCode)
        .eq('is_active', true)
        .lt('used_count', supabase.rpc('coalesce', { value1: 'use_limit', value2: 999 }))
        .lte('valid_from', new Date().toISOString())
        .gte('valid_to', new Date().toISOString())
        .single();

      if (voucherError || !voucher) {
        console.log('Voucher invalid:', voucherCode, voucherError);
        return Response.json({
          access: 'reject',
          reply_message: 'Voucher invalide ou expiré'
        } as RadiusAuthResponse, { headers: corsHeaders });
      }

      // Incrémenter le compteur d'utilisation du voucher
      await supabase
        .from('vouchers')
        .update({ 
          used_count: voucher.used_count + 1,
          used_at: new Date().toISOString()
        })
        .eq('id', voucher.id);

      profileId = voucher.profile_id;
      accessProfile = voucher.access_profiles;
      console.log('Voucher authentication successful:', voucherCode);
    }
    
    // 2. Authentification par utilisateur existant
    else {
      const { data: wifiUser, error: userError } = await supabase
        .from('wifi_users')
        .select('*')
        .or(`email.eq.${authRequest.username},phone.eq.${authRequest.username},mac_address.eq.${authRequest.mac_address}`)
        .single();

      if (userError || !wifiUser) {
        console.log('User not found:', authRequest.username);
        return Response.json({
          access: 'reject',
          reply_message: 'Utilisateur non trouvé'
        } as RadiusAuthResponse, { headers: corsHeaders });
      }

      userId = wifiUser.id;

      // Récupérer le profil d'accès de l'utilisateur
      const { data: userAccess, error: accessError } = await supabase
        .from('user_access')
        .select(`
          *,
          access_profiles (*)
        `)
        .eq('user_id', userId)
        .single();

      if (accessError || !userAccess) {
        // Assigner le profil invité par défaut
        const { data: defaultProfile } = await supabase
          .from('access_profiles')
          .select('*')
          .eq('name', 'Invité')
          .eq('is_active', true)
          .single();

        if (defaultProfile) {
          profileId = defaultProfile.id;
          accessProfile = defaultProfile;
          
          // Créer l'entrée user_access
          await supabase
            .from('user_access')
            .insert({
              user_id: userId,
              profile_id: profileId,
              quota_used_mb: 0,
              minutes_used: 0
            });
        }
      } else {
        profileId = userAccess.profile_id;
        accessProfile = userAccess.access_profiles;
      }
    }

    if (!accessProfile) {
      return Response.json({
        access: 'reject',
        reply_message: 'Aucun profil d\'accès valide'
      } as RadiusAuthResponse, { headers: corsHeaders });
    }

    // 3. Vérifier les quotas
    if (userId) {
      const { data: userAccess } = await supabase
        .from('user_access')
        .select('*')
        .eq('user_id', userId)
        .eq('profile_id', profileId)
        .single();

      if (userAccess) {
        // Vérifier quota data
        if (accessProfile.quota_mb && userAccess.quota_used_mb >= accessProfile.quota_mb) {
          return Response.json({
            access: 'reject',
            reply_message: 'Quota de données dépassé'
          } as RadiusAuthResponse, { headers: corsHeaders });
        }

        // Vérifier quota temps
        if (accessProfile.quota_minutes && userAccess.minutes_used >= accessProfile.quota_minutes) {
          return Response.json({
            access: 'reject',
            reply_message: 'Quota de temps dépassé'
          } as RadiusAuthResponse, { headers: corsHeaders });
        }
      }
    }

    // 4. Créer la session RADIUS
    const { data: session, error: sessionError } = await supabase
      .from('radius_sessions')
      .insert({
        session_id: authRequest.session_id,
        user_id: userId,
        username: authRequest.username,
        mac_address: authRequest.mac_address,
        nas_ip_address: authRequest.nas_ip_address,
        nas_port_id: authRequest.nas_port_id,
        profile_id: profileId,
        vlan_id: accessProfile.vlan_id,
        ap_name: authRequest.ap_name,
        ssid: authRequest.ssid,
        state: 'active'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Failed to create session:', sessionError);
      return Response.json({
        access: 'reject',
        reply_message: 'Erreur interne'
      } as RadiusAuthResponse, { headers: corsHeaders });
    }

    // 5. Construire les attributs RADIUS
    const attributes: any = {
      'Acct-Interim-Interval': 60, // Mise à jour toutes les 60 secondes
    };

    // VLAN (802.1Q)
    if (accessProfile.vlan_id) {
      attributes['Tunnel-Type'] = 13; // VLAN
      attributes['Tunnel-Medium-Type'] = 6; // IEEE-802
      attributes['Tunnel-Private-Group-Id'] = accessProfile.vlan_id.toString();
    }

    // Rate limiting
    if (accessProfile.max_down_kbps > 0 || accessProfile.max_up_kbps > 0) {
      // Mikrotik format
      attributes['Mikrotik-Rate-Limit'] = `${accessProfile.max_up_kbps}k/${accessProfile.max_down_kbps}k`;
      
      // Cisco format
      attributes['Cisco-AVPair'] = [
        `lcp:interface-config=rate-limit input ${accessProfile.max_down_kbps}000`,
        `lcp:interface-config=rate-limit output ${accessProfile.max_up_kbps}000`
      ];
    }

    // Session timeout basé sur les quotas
    if (accessProfile.quota_minutes) {
      const remainingMinutes = accessProfile.quota_minutes - (userId ? (await supabase
        .from('user_access')
        .select('minutes_used')
        .eq('user_id', userId)
        .eq('profile_id', profileId)
        .single()).data?.minutes_used || 0 : 0);
      
      if (remainingMinutes > 0) {
        attributes['Session-Timeout'] = remainingMinutes * 60;
      }
    }

    console.log('RADIUS Auth Success:', {
      session_id: authRequest.session_id,
      username: authRequest.username,
      profile: accessProfile.name,
      attributes
    });

    return Response.json({
      access: 'accept',
      attributes,
      reply_message: `Accès autorisé - Profil ${accessProfile.name}`
    } as RadiusAuthResponse, { headers: corsHeaders });

  } catch (error) {
    console.error('RADIUS Auth Error:', error);
    return Response.json({
      access: 'reject',
      reply_message: 'Erreur serveur'
    } as RadiusAuthResponse, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});