import { supabase } from '@/integrations/supabase/client';

export interface RealtimeMetrics {
  global_uptime: number;
  global_qoe_score: number;
  auth_success_rate: number;
  active_incidents: number;
  critical_sites: Array<{
    site_id: string;
    uptime: number;
    incidents: number;
  }>;
  last_updated: string;
}

export interface QoEMeasurement {
  id: string;
  site_id: string;
  ap_name?: string;
  timestamp: string;
  qoe_score: number;
  latency_p95_ms?: number;
  packet_loss_percentage?: number;
  throughput_mbps?: number;
  user_count: number;
}

export interface AuthFunnelMetrics {
  id: string;
  timestamp: string;
  auth_method: 'sms' | 'voucher' | 'payment' | 'family';
  stage: 'captive' | 'dhcp' | 'dns' | 'radius' | 'internet';
  success_count: number;
  failure_count: number;
  total_attempts: number;
  success_rate: number;
  site_id?: string;
}

export interface IncidentData {
  id: string;
  incident_id: string;
  title: string;
  description?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  impact_level: 'service_down' | 'performance_degraded' | 'partial_outage' | 'maintenance';
  affected_sites: string[];
  affected_users_count: number;
  started_at: string;
  first_response_at?: string;
  resolved_at?: string;
  mttr_minutes?: number;
  sla_target_minutes: number;
  sla_breached: boolean;
  eta?: string;
  last_update_at: string;
}

class RealtimeMetricsService {
  private static readonly CACHE_DURATION = 30 * 1000; // 30 seconds
  private metricsCache: { data: RealtimeMetrics | null; timestamp: number } = {
    data: null,
    timestamp: 0
  };

  async getRealtimeMetrics(): Promise<RealtimeMetrics> {
    const now = Date.now();
    
    // Check cache first
    if (this.metricsCache.data && (now - this.metricsCache.timestamp) < RealtimeMetricsService.CACHE_DURATION) {
      return this.metricsCache.data;
    }

    try {
      const { data, error } = await supabase.rpc('get_realtime_dashboard_metrics');
      
      if (error) throw error;
      
      const metrics = data as unknown as RealtimeMetrics;
      
      // Cache the result
      this.metricsCache = {
        data: metrics,
        timestamp: now
      };
      
      return metrics;
    } catch (error) {
      console.error('Error fetching realtime metrics:', error);
      
      // Return default values on error
      return {
        global_uptime: 100,
        global_qoe_score: 100,
        auth_success_rate: 100,
        active_incidents: 0,
        critical_sites: [],
        last_updated: new Date().toISOString()
      };
    }
  }

  async getQoEMeasurements(limit = 24, siteId?: string): Promise<QoEMeasurement[]> {
    try {
      let query = supabase
        .from('qoe_measurements')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (siteId) {
        query = query.eq('site_id', siteId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching QoE measurements:', error);
      return [];
    }
  }

  async getAuthFunnelMetrics(hours = 24): Promise<AuthFunnelMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('auth_funnel_metrics')
        .select('*')
        .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      return (data || []) as AuthFunnelMetrics[];
    } catch (error) {
      console.error('Error fetching auth funnel metrics:', error);
      return [];
    }
  }

  async getActiveIncidents(): Promise<IncidentData[]> {
    try {
      const { data, error } = await supabase
        .from('incidents_tracking')
        .select('*')
        .in('status', ['open', 'investigating'])
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []) as IncidentData[];
    } catch (error) {
      console.error('Error fetching active incidents:', error);
      return [];
    }
  }

  async recordQoEMeasurement(measurement: Omit<QoEMeasurement, 'id' | 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('qoe_measurements')
        .insert([measurement]);
      
      if (error) throw error;
      
      // Invalidate cache
      this.metricsCache.timestamp = 0;
    } catch (error) {
      console.error('Error recording QoE measurement:', error);
      throw error;
    }
  }

  async recordAuthMetrics(metrics: Omit<AuthFunnelMetrics, 'id' | 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('auth_funnel_metrics')
        .insert([metrics]);
      
      if (error) throw error;
      
      // Invalidate cache
      this.metricsCache.timestamp = 0;
    } catch (error) {
      console.error('Error recording auth metrics:', error);
      throw error;
    }
  }

  async createIncident(incident: Omit<IncidentData, 'id' | 'started_at' | 'last_update_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('incidents_tracking')
        .insert([incident])
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Invalidate cache
      this.metricsCache.timestamp = 0;
      
      return data.id;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }

  async updateIncident(id: string, updates: Partial<IncidentData>): Promise<void> {
    try {
      const { error } = await supabase
        .from('incidents_tracking')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Invalidate cache
      this.metricsCache.timestamp = 0;
    } catch (error) {
      console.error('Error updating incident:', error);
      throw error;
    }
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.metricsCache.timestamp = 0;
  }

  // Subscribe to real-time updates
  subscribeToMetrics(callback: (metrics: RealtimeMetrics) => void): () => void {
    const subscription = supabase
      .channel('realtime-metrics')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'qoe_measurements' 
      }, () => {
        this.clearCache();
        this.getRealtimeMetrics().then(callback);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'auth_funnel_metrics' 
      }, () => {
        this.clearCache();
        this.getRealtimeMetrics().then(callback);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'incidents_tracking' 
      }, () => {
        this.clearCache();
        this.getRealtimeMetrics().then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }
}

export const realtimeMetricsService = new RealtimeMetricsService();
export default realtimeMetricsService;