-- Create tables for KPI dashboard system

-- 1. Site availability metrics (uptime tracking)
CREATE TABLE public.site_availability_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uptime_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  downtime_minutes INTEGER NOT NULL DEFAULT 0,
  sla_breached BOOLEAN NOT NULL DEFAULT false,
  incident_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. QoE (Quality of Experience) measurements  
CREATE TABLE public.qoe_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id TEXT NOT NULL,
  ap_name TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  qoe_score INTEGER NOT NULL CHECK (qoe_score >= 0 AND qoe_score <= 100),
  latency_p95_ms NUMERIC(8,2),
  packet_loss_percentage NUMERIC(5,2),
  throughput_mbps NUMERIC(8,2),
  user_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Auth funnel metrics (authentication success tracking)
CREATE TABLE public.auth_funnel_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  auth_method TEXT NOT NULL, -- 'sms', 'voucher', 'payment', 'family'
  stage TEXT NOT NULL, -- 'captive', 'dhcp', 'dns', 'radius', 'internet'
  success_count INTEGER NOT NULL DEFAULT 0,
  failure_count INTEGER NOT NULL DEFAULT 0,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  success_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  site_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Financial KPIs (MRR, NRR, ARPU, Churn)
CREATE TABLE public.financial_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mrr_new NUMERIC(12,2) NOT NULL DEFAULT 0,
  mrr_expansion NUMERIC(12,2) NOT NULL DEFAULT 0,
  mrr_contraction NUMERIC(12,2) NOT NULL DEFAULT 0,
  mrr_churn NUMERIC(12,2) NOT NULL DEFAULT 0,
  mrr_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  nrr_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  arpu NUMERIC(10,2) NOT NULL DEFAULT 0,
  arpu_b2b NUMERIC(10,2) NOT NULL DEFAULT 0,
  arpu_b2c NUMERIC(10,2) NOT NULL DEFAULT 0,
  churn_rate_customers NUMERIC(5,2) NOT NULL DEFAULT 0,
  churn_rate_revenue NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_customers INTEGER NOT NULL DEFAULT 0,
  new_customers INTEGER NOT NULL DEFAULT 0,
  churned_customers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Incidents tracking (MTTR monitoring)
CREATE TABLE public.incidents_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  impact_level TEXT NOT NULL CHECK (impact_level IN ('service_down', 'performance_degraded', 'partial_outage', 'maintenance')),
  affected_sites TEXT[],
  affected_users_count INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  first_response_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  mttr_minutes INTEGER,
  sla_target_minutes INTEGER NOT NULL DEFAULT 240, -- 4h for critical
  sla_breached BOOLEAN NOT NULL DEFAULT false,
  assigned_to UUID,
  last_update_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  eta TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Customer satisfaction metrics
CREATE TABLE public.customer_satisfaction_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  nps_score INTEGER CHECK (nps_score >= -100 AND nps_score <= 100),
  csat_score NUMERIC(3,1) CHECK (csat_score >= 0 AND csat_score <= 5),
  fcr_rate NUMERIC(5,2) NOT NULL DEFAULT 0, -- First Contact Resolution
  ttfa_median_hours NUMERIC(6,2), -- Time To First Access
  ttfa_p95_hours NUMERIC(6,2),
  survey_responses INTEGER NOT NULL DEFAULT 0,
  support_tickets INTEGER NOT NULL DEFAULT 0,
  resolved_first_contact INTEGER NOT NULL DEFAULT 0,
  segment TEXT, -- 'b2b', 'b2c', 'enterprise'
  acquisition_channel TEXT, -- 'sales', 'self_service', 'partner'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_site_availability_metrics_site_timestamp ON public.site_availability_metrics(site_id, timestamp DESC);
CREATE INDEX idx_qoe_measurements_site_timestamp ON public.qoe_measurements(site_id, timestamp DESC);
CREATE INDEX idx_auth_funnel_metrics_timestamp_method ON public.auth_funnel_metrics(timestamp DESC, auth_method);
CREATE INDEX idx_financial_kpis_date ON public.financial_kpis(metric_date DESC);
CREATE INDEX idx_incidents_tracking_status_severity ON public.incidents_tracking(status, severity);
CREATE INDEX idx_customer_satisfaction_metrics_date ON public.customer_satisfaction_metrics(metric_date DESC);

-- Enable RLS on all tables
ALTER TABLE public.site_availability_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qoe_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_funnel_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_satisfaction_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (admin only for all KPI tables)
CREATE POLICY "site_availability_metrics_admin_only" ON public.site_availability_metrics FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());
CREATE POLICY "qoe_measurements_admin_only" ON public.qoe_measurements FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());
CREATE POLICY "auth_funnel_metrics_admin_only" ON public.auth_funnel_metrics FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());
CREATE POLICY "financial_kpis_admin_only" ON public.financial_kpis FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());
CREATE POLICY "incidents_tracking_admin_only" ON public.incidents_tracking FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());
CREATE POLICY "customer_satisfaction_metrics_admin_only" ON public.customer_satisfaction_metrics FOR ALL TO authenticated USING (is_admin_user()) WITH CHECK (is_admin_user());

-- Create trigger for updating incidents MTTR
CREATE OR REPLACE FUNCTION update_incident_mttr()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.resolved_at IS NOT NULL AND OLD.resolved_at IS NULL THEN
    NEW.mttr_minutes = EXTRACT(EPOCH FROM (NEW.resolved_at - NEW.started_at)) / 60;
    NEW.sla_breached = (NEW.mttr_minutes > NEW.sla_target_minutes);
  END IF;
  NEW.last_update_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_incident_mttr
  BEFORE UPDATE ON public.incidents_tracking
  FOR EACH ROW EXECUTE FUNCTION update_incident_mttr();

-- Function to get real-time dashboard metrics
CREATE OR REPLACE FUNCTION get_realtime_dashboard_metrics()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT json_build_object(
    'global_uptime', COALESCE((
      SELECT AVG(uptime_percentage) 
      FROM site_availability_metrics 
      WHERE timestamp > NOW() - INTERVAL '1 hour'
    ), 100),
    'global_qoe_score', COALESCE((
      SELECT AVG(qoe_score) 
      FROM qoe_measurements 
      WHERE timestamp > NOW() - INTERVAL '1 hour'
    ), 100),
    'auth_success_rate', COALESCE((
      SELECT AVG(success_rate) 
      FROM auth_funnel_metrics 
      WHERE timestamp > NOW() - INTERVAL '1 hour'
    ), 100),
    'active_incidents', (
      SELECT COUNT(*) 
      FROM incidents_tracking 
      WHERE status IN ('open', 'investigating')
    ),
    'critical_sites', (
      SELECT json_agg(
        json_build_object(
          'site_id', site_id,
          'uptime', uptime_percentage,
          'incidents', incident_count
        )
      )
      FROM site_availability_metrics 
      WHERE timestamp > NOW() - INTERVAL '1 hour' 
      AND (uptime_percentage < 99.9 OR incident_count > 0)
    ),
    'last_updated', now()
  )
  WHERE is_admin_user();
$$;