-- Phase 2: Fix remaining critical business data exposure issues

-- 1. Secure portal_statistics table - business analytics data
ALTER TABLE public.portal_statistics ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policy
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portal_statistics' AND policyname = 'Allow all operations on portal_statistics') THEN
        DROP POLICY "Allow all operations on portal_statistics" ON public.portal_statistics;
    END IF;
END $$;

-- Create secure policies for portal_statistics
CREATE POLICY "portal_statistics_admin_only"
ON public.portal_statistics FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 2. Secure access_profiles table - network infrastructure data
-- Drop existing permissive policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'access_profiles' AND policyname = 'Admin access to access_profiles') THEN
        DROP POLICY "Admin access to access_profiles" ON public.access_profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'access_profiles' AND policyname = 'Only admins can manage access profiles') THEN
        DROP POLICY "Only admins can manage access profiles" ON public.access_profiles;
    END IF;
END $$;

-- Create secure policies for access_profiles
CREATE POLICY "access_profiles_admin_only"
ON public.access_profiles FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 3. Secure user_segments table - customer segmentation data
-- Drop existing permissive policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_segments' AND policyname = 'Allow full access to user_segments') THEN
        DROP POLICY "Allow full access to user_segments" ON public.user_segments;
    END IF;
END $$;

-- Create secure policies for user_segments
CREATE POLICY "user_segments_admin_only"
ON public.user_segments FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 4. Secure user_segment_memberships table
-- Drop existing permissive policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_segment_memberships' AND policyname = 'Allow full access to user_segment_memberships') THEN
        DROP POLICY "Allow full access to user_segment_memberships" ON public.user_segment_memberships;
    END IF;
END $$;

-- Create secure policies for user_segment_memberships
CREATE POLICY "user_segment_memberships_admin_only"
ON public.user_segment_memberships FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Add policy for users to see their own segment memberships (read-only)
CREATE POLICY "user_segment_memberships_user_select"
ON public.user_segment_memberships FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Phase 3: Enable authentication configuration optimizations
-- Create auth configuration table for OTP settings
CREATE TABLE IF NOT EXISTS public.auth_otp_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    otp_expiry_seconds integer NOT NULL DEFAULT 300, -- 5 minutes instead of 24 hours
    max_attempts integer NOT NULL DEFAULT 3,
    enable_leaked_password_protection boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on auth config
ALTER TABLE public.auth_otp_config ENABLE ROW LEVEL SECURITY;

-- Only admins can manage auth config
CREATE POLICY "auth_otp_config_admin_only"
ON public.auth_otp_config FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Insert default secure configuration
INSERT INTO public.auth_otp_config (otp_expiry_seconds, enable_leaked_password_protection)
VALUES (300, true)
ON CONFLICT DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_auth_otp_config_updated_at
    BEFORE UPDATE ON public.auth_otp_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();