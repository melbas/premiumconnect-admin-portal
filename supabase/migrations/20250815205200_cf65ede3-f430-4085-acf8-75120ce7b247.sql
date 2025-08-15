-- Phase 1: Fix critical RLS issues

-- 1. Fix wifi_users table - remove conflicting policies and create secure ones
DROP POLICY IF EXISTS "Allow all operations on wifi_users" ON public.wifi_users;
DROP POLICY IF EXISTS "Allow user registration" ON public.wifi_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.wifi_users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.wifi_users;

-- Create secure wifi_users policies
CREATE POLICY "Users can view their own profile"
ON public.wifi_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.wifi_users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can register"
ON public.wifi_users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin access to wifi_users"
ON public.wifi_users FOR ALL
TO authenticated
USING (is_admin_user());

-- 2. Fix wifi_sessions table - remove conflicting policies and create secure ones
DROP POLICY IF EXISTS "Allow all operations on wifi_sessions" ON public.wifi_sessions;
DROP POLICY IF EXISTS "System can create sessions for authenticated users" ON public.wifi_sessions;
DROP POLICY IF EXISTS "System can update user sessions" ON public.wifi_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.wifi_sessions;

-- Create secure wifi_sessions policies
CREATE POLICY "Users can view their own sessions"
ON public.wifi_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can create user sessions"
ON public.wifi_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update user sessions"
ON public.wifi_sessions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin access to wifi_sessions"
ON public.wifi_sessions FOR ALL
TO authenticated
USING (is_admin_user());

-- 3. Fix vw_active_sessions view - recreate as security definer function instead
DROP VIEW IF EXISTS public.vw_active_sessions;

-- Create secure function to get active sessions
CREATE OR REPLACE FUNCTION public.get_active_sessions()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  ip_address inet,
  start_time timestamptz,
  last_seen timestamptz,
  rx_bytes bigint,
  tx_bytes bigint,
  session_time integer,
  max_down_kbps integer,
  max_up_kbps integer,
  quota_mb integer,
  quota_used_mb numeric,
  minutes_used integer,
  quota_usage_percent numeric,
  ssid text,
  profile_name text,
  session_id text,
  username text,
  mac_address text,
  ap_name text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
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
      WHEN ap.quota_mb > 0 THEN (ua.quota_used_mb * 100.0 / ap.quota_mb)
      ELSE 0
    END as quota_usage_percent,
    rs.ssid,
    ap.name as profile_name,
    rs.session_id,
    rs.username,
    rs.mac_address,
    rs.ap_name
  FROM radius_sessions rs
  LEFT JOIN access_profiles ap ON rs.profile_id = ap.id
  LEFT JOIN user_access ua ON rs.user_id = ua.user_id AND ua.profile_id = ap.id
  WHERE rs.state = 'active'
    AND (
      is_admin_user() OR 
      (auth.uid() = rs.user_id)
    );
$$;

-- 4. Secure chat_conversations table
DROP POLICY IF EXISTS "Allow public read" ON public.chat_conversations;

CREATE POLICY "Users can view their own conversations"
ON public.chat_conversations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.chat_conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON public.chat_conversations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin access to chat_conversations"
ON public.chat_conversations FOR ALL
TO authenticated
USING (is_admin_user());

-- 5. Secure chat_messages table
DROP POLICY IF EXISTS "Allow public read" ON public.chat_messages;

CREATE POLICY "Users can view messages from their conversations"
ON public.chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND (cc.user_id = auth.uid() OR is_admin_user())
  )
);

CREATE POLICY "System can create chat messages"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND cc.user_id = auth.uid()
  )
);

CREATE POLICY "Admin access to chat_messages"
ON public.chat_messages FOR ALL
TO authenticated
USING (is_admin_user());

-- 6. Secure events table
DROP POLICY IF EXISTS "Allow read access to events" ON public.events;
DROP POLICY IF EXISTS "Allow insert access to events" ON public.events;
DROP POLICY IF EXISTS "Allow event creation for authenticated users" ON public.events;
DROP POLICY IF EXISTS "Users can view their own events" ON public.events;

CREATE POLICY "Users can view their own events"
ON public.events FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin access to events"
ON public.events FOR ALL
TO authenticated
USING (is_admin_user());