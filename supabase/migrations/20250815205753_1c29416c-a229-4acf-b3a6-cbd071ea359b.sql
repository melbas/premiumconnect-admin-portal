-- Continue Phase 1: Fix remaining critical RLS issues with proper policy checking

-- 3. Fix vw_active_sessions view - recreate as security definer function instead
DROP VIEW IF EXISTS public.vw_active_sessions;

-- Create secure function to get active sessions with proper search_path
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
SET search_path = public
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
DO $$
BEGIN
    -- Drop existing policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'Allow public read') THEN
        DROP POLICY "Allow public read" ON public.chat_conversations;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'chat_conversations_user_select') THEN
        DROP POLICY "chat_conversations_user_select" ON public.chat_conversations;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'chat_conversations_user_insert') THEN
        DROP POLICY "chat_conversations_user_insert" ON public.chat_conversations;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'chat_conversations_user_update') THEN
        DROP POLICY "chat_conversations_user_update" ON public.chat_conversations;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'chat_conversations_admin_access') THEN
        DROP POLICY "chat_conversations_admin_access" ON public.chat_conversations;
    END IF;
END $$;

CREATE POLICY "secure_chat_conversations_select"
ON public.chat_conversations FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "secure_chat_conversations_insert"
ON public.chat_conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "secure_chat_conversations_update"
ON public.chat_conversations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR is_admin_user())
WITH CHECK (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "secure_chat_conversations_delete"
ON public.chat_conversations FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

-- 5. Secure chat_messages table
DO $$
BEGIN
    -- Drop existing policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Allow public read') THEN
        DROP POLICY "Allow public read" ON public.chat_messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'chat_messages_user_select') THEN
        DROP POLICY "chat_messages_user_select" ON public.chat_messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'chat_messages_user_insert') THEN
        DROP POLICY "chat_messages_user_insert" ON public.chat_messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'chat_messages_admin_access') THEN
        DROP POLICY "chat_messages_admin_access" ON public.chat_messages;
    END IF;
END $$;

CREATE POLICY "secure_chat_messages_select"
ON public.chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND (cc.user_id = auth.uid() OR is_admin_user())
  )
);

CREATE POLICY "secure_chat_messages_insert"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND cc.user_id = auth.uid()
  )
);

CREATE POLICY "secure_chat_messages_admin"
ON public.chat_messages FOR ALL
TO authenticated
USING (is_admin_user());

-- 6. Secure events table
DO $$
BEGIN
    -- Drop existing policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow read access to events') THEN
        DROP POLICY "Allow read access to events" ON public.events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow insert access to events') THEN
        DROP POLICY "Allow insert access to events" ON public.events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Allow event creation for authenticated users') THEN
        DROP POLICY "Allow event creation for authenticated users" ON public.events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Users can view their own events') THEN
        DROP POLICY "Users can view their own events" ON public.events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'events_user_select') THEN
        DROP POLICY "events_user_select" ON public.events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'events_user_insert') THEN
        DROP POLICY "events_user_insert" ON public.events;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'events_admin_access') THEN
        DROP POLICY "events_admin_access" ON public.events;
    END IF;
END $$;

CREATE POLICY "secure_events_select"
ON public.events FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "secure_events_insert"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "secure_events_admin"
ON public.events FOR ALL
TO authenticated
USING (is_admin_user());

-- Fix search_path for existing functions
ALTER FUNCTION public.cleanup_old_audit_logs() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.fn_apply_quota(uuid) SET search_path = public;
ALTER FUNCTION public.is_admin_user() SET search_path = public;