-- CORRECTION FINALE : Fix de la dernière vulnérabilité critique sur wifi_users

-- Drop les politiques existantes problématiques
DROP POLICY IF EXISTS "wifi_users_user_select" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_user_update" ON public.wifi_users;
DROP POLICY IF EXISTS "secure_wifi_users_registration" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_admin_access" ON public.wifi_users;

-- 1. Secure wifi_users table avec validation stricte
CREATE POLICY "wifi_users_strict_user_select"
ON public.wifi_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "wifi_users_strict_user_update"
ON public.wifi_users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Ensure user cannot modify critical security fields
  id = OLD.id AND
  created_at = OLD.created_at
);

CREATE POLICY "wifi_users_secure_registration"
ON public.wifi_users FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  -- Strict validation requirements
  email IS NOT NULL AND
  email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  auth_method IS NOT NULL AND
  auth_method IN ('email', 'sms', 'social') AND
  name IS NOT NULL AND
  length(name) >= 2
);

CREATE POLICY "wifi_users_admin_management"
ON public.wifi_users FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 2. Renforcer la sécurité des transactions
DROP POLICY IF EXISTS "secure_transactions_user_read" ON public.transactions;
DROP POLICY IF EXISTS "secure_transactions_system_only" ON public.transactions;
DROP POLICY IF EXISTS "secure_transactions_admin_update" ON public.transactions;

CREATE POLICY "transactions_user_own_only"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "transactions_admin_full_access"
ON public.transactions FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 3. Sécuriser davantage les sessions WiFi
DROP POLICY IF EXISTS "wifi_sessions_user_select" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_user_insert" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_user_update" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_admin_access" ON public.wifi_sessions;

CREATE POLICY "wifi_sessions_user_own_only"
ON public.wifi_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "wifi_sessions_admin_management"
ON public.wifi_sessions FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 4. Sécuriser les conversations de chat
DROP POLICY IF EXISTS "secure_chat_conversations_select" ON public.chat_conversations;
DROP POLICY IF EXISTS "secure_chat_conversations_insert" ON public.chat_conversations;
DROP POLICY IF EXISTS "secure_chat_conversations_update" ON public.chat_conversations;
DROP POLICY IF EXISTS "secure_chat_conversations_delete" ON public.chat_conversations;

CREATE POLICY "chat_conversations_user_own_strict"
ON public.chat_conversations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "chat_conversations_user_create_strict"
ON public.chat_conversations FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  user_id IS NOT NULL
);

CREATE POLICY "chat_conversations_user_update_strict"
ON public.chat_conversations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  user_id = OLD.user_id -- Cannot change ownership
);

CREATE POLICY "chat_conversations_admin_access"
ON public.chat_conversations FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 5. Sécuriser les messages de chat
DROP POLICY IF EXISTS "secure_chat_messages_select" ON public.chat_messages;
DROP POLICY IF EXISTS "secure_chat_messages_insert" ON public.chat_messages;
DROP POLICY IF EXISTS "secure_chat_messages_admin" ON public.chat_messages;

CREATE POLICY "chat_messages_user_conversation_only"
ON public.chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND cc.user_id = auth.uid()
  )
);

CREATE POLICY "chat_messages_user_create_validated"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND cc.user_id = auth.uid()
  ) AND
  content IS NOT NULL AND
  length(content) > 0 AND
  sender_type IN ('user', 'assistant')
);

CREATE POLICY "chat_messages_admin_access"
ON public.chat_messages FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());