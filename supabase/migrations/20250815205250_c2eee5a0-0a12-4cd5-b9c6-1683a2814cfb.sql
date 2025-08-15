-- Phase 1: Fix critical RLS issues - Handle existing policies carefully

-- 1. Fix wifi_users table - check and drop specific conflicting policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_users' AND policyname = 'Allow all operations on wifi_users') THEN
        DROP POLICY "Allow all operations on wifi_users" ON public.wifi_users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_users' AND policyname = 'Allow user registration') THEN
        DROP POLICY "Allow user registration" ON public.wifi_users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_users' AND policyname = 'Users can update their own profile') THEN
        DROP POLICY "Users can update their own profile" ON public.wifi_users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_users' AND policyname = 'Users can view their own profile') THEN
        DROP POLICY "Users can view their own profile" ON public.wifi_users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_users' AND policyname = 'Users can register') THEN
        DROP POLICY "Users can register" ON public.wifi_users;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_users' AND policyname = 'Admin access to wifi_users') THEN
        DROP POLICY "Admin access to wifi_users" ON public.wifi_users;
    END IF;
END $$;

-- Create secure wifi_users policies
CREATE POLICY "wifi_users_user_select"
ON public.wifi_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "wifi_users_user_update"
ON public.wifi_users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "wifi_users_user_insert"
ON public.wifi_users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "wifi_users_admin_access"
ON public.wifi_users FOR ALL
TO authenticated
USING (is_admin_user());

-- 2. Fix wifi_sessions table
DO $$
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_sessions' AND policyname = 'Allow all operations on wifi_sessions') THEN
        DROP POLICY "Allow all operations on wifi_sessions" ON public.wifi_sessions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_sessions' AND policyname = 'System can create sessions for authenticated users') THEN
        DROP POLICY "System can create sessions for authenticated users" ON public.wifi_sessions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_sessions' AND policyname = 'System can update user sessions') THEN
        DROP POLICY "System can update user sessions" ON public.wifi_sessions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wifi_sessions' AND policyname = 'Users can view their own sessions') THEN
        DROP POLICY "Users can view their own sessions" ON public.wifi_sessions;
    END IF;
END $$;

-- Create secure wifi_sessions policies
CREATE POLICY "wifi_sessions_user_select"
ON public.wifi_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "wifi_sessions_user_insert"
ON public.wifi_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wifi_sessions_user_update"
ON public.wifi_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "wifi_sessions_admin_access"
ON public.wifi_sessions FOR ALL
TO authenticated
USING (is_admin_user());