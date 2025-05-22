import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Keep existing types and interfaces

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

// Get WiFi users with optional limit
export async function getWifiUsers(limit = 10) {
  try {
    const { data: users, error } = await supabase
      .from('wifi_users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching WiFi users:', error);
      return { users: [], count: 0 };
    }

    const { count, error: countError } = await supabase
      .from('wifi_users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting WiFi users:', countError);
    }

    return { users: users || [], count: count || 0 };
  } catch (error) {
    console.error('Failed to fetch WiFi users:', error);
    return { users: [], count: 0 };
  }
}

// Get portal statistics for a specified date range
export async function getPortalStatistics(startDate?: string, endDate?: string) {
  try {
    let query = supabase
      .from('portal_statistics')
      .select('*')
      .order('date', { ascending: true });
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching portal statistics:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch portal statistics:', error);
    return [];
  }
}

// Increment a specific statistic for today
export async function incrementStatistic(field: keyof PortalStatistics, amount = 1) {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Try to get today's record
    const { data: todayData, error: fetchError } = await supabase
      .from('portal_statistics')
      .select('*')
      .eq('date', today)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching today statistics:', fetchError);
      return false;
    }
    
    if (todayData) {
      // Update existing record
      const updateValue = typeof todayData[field] === 'number' 
        ? (todayData[field] as number) + amount 
        : amount;
      
      const { error: updateError } = await supabase
        .from('portal_statistics')
        .update({ [field]: updateValue })
        .eq('id', todayData.id);
      
      if (updateError) {
        console.error('Error updating statistic:', updateError);
        return false;
      }
    } else {
      // Create new record for today
      const { error: insertError } = await supabase
        .from('portal_statistics')
        .insert({ date: today, [field]: amount });
      
      if (insertError) {
        console.error('Error creating statistic:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to increment statistic:', error);
    return false;
  }
}

// Get aggregated user statistics
export async function getAggregatedUserStats(days = 30) {
  try {
    const { data, error } = await supabase.rpc('get_user_stats', { days_back: days });
    
    if (error) {
      console.error('Error getting aggregated user stats:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get aggregated user stats:', error);
    return null;
  }
}

// Get trends for a specific metric
export async function getMetricTrend(metric: keyof PortalStatistics, days = 30) {
  const startDate = format(new Date(Date.now() - days * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  const statistics = await getPortalStatistics(startDate);
  
  // Calculate trend
  if (statistics.length > 1) {
    const firstValue = statistics[0][metric] as number || 0;
    const lastValue = statistics[statistics.length - 1][metric] as number || 0;
    const trend = firstValue === 0 ? 100 : ((lastValue - firstValue) / firstValue) * 100;
    
    return {
      data: statistics.map(stat => ({
        date: stat.date,
        value: stat[metric]
      })),
      trend,
      firstValue,
      lastValue
    };
  }
  
  return {
    data: statistics.map(stat => ({
      date: stat.date,
      value: stat[metric]
    })),
    trend: 0,
    firstValue: 0,
    lastValue: 0
  };
}
