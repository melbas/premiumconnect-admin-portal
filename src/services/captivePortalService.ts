
import { supabase } from "@/integrations/supabase/client";

// Authentification
export const getAuthConfig = async () => {
  const { data, error } = await supabase.from('auth_config').select('*').single();
  
  if (error) {
    console.error("Error fetching auth config:", error);
    return null;
  }
  
  return data;
};

// Statistiques du portail
export const getPortalStatistics = async (startDate?: string, endDate?: string) => {
  let query = supabase.from('portal_statistics').select('*');
  
  if (startDate) {
    query = query.gte('date', startDate);
  }
  
  if (endDate) {
    query = query.lte('date', endDate);
  }
  
  const { data, error } = await query.order('date', { ascending: true });
  
  if (error) {
    console.error("Error fetching portal statistics:", error);
    return [];
  }
  
  return data;
};

// Utilisateurs WiFi
export const getWifiUsers = async (limit = 10, offset = 0) => {
  const { data, error, count } = await supabase
    .from('wifi_users')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error("Error fetching WiFi users:", error);
    return { users: [], count: 0 };
  }
  
  return { users: data, count };
};

// Sessions WiFi
export const getWifiSessions = async (limit = 10, offset = 0, userId?: string) => {
  let query = supabase.from('wifi_sessions').select('*, wifi_users!inner(*)');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error, count } = await query
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error("Error fetching WiFi sessions:", error);
    return { sessions: [], count: 0 };
  }
  
  return { sessions: data, count };
};

// Vidéos publicitaires
export const getAdVideos = async () => {
  const { data, error } = await supabase
    .from('ad_videos')
    .select('*')
    .order('priority', { ascending: false });
  
  if (error) {
    console.error("Error fetching ad videos:", error);
    return [];
  }
  
  return data;
};

// Quiz marketing
export const getQuizzes = async (includeQuestions = false) => {
  let query = supabase.from('quizzes').select('*');
  
  if (includeQuestions) {
    query = supabase.from('quizzes').select(`
      *,
      quiz_questions(
        *,
        quiz_options(*)
      )
    `);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
  
  return data;
};

// Mini-jeux
export const getGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching games:", error);
    return [];
  }
  
  return data;
};

// Niveaux de fidélité
export const getLoyaltyLevels = async () => {
  const { data, error } = await supabase
    .from('loyalty_levels')
    .select('*')
    .order('min_points', { ascending: true });
  
  if (error) {
    console.error("Error fetching loyalty levels:", error);
    return [];
  }
  
  return data;
};

// Récompenses
export const getRewards = async () => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .order('points_cost', { ascending: true });
  
  if (error) {
    console.error("Error fetching rewards:", error);
    return [];
  }
  
  return data;
};

// Forfaits WiFi
export const getWifiPlans = async () => {
  const { data, error } = await supabase
    .from('wifi_plans')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) {
    console.error("Error fetching WiFi plans:", error);
    return [];
  }
  
  return data;
};

// Méthodes de paiement
export const getPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*');
  
  if (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }
  
  return data;
};

// Transactions
export const getTransactions = async (limit = 10, offset = 0, userId?: string) => {
  let query = supabase.from('transactions').select(`
    *,
    wifi_users(*),
    wifi_plans(*),
    payment_methods(*)
  `);
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error("Error fetching transactions:", error);
    return { transactions: [], count: 0 };
  }
  
  return { transactions: data, count };
};

// Configuration du portail
export const getPortalConfig = async () => {
  const { data, error } = await supabase.from('portal_config').select('*').single();
  
  if (error) {
    console.error("Error fetching portal config:", error);
    return null;
  }
  
  return data;
};
