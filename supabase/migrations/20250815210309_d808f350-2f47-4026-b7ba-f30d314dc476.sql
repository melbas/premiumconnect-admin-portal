-- CORRECTION URGENTE : Fix des vulnérabilités critiques détectées

-- 1. Fix Admin System Tables - Remove 'true' policies and implement proper admin verification
DROP POLICY IF EXISTS "Admin access to radius_coa_requests" ON public.radius_coa_requests;
DROP POLICY IF EXISTS "Admin access to user_access" ON public.user_access;
DROP POLICY IF EXISTS "Admin access to vouchers" ON public.vouchers;

-- Create secure admin-only policies for radius_coa_requests
CREATE POLICY "secure_radius_coa_admin_only"
ON public.radius_coa_requests FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Create secure admin-only policies for user_access  
CREATE POLICY "secure_user_access_admin_only"
ON public.user_access FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Create secure admin-only policies for vouchers
CREATE POLICY "secure_vouchers_admin_only"
ON public.vouchers FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 2. Fix wifi_users public registration vulnerability
DROP POLICY IF EXISTS "wifi_users_user_insert" ON public.wifi_users;

-- Create secure user registration policy
CREATE POLICY "secure_wifi_users_registration"
ON public.wifi_users FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  -- Ensure proper data validation
  email IS NOT NULL AND
  auth_method IS NOT NULL
);

-- 3. Fix radius_sessions system update vulnerability
DROP POLICY IF EXISTS "wifi_sessions_admin_access" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_user_update" ON public.wifi_sessions;

-- Create secure session update policies
CREATE POLICY "secure_radius_sessions_user_read"
ON public.radius_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "secure_radius_sessions_system_update"
ON public.radius_sessions FOR UPDATE
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

CREATE POLICY "secure_radius_sessions_system_insert"
ON public.radius_sessions FOR INSERT
TO authenticated
WITH CHECK (is_admin_user());

-- 4. Fix transactions system - Remove public transaction creation
DROP POLICY IF EXISTS "Allow all operations on transactions" ON public.transactions;

-- Create secure transaction policies
CREATE POLICY "secure_transactions_user_read"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "secure_transactions_system_only"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (is_admin_user());

CREATE POLICY "secure_transactions_admin_update"
ON public.transactions FOR UPDATE
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 5. Ensure all admin tables have proper "No access" fallback policy
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_providers_config ENABLE ROW LEVEL SECURITY;

-- Verify critical tables have proper no-access policies
CREATE POLICY "secure_admin_audit_logs_no_access"
ON public.admin_audit_logs FOR ALL
TO authenticated
USING (false);

CREATE POLICY "secure_admin_sessions_no_access"
ON public.admin_sessions FOR ALL
TO authenticated
USING (false);

CREATE POLICY "secure_security_alerts_no_access"
ON public.security_alerts FOR ALL
TO authenticated
USING (false);

CREATE POLICY "secure_ai_providers_config_no_access"
ON public.ai_providers_config FOR ALL
TO authenticated
USING (false);