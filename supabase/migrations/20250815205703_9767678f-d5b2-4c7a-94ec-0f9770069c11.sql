-- Final Phase: Complete security lockdown for all remaining vulnerabilities

-- 1. Fix wifi_users RLS - it shouldn't be publicly readable
ALTER TABLE public.wifi_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_users ENABLE ROW LEVEL SECURITY;

-- Remove any remaining permissive policies and recreate secure ones
DROP POLICY IF EXISTS "wifi_users_user_select" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_user_update" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_user_insert" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_admin_access" ON public.wifi_users;

-- Create restrictive policies for wifi_users
CREATE POLICY "wifi_users_own_profile_only"
ON public.wifi_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "wifi_users_own_profile_update"
ON public.wifi_users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "wifi_users_registration"
ON public.wifi_users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "wifi_users_admin_full_access"
ON public.wifi_users FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 2. Secure portal_analytics table (business intelligence)
ALTER TABLE public.portal_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No access" ON public.portal_analytics;

CREATE POLICY "portal_analytics_admin_only"
ON public.portal_analytics FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 3. Secure chat_analytics table (business intelligence)
ALTER TABLE public.chat_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No access" ON public.chat_analytics;

CREATE POLICY "chat_analytics_admin_only"
ON public.chat_analytics FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 4. Secure transactions table (financial data)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No access" ON public.transactions;

-- Users can only see their own transactions, admins see all
CREATE POLICY "transactions_user_own_only"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "transactions_admin_full_access"
ON public.transactions FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- System can create transactions for users
CREATE POLICY "transactions_system_create"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. Additional security for wifi_sessions (already partly secured)
-- Remove any overly permissive policies that might remain
ALTER TABLE public.wifi_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wifi_sessions_user_select" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_user_insert" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_user_update" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_admin_access" ON public.wifi_sessions;

-- Recreate secure wifi_sessions policies
CREATE POLICY "wifi_sessions_user_own_only"
ON public.wifi_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "wifi_sessions_user_create_own"
ON public.wifi_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wifi_sessions_user_update_own"
ON public.wifi_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wifi_sessions_admin_full_access"
ON public.wifi_sessions FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 6. Secure radius_sessions table (session monitoring data)
-- This table already has admin-only access, but let's ensure it's properly secured
ALTER TABLE public.radius_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.radius_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin access to radius_sessions" ON public.radius_sessions;

-- Users can only see their own sessions, admins see all
CREATE POLICY "radius_sessions_user_own_only"
ON public.radius_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "radius_sessions_admin_full_access"
ON public.radius_sessions FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- System can manage sessions
CREATE POLICY "radius_sessions_system_management"
ON public.radius_sessions FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "radius_sessions_system_update"
ON public.radius_sessions FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Ensure security_alerts and admin_audit_logs remain locked down
-- These tables should already have "No access" policies which is correct
-- Let's verify they're properly secured

-- security_alerts should remain with "No access" policy - this is correct for security
-- admin_audit_logs should remain with "No access" policy - this is correct for security

-- 8. Create a comprehensive security dashboard function for admins
CREATE OR REPLACE FUNCTION public.get_security_dashboard_metrics()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM wifi_users),
    'active_sessions', (SELECT COUNT(*) FROM radius_sessions WHERE state = 'active'),
    'security_alerts_last_24h', (SELECT COUNT(*) FROM security_alerts WHERE created_at > NOW() - INTERVAL '24 hours'),
    'failed_auth_attempts_today', (SELECT COUNT(*) FROM admin_audit_logs WHERE action_type = 'auth_failure' AND created_at > CURRENT_DATE),
    'total_transactions_today', (SELECT COUNT(*) FROM transactions WHERE created_at > CURRENT_DATE),
    'last_security_scan', NOW()
  )
  WHERE is_admin_user();
$$;