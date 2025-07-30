-- Phase 2 Sprint 1: Créer les tables NAC et RADIUS

-- Table des profils d'accès (VLAN, quotas, débits)
CREATE TABLE public.access_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  vlan_id INTEGER,
  max_down_kbps INTEGER NOT NULL DEFAULT 0,
  max_up_kbps INTEGER NOT NULL DEFAULT 0,
  quota_mb INTEGER, -- NULL = illimité
  quota_minutes INTEGER, -- NULL = illimité
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour tracker l'usage des quotas par utilisateur
CREATE TABLE public.user_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_id UUID NOT NULL REFERENCES public.access_profiles(id) ON DELETE CASCADE,
  quota_used_mb NUMERIC DEFAULT 0,
  minutes_used INTEGER DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_id)
);

-- Table des sessions avec métadonnées détaillées 
CREATE TABLE public.radius_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE, -- RADIUS Session-Id
  user_id UUID,
  username TEXT,
  mac_address TEXT,
  ip_address INET,
  nas_ip_address INET,
  nas_port_id TEXT,
  profile_id UUID REFERENCES public.access_profiles(id),
  vlan_id INTEGER,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  stop_time TIMESTAMP WITH TIME ZONE,
  rx_bytes BIGINT DEFAULT 0,
  tx_bytes BIGINT DEFAULT 0,
  rx_packets BIGINT DEFAULT 0,
  tx_packets BIGINT DEFAULT 0,
  session_time INTEGER DEFAULT 0, -- en secondes
  terminate_cause TEXT,
  state TEXT NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'stopped', 'expired')),
  ap_name TEXT,
  ssid TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des vouchers (codes d'accès)
CREATE TABLE public.vouchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  profile_id UUID NOT NULL REFERENCES public.access_profiles(id) ON DELETE CASCADE,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  use_limit INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE,
  CHECK (used_count <= use_limit)
);

-- Table pour les CoA (Change of Authorization) requests
CREATE TABLE public.radius_coa_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.radius_sessions(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('disconnect', 'coa')),
  attributes JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'ack', 'nak', 'timeout')),
  nas_ip_address INET NOT NULL,
  nas_port_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  response_at TIMESTAMP WITH TIME ZONE,
  response_code INTEGER,
  error_message TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.access_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radius_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radius_coa_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies pour accès admin uniquement sur les tables sensibles
CREATE POLICY "Admin access to access_profiles" ON public.access_profiles FOR ALL USING (true);
CREATE POLICY "Admin access to user_access" ON public.user_access FOR ALL USING (true);
CREATE POLICY "Admin access to radius_sessions" ON public.radius_sessions FOR ALL USING (true);
CREATE POLICY "Admin access to vouchers" ON public.vouchers FOR ALL USING (true);
CREATE POLICY "Admin access to radius_coa_requests" ON public.radius_coa_requests FOR ALL USING (true);

-- Index pour performance
CREATE INDEX idx_radius_sessions_session_id ON public.radius_sessions(session_id);
CREATE INDEX idx_radius_sessions_user_id ON public.radius_sessions(user_id);
CREATE INDEX idx_radius_sessions_state ON public.radius_sessions(state);
CREATE INDEX idx_radius_sessions_start_time ON public.radius_sessions(start_time);
CREATE INDEX idx_user_access_user_id ON public.user_access(user_id);
CREATE INDEX idx_vouchers_code ON public.vouchers(code);
CREATE INDEX idx_vouchers_active ON public.vouchers(is_active) WHERE is_active = true;

-- Vue pour les sessions actives (optimisée pour dashboard)
CREATE VIEW public.vw_active_sessions AS
SELECT 
  s.id,
  s.session_id,
  s.user_id,
  s.username,
  s.mac_address,
  s.ip_address,
  s.start_time,
  s.last_seen,
  s.rx_bytes,
  s.tx_bytes,
  s.session_time,
  s.ap_name,
  s.ssid,
  p.name as profile_name,
  p.max_down_kbps,
  p.max_up_kbps,
  p.quota_mb,
  ua.quota_used_mb,
  ua.minutes_used,
  CASE 
    WHEN p.quota_mb IS NOT NULL THEN 
      ROUND((ua.quota_used_mb::numeric / p.quota_mb::numeric * 100), 2)
    ELSE NULL 
  END as quota_usage_percent
FROM public.radius_sessions s
LEFT JOIN public.access_profiles p ON s.profile_id = p.id
LEFT JOIN public.user_access ua ON s.user_id = ua.user_id AND ua.profile_id = s.profile_id
WHERE s.state = 'active';

-- Fonction pour appliquer les quotas (optimisée)
CREATE OR REPLACE FUNCTION public.fn_apply_quota(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  session_record RECORD;
BEGIN
  -- Récupérer l'accès utilisateur avec le profil
  SELECT ua.*, ap.quota_mb, ap.quota_minutes, ap.name as profile_name
  INTO user_record
  FROM public.user_access ua
  JOIN public.access_profiles ap ON ua.profile_id = ap.id
  WHERE ua.user_id = target_user_id AND ap.is_active = true;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Vérifier si les quotas sont dépassés
  IF (user_record.quota_mb IS NOT NULL AND user_record.quota_used_mb >= user_record.quota_mb) OR
     (user_record.quota_minutes IS NOT NULL AND user_record.minutes_used >= user_record.quota_minutes) THEN
    
    -- Marquer les sessions actives comme expirées
    UPDATE public.radius_sessions 
    SET state = 'expired', 
        stop_time = now(),
        terminate_cause = 'quota_exceeded'
    WHERE user_id = target_user_id AND state = 'active';
    
    -- Créer les requêtes CoA pour déconnecter
    FOR session_record IN 
      SELECT id, nas_ip_address, nas_port_id, session_id
      FROM public.radius_sessions 
      WHERE user_id = target_user_id AND state = 'expired' AND stop_time >= now() - INTERVAL '1 minute'
    LOOP
      INSERT INTO public.radius_coa_requests (
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
$$;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_access_profiles_updated_at
  BEFORE UPDATE ON public.access_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_access_updated_at
  BEFORE UPDATE ON public.user_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_radius_sessions_updated_at
  BEFORE UPDATE ON public.radius_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer des profils d'accès par défaut
INSERT INTO public.access_profiles (name, description, vlan_id, max_down_kbps, max_up_kbps, quota_mb, quota_minutes, priority) VALUES
('Invité', 'Accès invité basique - 1h gratuite', 10, 2048, 512, 100, 60, 1),
('Premium', 'Accès premium - 24h illimité', 20, 10240, 2048, NULL, 1440, 2),
('Business', 'Accès professionnel - débit élevé', 30, 51200, 10240, NULL, NULL, 3),
('Étudiant', 'Tarif étudiant - 4h par jour', 40, 5120, 1024, 500, 240, 2);