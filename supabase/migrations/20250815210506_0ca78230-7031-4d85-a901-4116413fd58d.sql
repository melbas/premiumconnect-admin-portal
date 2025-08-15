-- CORRECTION FINALE : Fix de la dernière vulnérabilité critique sur wifi_users (sans OLD reference)

-- Drop les politiques existantes problématiques
DROP POLICY IF EXISTS "wifi_users_strict_user_select" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_strict_user_update" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_secure_registration" ON public.wifi_users;
DROP POLICY IF EXISTS "wifi_users_admin_management" ON public.wifi_users;

-- 1. Secure wifi_users table avec validation stricte
CREATE POLICY "wifi_users_final_user_select"
ON public.wifi_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "wifi_users_final_user_update"
ON public.wifi_users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "wifi_users_final_secure_registration"
ON public.wifi_users FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id AND
  -- Strict validation requirements
  email IS NOT NULL AND
  auth_method IS NOT NULL AND
  name IS NOT NULL
);

CREATE POLICY "wifi_users_final_admin_management"
ON public.wifi_users FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 2. Renforcer la sécurité des transactions
DROP POLICY IF EXISTS "transactions_user_own_only" ON public.transactions;
DROP POLICY IF EXISTS "transactions_admin_full_access" ON public.transactions;

CREATE POLICY "transactions_final_user_read"
ON public.transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "transactions_final_admin_only"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (is_admin_user());

CREATE POLICY "transactions_final_admin_update"
ON public.transactions FOR UPDATE
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

CREATE POLICY "transactions_final_admin_delete"
ON public.transactions FOR DELETE
TO authenticated
USING (is_admin_user());

-- 3. Sécuriser davantage les sessions WiFi
DROP POLICY IF EXISTS "wifi_sessions_user_own_only" ON public.wifi_sessions;
DROP POLICY IF EXISTS "wifi_sessions_admin_management" ON public.wifi_sessions;

CREATE POLICY "wifi_sessions_final_user_read"
ON public.wifi_sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "wifi_sessions_final_admin_management"
ON public.wifi_sessions FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- 4. Sécuriser les conversations de chat
DROP POLICY IF EXISTS "chat_conversations_user_own_strict" ON public.chat_conversations;
DROP POLICY IF EXISTS "chat_conversations_user_create_strict" ON public.chat_conversations;
DROP POLICY IF EXISTS "chat_conversations_user_update_strict" ON public.chat_conversations;
DROP POLICY IF EXISTS "chat_conversations_admin_access" ON public.chat_conversations;

CREATE POLICY "chat_conversations_final_user_read"
ON public.chat_conversations FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "chat_conversations_final_user_create"
ON public.chat_conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chat_conversations_final_user_update"
ON public.chat_conversations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR is_admin_user())
WITH CHECK (auth.uid() = user_id OR is_admin_user());

CREATE POLICY "chat_conversations_final_admin_delete"
ON public.chat_conversations FOR DELETE
TO authenticated
USING (is_admin_user());

-- 5. Sécuriser les messages de chat
DROP POLICY IF EXISTS "chat_messages_user_conversation_only" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_user_create_validated" ON public.chat_messages;
DROP POLICY IF EXISTS "chat_messages_admin_access" ON public.chat_messages;

CREATE POLICY "chat_messages_final_user_read"
ON public.chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND (cc.user_id = auth.uid() OR is_admin_user())
  )
);

CREATE POLICY "chat_messages_final_user_create"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_conversations cc 
    WHERE cc.id = conversation_id 
    AND cc.user_id = auth.uid()
  )
);

CREATE POLICY "chat_messages_final_admin_access"
ON public.chat_messages FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());