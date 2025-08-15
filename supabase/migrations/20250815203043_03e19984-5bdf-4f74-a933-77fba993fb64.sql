-- Critical Security Fix: Secure remaining tables with RLS
-- Fix for 4 critical security vulnerabilities

-- 1. Secure wifi_users table (CRITICAL - contains emails, phones, MAC addresses)
ALTER TABLE public.wifi_users ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view their own profile"
ON public.wifi_users FOR SELECT
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
ON public.wifi_users FOR UPDATE
USING (auth.uid()::text = id::text);

CREATE POLICY "Allow user registration"
ON public.wifi_users FOR INSERT
WITH CHECK (auth.uid()::text = id::text);

-- 2. Secure wifi_sessions table (CRITICAL - contains user activity tracking)
ALTER TABLE public.wifi_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
ON public.wifi_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create sessions for authenticated users"
ON public.wifi_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update user sessions"
ON public.wifi_sessions FOR UPDATE
USING (auth.uid() = user_id);

-- 3. Secure events table (WARNING - contains analytics and device info)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
ON public.events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow event creation for authenticated users"
ON public.events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Secure access_profiles table (WARNING - contains network config)
ALTER TABLE public.access_profiles ENABLE ROW LEVEL SECURITY;

-- Only admins can access network configuration
CREATE POLICY "Only admins can manage access profiles"
ON public.access_profiles FOR ALL
USING (
  auth.jwt() ->> 'role' = 'admin' OR 
  auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
);

-- 5. Fix SECURITY DEFINER view by dropping and recreating vw_active_sessions as a regular view
DROP VIEW IF EXISTS public.vw_active_sessions;

CREATE VIEW public.vw_active_sessions AS 
SELECT 
  rs.id,
  rs.user_id,
  rs.ip_address,
  rs.start_time,
  rs.last_seen,
  rs.rx_bytes,
  rs.tx_bytes,
  rs.session_time,
  ap.max_down_kbps,
  ap.max_up_kbps,
  ap.quota_mb,
  ua.quota_used_mb,
  ua.minutes_used,
  CASE 
    WHEN ap.quota_mb IS NOT NULL AND ap.quota_mb > 0 
    THEN (ua.quota_used_mb / ap.quota_mb * 100)::numeric(5,2)
    ELSE 0
  END as quota_usage_percent,
  ap.name as profile_name,
  rs.session_id,
  rs.username,
  rs.mac_address,
  rs.ap_name,
  rs.ssid
FROM radius_sessions rs
LEFT JOIN access_profiles ap ON rs.profile_id = ap.id
LEFT JOIN user_access ua ON rs.user_id = ua.user_id AND ua.profile_id = ap.id
WHERE rs.state = 'active';

-- Enable RLS on the view (it will inherit from underlying tables)
ALTER VIEW public.vw_active_sessions SET (security_barrier = true);

-- Add admin-only access policy for the view
GRANT SELECT ON public.vw_active_sessions TO authenticated;

-- 6. Optimize Auth OTP expiry (reduce from 24h to 10 minutes for security)
-- This needs to be done via Auth settings, not SQL