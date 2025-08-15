-- Phase 1: Critical Security Migration
-- Fixing 38 security issues: RLS activation + SQL function security

-- 1. Enable RLS on all public tables that currently don't have it
ALTER TABLE public.ad_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_providers_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_customer_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_enabled_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wifi_plans ENABLE ROW LEVEL SECURITY;

-- 2. Create restrictive RLS policies (admin only for now)
-- Admin audit logs - only admins can access
CREATE POLICY "Admin access only" ON public.admin_audit_logs FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- Admin sessions - only admins can access  
CREATE POLICY "Admin access only" ON public.admin_sessions FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- Security alerts - only admins can access
CREATE POLICY "Admin access only" ON public.security_alerts FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- AI providers config - only superadmins can access
CREATE POLICY "Superadmin access only" ON public.ai_providers_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'superadmin');

-- Audit config - only superadmins can access
CREATE POLICY "Superadmin access only" ON public.audit_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'superadmin');

-- Auth config - only superadmins can access
CREATE POLICY "Superadmin access only" ON public.auth_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'superadmin');

-- Portal configuration - admin access
CREATE POLICY "Admin access only" ON public.portal_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Portal themes, modules, customizations - admin access
CREATE POLICY "Admin access only" ON public.portal_themes FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_modules FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_customizations FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_enabled_modules FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_customer_journeys FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_analytics FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Payment methods - admin access
CREATE POLICY "Admin access only" ON public.payment_methods FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Transaction management - admin access
CREATE POLICY "Admin access only" ON public.transactions FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- WiFi plans - admin access
CREATE POLICY "Admin access only" ON public.wifi_plans FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Chat system - allow public read, admin write
CREATE POLICY "Public read, admin write" ON public.chat_conversations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write only" ON public.chat_conversations FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read, admin write" ON public.chat_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write only" ON public.chat_messages FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read, admin write" ON public.chat_knowledge_base FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write only" ON public.chat_knowledge_base FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Admin access only" ON public.chat_analytics FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Gaming & loyalty - allow public read for active items
CREATE POLICY "Public read active" ON public.games FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write only" ON public.games FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read" ON public.loyalty_levels FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write only" ON public.loyalty_levels FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read" ON public.rewards FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write only" ON public.rewards FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Quiz system - allow public read for active quizzes
CREATE POLICY "Public read active" ON public.quizzes FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write only" ON public.quizzes FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read" ON public.quiz_questions FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_questions.quiz_id AND active = true)
);
CREATE POLICY "Admin write only" ON public.quiz_questions FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read" ON public.quiz_options FOR SELECT TO anon, authenticated USING (
  EXISTS (
    SELECT 1 FROM public.quiz_questions qq 
    JOIN public.quizzes q ON qq.quiz_id = q.id 
    WHERE qq.id = quiz_options.question_id AND q.active = true
  )
);
CREATE POLICY "Admin write only" ON public.quiz_options FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Ad videos - allow public read for active videos
CREATE POLICY "Public read active" ON public.ad_videos FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write only" ON public.ad_videos FOR INSERT, UPDATE, DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Referrals - users can see their own, admins see all
CREATE POLICY "User own referrals" ON public.referrals FOR SELECT TO authenticated USING (
  auth.uid()::text IN (referrer_id::text, referred_id::text)
);
CREATE POLICY "Admin full access" ON public.referrals FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- 3. Fix SQL functions with mutable search_path (security definer functions)
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    retention_period INTEGER;
BEGIN
    -- Récupérer la période de rétention configurée
    SELECT retention_days INTO retention_period FROM audit_config ORDER BY created_at DESC LIMIT 1;
    
    -- Supprimer les logs plus anciens que la période de rétention
    DELETE FROM admin_audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 day' * retention_period;
    
    -- Supprimer les sessions inactives anciennes
    DELETE FROM admin_sessions 
    WHERE ended_at IS NOT NULL 
    AND ended_at < NOW() - INTERVAL '1 day' * retention_period;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fn_apply_quota(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_record RECORD;
  session_record RECORD;
BEGIN
  -- Récupérer l'accès utilisateur avec le profil
  SELECT ua.*, ap.quota_mb, ap.quota_minutes, ap.name as profile_name
  INTO user_record
  FROM user_access ua
  JOIN access_profiles ap ON ua.profile_id = ap.id
  WHERE ua.user_id = target_user_id AND ap.is_active = true;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Vérifier si les quotas sont dépassés
  IF (user_record.quota_mb IS NOT NULL AND user_record.quota_used_mb >= user_record.quota_mb) OR
     (user_record.quota_minutes IS NOT NULL AND user_record.minutes_used >= user_record.quota_minutes) THEN
    
    -- Marquer les sessions actives comme expirées
    UPDATE radius_sessions 
    SET state = 'expired', 
        stop_time = now(),
        terminate_cause = 'quota_exceeded'
    WHERE user_id = target_user_id AND state = 'active';
    
    -- Créer les requêtes CoA pour déconnecter
    FOR session_record IN 
      SELECT id, nas_ip_address, nas_port_id, session_id
      FROM radius_sessions 
      WHERE user_id = target_user_id AND state = 'expired' AND stop_time >= now() - INTERVAL '1 minute'
    LOOP
      INSERT INTO radius_coa_requests (
        session_id, request_type, attributes, nas_ip_address, nas_port_id
      ) VALUES (
        session_record.id,
        'disconnect',
        jsonb_build_object('reason', 'quota_exceeded'),
        session_record.nas_ip_address,
        session_record.nas_port_id
      );
    END LOOP;
  END IF;
END;
$function$;