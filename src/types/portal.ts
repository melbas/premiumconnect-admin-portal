
export interface PortalStatistics {
  id: string;
  date: string;
  total_connections: number;
  video_views: number;
  quiz_completions: number;
  games_played: number;
  leads_collected: number;
  avg_session_duration: number;
  game_completion_rate: number;
  conversion_rate: number;
  returning_users: number;
}

export interface WiFiUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  mac_address?: string;
  created_at: string;
  last_connection: string;
  loyalty_points: number;
  family_id?: string;
  family_role?: string;
  auth_method: string;
  referral_code?: string;
  preferences?: any;
}

export interface WiFiSession {
  id: string;
  user_id?: string;
  started_at: string;
  duration_minutes: number;
  is_active: boolean;
  engagement_data?: any;
  plan_id?: string;
  transaction_id?: string;
  device_info?: any;
  engagement_type?: string;
}

export interface MetricTrend {
  data: Array<{ date: string; value: number }>;
  trend: number;
  firstValue: number;
  lastValue: number;
}

export type StatisticField = keyof Omit<PortalStatistics, 'id' | 'date'>;
