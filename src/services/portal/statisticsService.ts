
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
        
        const updateData: Partial<PortalStatistics> = {
          [field]: updateValue
        } as Partial<PortalStatistics>;
        
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
        const insertData: Partial<PortalStatistics> = {
          date: today,
          [field]: amount
        } as Partial<PortalStatistics>;
        
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

  // Helper function to safely get metric value
  private static getMetricValue(stat: PortalStatistics, field: StatisticField): number {
    if (!stat || typeof stat !== 'object') return 0;
    
    // Use type assertion to access the field safely
    const value = (stat as Record<string, any>)[field];
    return typeof value === 'number' ? value : 0;
  }
}
