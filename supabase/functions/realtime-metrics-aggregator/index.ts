import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SiteMetrics {
  site_id: string;
  uptime_percentage: number;
  qoe_score: number;
  auth_success_rate: number;
  incident_count: number;
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

    console.log('Starting realtime metrics aggregation...');

    // Get current timestamp
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // 1. Aggregate Site Availability Metrics
    await aggregateSiteAvailability(supabase, now);

    // 2. Aggregate QoE Measurements
    await aggregateQoEMetrics(supabase, now);

    // 3. Aggregate Auth Funnel Metrics
    await aggregateAuthMetrics(supabase, now);

    // 4. Update Incidents Status
    await updateIncidentsStatus(supabase);

    console.log('Realtime metrics aggregation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Metrics aggregated successfully',
        timestamp: now.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in realtime metrics aggregation:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function aggregateSiteAvailability(supabase: any, timestamp: Date) {
  console.log('Aggregating site availability metrics...');
  
  // Mock sites for demonstration - in production, get from sites table
  const sites = ['SITE_DKR_001', 'SITE_THS_002', 'SITE_KLK_003', 'SITE_STL_004', 'SITE_ZIG_005'];
  
  for (const siteId of sites) {
    // Simulate uptime calculation based on recent activity
    const uptimePercentage = Math.random() * 5 + 95; // 95-100%
    const downtimeMinutes = uptimePercentage < 99.9 ? Math.floor((100 - uptimePercentage) * 60) : 0;
    const incidentCount = uptimePercentage < 98 ? Math.floor(Math.random() * 3) + 1 : 0;
    
    // Insert availability metric
    const { error } = await supabase
      .from('site_availability_metrics')
      .insert({
        site_id: siteId,
        timestamp: timestamp.toISOString(),
        uptime_percentage: uptimePercentage,
        downtime_minutes: downtimeMinutes,
        sla_breached: uptimePercentage < 99.9,
        incident_count: incidentCount
      });

    if (error) {
      console.error(`Error inserting availability metric for ${siteId}:`, error);
    }
  }
}

async function aggregateQoEMetrics(supabase: any, timestamp: Date) {
  console.log('Aggregating QoE metrics...');
  
  const sites = ['SITE_DKR_001', 'SITE_THS_002', 'SITE_KLK_003', 'SITE_STL_004', 'SITE_ZIG_005'];
  const apIds = ['AP_001', 'AP_002', 'AP_003', 'AP_004', 'AP_005'];
  
  for (const siteId of sites) {
    for (const apId of apIds) {
      // Simulate QoE measurements
      const latencyP95 = Math.random() * 50 + 10; // 10-60ms
      const packetLoss = Math.random() * 2; // 0-2%
      const throughputMbps = Math.random() * 80 + 20; // 20-100 Mbps
      
      // Calculate QoE score (0-100)
      const latencyScore = Math.max(0, 100 - (latencyP95 - 10) * 2);
      const lossScore = Math.max(0, 100 - packetLoss * 50);
      const throughputScore = Math.min(100, throughputMbps);
      const qoeScore = (latencyScore + lossScore + throughputScore) / 3;
      
      const { error } = await supabase
        .from('qoe_measurements')
        .insert({
          site_id: siteId,
          ap_id: apId,
          timestamp: timestamp.toISOString(),
          latency_p95_ms: latencyP95,
          packet_loss_percentage: packetLoss,
          throughput_mbps: throughputMbps,
          qoe_score: qoeScore,
          measurement_type: 'automated'
        });

      if (error) {
        console.error(`Error inserting QoE metric for ${siteId}/${apId}:`, error);
      }
    }
  }
}

async function aggregateAuthMetrics(supabase: any, timestamp: Date) {
  console.log('Aggregating auth funnel metrics...');
  
  const authMethods = ['sms', 'voucher', 'payment', 'family'];
  const stages = ['portal_access', 'method_selection', 'credential_input', 'radius_auth', 'internet_access'];
  
  for (const method of authMethods) {
    for (const stage of stages) {
      // Simulate funnel metrics with realistic drop-off
      const baseAttempts = Math.floor(Math.random() * 1000) + 500;
      let successCount = baseAttempts;
      
      // Apply stage-specific success rates
      switch (stage) {
        case 'portal_access':
          successCount = Math.floor(baseAttempts * 0.98); // 98% reach portal
          break;
        case 'method_selection':
          successCount = Math.floor(baseAttempts * 0.95); // 95% select method
          break;
        case 'credential_input':
          successCount = Math.floor(baseAttempts * (method === 'sms' ? 0.88 : 0.92)); // SMS has lower success
          break;
        case 'radius_auth':
          successCount = Math.floor(baseAttempts * 0.96); // 96% auth success
          break;
        case 'internet_access':
          successCount = Math.floor(baseAttempts * 0.94); // 94% final success
          break;
      }
      
      const failureCount = baseAttempts - successCount;
      const successRate = (successCount / baseAttempts) * 100;
      
      const { error } = await supabase
        .from('auth_funnel_metrics')
        .insert({
          auth_method: method,
          stage: stage,
          timestamp: timestamp.toISOString(),
          success_count: successCount,
          failure_count: failureCount,
          total_attempts: baseAttempts,
          success_rate: successRate,
          site_id: 'GLOBAL'
        });

      if (error) {
        console.error(`Error inserting auth metric for ${method}/${stage}:`, error);
      }
    }
  }
}

async function updateIncidentsStatus(supabase: any) {
  console.log('Updating incidents status...');
  
  // Get active incidents
  const { data: incidents, error: fetchError } = await supabase
    .from('incidents_tracking')
    .select('*')
    .in('status', ['open', 'investigating', 'identified']);

  if (fetchError) {
    console.error('Error fetching incidents:', fetchError);
    return;
  }

  // Simulate incident progression
  for (const incident of incidents || []) {
    const now = new Date();
    const startedAt = new Date(incident.started_at);
    const elapsedMinutes = (now.getTime() - startedAt.getTime()) / (1000 * 60);
    
    let newStatus = incident.status;
    let updateData: any = {
      last_update_at: now.toISOString()
    };

    // Simulate incident lifecycle
    if (incident.status === 'open' && elapsedMinutes > 15) {
      newStatus = 'investigating';
      updateData.first_response_at = now.toISOString();
    } else if (incident.status === 'investigating' && elapsedMinutes > 60) {
      newStatus = 'identified';
    } else if (incident.status === 'identified' && Math.random() > 0.7) {
      newStatus = 'resolved';
      updateData.resolved_at = now.toISOString();
    }

    if (newStatus !== incident.status) {
      updateData.status = newStatus;
      
      const { error: updateError } = await supabase
        .from('incidents_tracking')
        .update(updateData)
        .eq('id', incident.id);

      if (updateError) {
        console.error(`Error updating incident ${incident.id}:`, updateError);
      }
    }
  }
}