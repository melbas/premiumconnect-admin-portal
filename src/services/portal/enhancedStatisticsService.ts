import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { PortalStatistics, MetricTrend, StatisticField } from "@/types/portal";
import { CacheService } from "./cacheService";

// Default fallback data for when everything fails
const DEFAULT_STATISTICS: PortalStatistics = {
  id: "default",
  date: format(new Date(), 'yyyy-MM-dd'),
  total_connections: 0,
  video_views: 0,
  quiz_completions: 0,
  games_played: 0,
  leads_collected: 0,
  avg_session_duration: 0,
  game_completion_rate: 0,
  conversion_rate: 0,
  returning_users: 0,
};

const DEFAULT_TREND: MetricTrend = {
  data: [],
  trend: 0,
  firstValue: 0,
  lastValue: 0,
};

export class EnhancedStatisticsService {
  private static realtimeChannel: any = null;

  // Initialize real-time updates
  static initializeRealtime(onUpdate?: (data: PortalStatistics) => void): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
    }

    this.realtimeChannel = supabase
      .channel('portal_statistics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portal_statistics'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Clear relevant cache entries
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            this.invalidateCache();
            if (onUpdate && payload.new) {
              onUpdate(payload.new as PortalStatistics);
            }
          }
        }
      )
      .subscribe();
  }

  // Clean up real-time subscription
  static cleanup(): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }

  // Invalidate relevant cache entries
  private static invalidateCache(): void {
    const patterns = ['portal_statistics', 'metric_trend', 'user_stats'];
    patterns.forEach(pattern => {
      // This is a simple approach - in production you might want more sophisticated cache invalidation
      CacheService.clear();
    });
  }

  // Get portal statistics with intelligent caching
  static async getPortalStatistics(startDate?: string, endDate?: string): Promise<PortalStatistics[]> {
    const cacheKey = `portal_statistics_${startDate || 'all'}_${endDate || 'all'}`;
    
    return CacheService.withCache(
      cacheKey,
      async () => {
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
          throw error;
        }

        return data || [];
      },
      5 * 60 * 1000, // 5 minutes TTL
      [] // Fallback to empty array
    );
  }

  // Increment statistic with optimistic updates
  static async incrementStatistic(field: StatisticField, amount = 1): Promise<boolean> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Optimistically update cache
      const cacheKey = `portal_statistics_${today}_${today}`;
      const cachedData = CacheService.get<PortalStatistics[]>(cacheKey);
      if (cachedData && cachedData.length > 0) {
        const updatedData = [...cachedData];
        const currentValue = this.getMetricValue(updatedData[0], field);
        (updatedData[0] as any)[field] = currentValue + amount;
        CacheService.set(cacheKey, updatedData, 5 * 60 * 1000);
      }

      // Perform actual database update
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
        const currentValue = this.getMetricValue(todayData, field);
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

  // Get metric trends with caching
  static async getMetricTrend(metric: StatisticField, days = 30): Promise<MetricTrend> {
    const cacheKey = `metric_trend_${metric}_${days}`;
    
    return CacheService.withCache(
      cacheKey,
      async () => {
        const startDate = format(new Date(Date.now() - days * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        const statistics = await this.getPortalStatistics(startDate);
        
        // Calculate trend
        if (statistics.length > 1) {
          const firstValue = this.getMetricValue(statistics[0], metric);
          const lastValue = this.getMetricValue(statistics[statistics.length - 1], metric);
          const trend = firstValue === 0 ? 100 : ((lastValue - firstValue) / firstValue) * 100;
          
          return {
            data: statistics.map(stat => ({
              date: stat.date,
              value: this.getMetricValue(stat, metric)
            })),
            trend,
            firstValue,
            lastValue
          };
        }
        
        return {
          data: statistics.map(stat => ({
            date: stat.date,
            value: this.getMetricValue(stat, metric)
          })),
          trend: 0,
          firstValue: 0,
          lastValue: 0
        };
      },
      10 * 60 * 1000, // 10 minutes TTL for trends
      DEFAULT_TREND
    );
  }

  // Get aggregated user stats with caching
  static async getAggregatedUserStats(days = 30) {
    const cacheKey = `user_stats_${days}`;
    
    return CacheService.withCache(
      cacheKey,
      async () => {
        const { data, error } = await supabase.rpc('get_user_stats', { days_back: days });
        
        if (error) {
          console.error('Error getting aggregated user stats:', error);
          throw error;
        }
        
        return data;
      },
      15 * 60 * 1000, // 15 minutes TTL
      null // Fallback to null
    );
  }

  // Get today's statistics with high-frequency updates
  static async getTodayStatistics(): Promise<PortalStatistics> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const cacheKey = `today_statistics_${today}`;
    
    return CacheService.withCache(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from('portal_statistics')
          .select('*')
          .eq('date', today)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching today statistics:', error);
          throw error;
        }
        
        return data || { ...DEFAULT_STATISTICS, date: today };
      },
      2 * 60 * 1000, // 2 minutes TTL for today's data
      { ...DEFAULT_STATISTICS, date: today }
    );
  }

  // Helper function to safely get metric value with proper typing
  private static getMetricValue(stat: PortalStatistics, field: StatisticField): number {
    if (!stat || typeof stat !== 'object') return 0;
    
    // Create a mapping to ensure type safety
    const fieldMap: Record<StatisticField, (stat: PortalStatistics) => number> = {
      total_connections: (s) => s.total_connections || 0,
      video_views: (s) => s.video_views || 0,
      quiz_completions: (s) => s.quiz_completions || 0,
      games_played: (s) => s.games_played || 0,
      leads_collected: (s) => s.leads_collected || 0,
      avg_session_duration: (s) => s.avg_session_duration || 0,
      game_completion_rate: (s) => s.game_completion_rate || 0,
      conversion_rate: (s) => s.conversion_rate || 0,
      returning_users: (s) => s.returning_users || 0,
    };
    
    const getter = fieldMap[field];
    return getter ? getter(stat) : 0;
  }

  // Get system health indicators
  static async getSystemHealth(): Promise<{
    cacheHitRate: number;
    lastUpdateTime: string;
    realtimeConnected: boolean;
    dataFreshness: 'fresh' | 'stale' | 'offline';
  }> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayStats = await this.getTodayStatistics();
    
    return {
      cacheHitRate: 0, // Would need to implement cache hit tracking
      lastUpdateTime: todayStats?.date || today,
      realtimeConnected: !!this.realtimeChannel,
      dataFreshness: todayStats?.date === today ? 'fresh' : 'stale'
    };
  }
}
