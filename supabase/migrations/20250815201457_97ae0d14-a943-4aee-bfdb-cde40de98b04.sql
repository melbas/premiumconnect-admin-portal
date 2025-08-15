-- Phase 1: Critical Security Migration (Fixed)
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
-- Admin audit logs
CREATE POLICY "Admin access only" ON public.admin_audit_logs FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- Admin sessions
CREATE POLICY "Admin access only" ON public.admin_sessions FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- Security alerts
CREATE POLICY "Admin access only" ON public.security_alerts FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- AI providers config - superadmin only
CREATE POLICY "Superadmin access only" ON public.ai_providers_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'superadmin');

-- Audit config - superadmin only
CREATE POLICY "Superadmin access only" ON public.audit_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'superadmin');

-- Auth config - superadmin only
CREATE POLICY "Superadmin access only" ON public.auth_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'superadmin');

-- Portal configuration
CREATE POLICY "Admin access only" ON public.portal_config FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_themes FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_modules FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_customizations FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_enabled_modules FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_customer_journeys FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.portal_analytics FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Payment and transactions
CREATE POLICY "Admin access only" ON public.payment_methods FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.transactions FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin access only" ON public.wifi_plans FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Chat system policies
CREATE POLICY "Public read chat conversations" ON public.chat_conversations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write chat conversations" ON public.chat_conversations FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update chat conversations" ON public.chat_conversations FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete chat conversations" ON public.chat_conversations FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read chat messages" ON public.chat_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write chat messages" ON public.chat_messages FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update chat messages" ON public.chat_messages FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete chat messages" ON public.chat_messages FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read knowledge base" ON public.chat_knowledge_base FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write knowledge base" ON public.chat_knowledge_base FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update knowledge base" ON public.chat_knowledge_base FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete knowledge base" ON public.chat_knowledge_base FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Admin access only" ON public.chat_analytics FOR ALL TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Gaming and loyalty
CREATE POLICY "Public read active games" ON public.games FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write games" ON public.games FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update games" ON public.games FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete games" ON public.games FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read loyalty levels" ON public.loyalty_levels FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin write loyalty levels" ON public.loyalty_levels FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update loyalty levels" ON public.loyalty_levels FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete loyalty levels" ON public.loyalty_levels FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read active rewards" ON public.rewards FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write rewards" ON public.rewards FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update rewards" ON public.rewards FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete rewards" ON public.rewards FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Quiz system
CREATE POLICY "Public read active quizzes" ON public.quizzes FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write quizzes" ON public.quizzes FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update quizzes" ON public.quizzes FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete quizzes" ON public.quizzes FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read quiz questions" ON public.quiz_questions FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.quizzes WHERE id = quiz_questions.quiz_id AND active = true)
);
CREATE POLICY "Admin write quiz questions" ON public.quiz_questions FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update quiz questions" ON public.quiz_questions FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete quiz questions" ON public.quiz_questions FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

CREATE POLICY "Public read quiz options" ON public.quiz_options FOR SELECT TO anon, authenticated USING (
  EXISTS (
    SELECT 1 FROM public.quiz_questions qq 
    JOIN public.quizzes q ON qq.quiz_id = q.id 
    WHERE qq.id = quiz_options.question_id AND q.active = true
  )
);
CREATE POLICY "Admin write quiz options" ON public.quiz_options FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update quiz options" ON public.quiz_options FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete quiz options" ON public.quiz_options FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Ad videos
CREATE POLICY "Public read active ad videos" ON public.ad_videos FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admin write ad videos" ON public.ad_videos FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update ad videos" ON public.ad_videos FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete ad videos" ON public.ad_videos FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- Referrals
CREATE POLICY "User own referrals" ON public.referrals FOR SELECT TO authenticated USING (
  auth.uid()::text IN (referrer_id::text, referred_id::text)
);
CREATE POLICY "Admin full access referrals" ON public.referrals FOR INSERT TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin update referrals" ON public.referrals FOR UPDATE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));
CREATE POLICY "Admin delete referrals" ON public.referrals FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' IN ('admin', 'superadmin'));

-- 3. Fix SQL functions with mutable search_path
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    retention_period INTEGER;
BEGIN
    SELECT retention_days INTO retention_period FROM audit_config ORDER BY created_at DESC LIMIT 1;
    DELETE FROM admin_audit_logs WHERE created_at < NOW() - INTERVAL '1 day' * retention_period;
    DELETE FROM admin_sessions WHERE ended_at IS NOT NULL AND ended_at < NOW() - INTERVAL '1 day' * retention_period;
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
  SELECT ua.*, ap.quota_mb, ap.quota_minutes, ap.name as profile_name
  INTO user_record
  FROM user_access ua
  JOIN access_profiles ap ON ua.profile_id = ap.id
  WHERE ua.user_id = target_user_id AND ap.is_active = true;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  IF (user_record.quota_mb IS NOT NULL AND user_record.quota_used_mb >= user_record.quota_mb) OR
     (user_record.quota_minutes IS NOT NULL AND user_record.minutes_used >= user_record.quota_minutes) THEN
    
    UPDATE radius_sessions SET state = 'expired', stop_time = now(), terminate_cause = 'quota_exceeded'
    WHERE user_id = target_user_id AND state = 'active';
    
    FOR session_record IN 
      SELECT id, nas_ip_address, nas_port_id, session_id
      FROM radius_sessions 
      WHERE user_id = target_user_id AND state = 'expired' AND stop_time >= now() - INTERVAL '1 minute'
    LOOP
      INSERT INTO radius_coa_requests (session_id, request_type, attributes, nas_ip_address, nas_port_id)
      VALUES (session_record.id, 'disconnect', jsonb_build_object('reason', 'quota_exceeded'), session_record.nas_ip_address, session_record.nas_port_id);
    END LOOP;
  END IF;
END;
$function$;