
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PortalStatistics, MetricTrend, StatisticField } from "@/types/portal";

export class StatisticsService {
  // Get portal statistics for a specified date range
  static async getPortalStatistics(startDate?: string, endDate?: string): Promise<PortalStatistics[]> {
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
  static async incrementStatistic(field: StatisticField, amount = 1): Promise<boolean> {
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
        const currentValue = StatisticsService.getMetricValue(todayData, field);
        const updateValue = currentValue + amount;
        
        const updateData = StatisticsService.createUpdateData(field, updateValue);
        
        const { error: updateError } = await supabase
          .from('portal_statistics')
          .update(updateData)
          .eq('id', todayData.id);
        
        if (updateError) {
          console.error('Error updating statistic:', updateError);
          return false;
        }
      } else {
        // Create new record for today
        const insertData = StatisticsService.createInsertData(field, amount, today);
        
        const { error: insertError } = await supabase
          .from('portal_statistics')
          .insert(insertData);
        
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

  // Get trends for a specific metric
  static async getMetricTrend(metric: StatisticField, days = 30): Promise<MetricTrend> {
    const startDate = format(new Date(Date.now() - days * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    const statistics = await StatisticsService.getPortalStatistics(startDate);
    
    // Calculate trend
    if (statistics.length > 1) {
      const firstValue = StatisticsService.getMetricValue(statistics[0], metric);
      const lastValue = StatisticsService.getMetricValue(statistics[statistics.length - 1], metric);
      const trend = firstValue === 0 ? 100 : ((lastValue - firstValue) / firstValue) * 100;
      
      return {
        data: statistics.map(stat => ({
          date: stat.date,
          value: StatisticsService.getMetricValue(stat, metric)
        })),
        trend,
        firstValue,
        lastValue
      };
    }
    
    return {
      data: statistics.map(stat => ({
        date: stat.date,
        value: StatisticsService.getMetricValue(stat, metric)
      })),
      trend: 0,
      firstValue: 0,
      lastValue: 0
    };
  }

  // Get aggregated user statistics
  static async getAggregatedUserStats(days = 30) {
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

  // Type-safe helper function for getting metric values
  private static getMetricValue(stat: PortalStatistics, field: StatisticField): number {
    if (!stat || typeof stat !== 'object') return 0;
    
    const fieldMap: Record<StatisticField, keyof PortalStatistics> = {
      'total_connections': 'total_connections',
      'video_views': 'video_views', 
      'quiz_completions': 'quiz_completions',
      'games_played': 'games_played',
      'leads_collected': 'leads_collected',
      'avg_session_duration': 'avg_session_duration',
      'game_completion_rate': 'game_completion_rate',
      'conversion_rate': 'conversion_rate',
      'returning_users': 'returning_users'
    };
    
    const mappedField = fieldMap[field];
    const value = stat[mappedField];
    return typeof value === 'number' ? value : 0;
  }

  // Type-safe helper function for creating update data
  private static createUpdateData(field: StatisticField, value: number): Partial<PortalStatistics> {
    switch (field) {
      case 'total_connections':
        return { total_connections: value };
      case 'video_views':
        return { video_views: value };
      case 'quiz_completions':
        return { quiz_completions: value };
      case 'games_played':
        return { games_played: value };
      case 'leads_collected':
        return { leads_collected: value };
      case 'avg_session_duration':
        return { avg_session_duration: value };
      case 'game_completion_rate':
        return { game_completion_rate: value };
      case 'conversion_rate':
        return { conversion_rate: value };
      case 'returning_users':
        return { returning_users: value };
      default:
        console.warn(`Unknown field: ${field}`);
        return {};
    }
  }

  // Type-safe helper function for creating insert data
  private static createInsertData(field: StatisticField, value: number, date: string): Partial<PortalStatistics> {
    const baseData = { date };
    switch (field) {
      case 'total_connections':
        return { ...baseData, total_connections: value };
      case 'video_views':
        return { ...baseData, video_views: value };
      case 'quiz_completions':
        return { ...baseData, quiz_completions: value };
      case 'games_played':
        return { ...baseData, games_played: value };
      case 'leads_collected':
        return { ...baseData, leads_collected: value };
      case 'avg_session_duration':
        return { ...baseData, avg_session_duration: value };
      case 'game_completion_rate':
        return { ...baseData, game_completion_rate: value };
      case 'conversion_rate':
        return { ...baseData, conversion_rate: value };
      case 'returning_users':
        return { ...baseData, returning_users: value };
      default:
        console.warn(`Unknown field: ${field}`);
        return baseData;
    }
  }
}
