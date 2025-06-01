
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
        
        const updateData: any = {};
        updateData[field] = updateValue;
        
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
        const insertData: any = {
          date: today,
        };
        insertData[field] = amount;
        
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
    
    try {
      // Type-safe mapping with explicit checks
      const fieldMap: Record<StatisticField, (stat: PortalStatistics) => number> = {
        'total_connections': (s) => s.total_connections || 0,
        'video_views': (s) => s.video_views || 0,
        'quiz_completions': (s) => s.quiz_completions || 0,
        'games_played': (s) => s.games_played || 0,
        'leads_collected': (s) => s.leads_collected || 0,
        'avg_session_duration': (s) => s.avg_session_duration || 0,
        'game_completion_rate': (s) => s.game_completion_rate || 0,
        'conversion_rate': (s) => s.conversion_rate || 0,
        'returning_users': (s) => s.returning_users || 0,
      };
      
      return fieldMap[field](stat);
    } catch (error) {
      console.warn(`Error accessing field ${field}:`, error);
      return 0;
    }
  }
}
