
import { format, subDays } from "date-fns";
import { PortalStatistics, MetricTrend, StatisticField } from "@/types/portal";
import { MockStatisticsService } from "./mockStatisticsService";

// Configuration simple - utiliser mock data par défaut
const USE_REAL_DATA = false;

// Default data structure
const createDefaultStats = (date: string): PortalStatistics => ({
  id: `unified-${date}`,
  date,
  total_connections: 0,
  video_views: 0,
  quiz_completions: 0,
  games_played: 0,
  leads_collected: 0,
  avg_session_duration: 0,
  game_completion_rate: 0,
  conversion_rate: 0,
  returning_users: 0,
});

// Type-safe field accessors
const FIELD_ACCESSORS = {
  total_connections: (stat: PortalStatistics) => stat.total_connections || 0,
  video_views: (stat: PortalStatistics) => stat.video_views || 0,
  quiz_completions: (stat: PortalStatistics) => stat.quiz_completions || 0,
  games_played: (stat: PortalStatistics) => stat.games_played || 0,
  leads_collected: (stat: PortalStatistics) => stat.leads_collected || 0,
  avg_session_duration: (stat: PortalStatistics) => stat.avg_session_duration || 0,
  game_completion_rate: (stat: PortalStatistics) => stat.game_completion_rate || 0,
  conversion_rate: (stat: PortalStatistics) => stat.conversion_rate || 0,
  returning_users: (stat: PortalStatistics) => stat.returning_users || 0,
} as const;

export class UnifiedStatisticsService {
  // Get portal statistics with simple fallback
  static async getPortalStatistics(startDate?: string, endDate?: string): Promise<PortalStatistics[]> {
    try {
      if (USE_REAL_DATA) {
        // Ici on pourrait implémenter la vraie logique Supabase plus tard
        console.log('Real data not implemented yet, using mock data');
      }
      
      return await MockStatisticsService.getPortalStatistics(startDate, endDate);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return [];
    }
  }

  // Increment statistic with simple implementation
  static async incrementStatistic(field: StatisticField, amount = 1): Promise<boolean> {
    try {
      if (USE_REAL_DATA) {
        console.log('Real increment not implemented yet, using mock');
      }
      
      return await MockStatisticsService.incrementStatistic(field, amount);
    } catch (error) {
      console.error('Error incrementing statistic:', error);
      return false;
    }
  }

  // Get metric trends with type-safe approach
  static async getMetricTrend(metric: StatisticField, days = 30): Promise<MetricTrend> {
    try {
      const statistics = await this.getPortalStatistics();
      
      if (statistics.length === 0) {
        return {
          data: [],
          trend: 0,
          firstValue: 0,
          lastValue: 0
        };
      }

      // Use type-safe accessor
      const accessor = FIELD_ACCESSORS[metric];
      const data = statistics.map(stat => ({
        date: stat.date,
        value: accessor(stat)
      }));

      if (data.length > 1) {
        const firstValue = data[0].value;
        const lastValue = data[data.length - 1].value;
        const trend = firstValue === 0 ? 100 : ((lastValue - firstValue) / firstValue) * 100;
        
        return {
          data,
          trend,
          firstValue,
          lastValue
        };
      }

      return {
        data,
        trend: 0,
        firstValue: data[0]?.value || 0,
        lastValue: data[0]?.value || 0
      };
    } catch (error) {
      console.error('Error getting metric trend:', error);
      return {
        data: [],
        trend: 0,
        firstValue: 0,
        lastValue: 0
      };
    }
  }

  // Get today's statistics
  static async getTodayStatistics(): Promise<PortalStatistics> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      if (USE_REAL_DATA) {
        console.log('Real today stats not implemented yet, using mock');
      }
      
      return await MockStatisticsService.getTodayStatistics();
    } catch (error) {
      console.error('Error getting today statistics:', error);
      return createDefaultStats(format(new Date(), 'yyyy-MM-dd'));
    }
  }

  // Get aggregated user stats
  static async getAggregatedUserStats(days = 30) {
    try {
      return await MockStatisticsService.getAggregatedUserStats(days);
    } catch (error) {
      console.error('Error getting aggregated user stats:', error);
      return {
        total_users: 0,
        active_users: 0,
        new_users: 0,
        retention_rate: 0
      };
    }
  }

  // Get system health
  static async getSystemHealth() {
    try {
      return await MockStatisticsService.getSystemHealth();
    } catch (error) {
      console.error('Error getting system health:', error);
      return {
        cacheHitRate: 0,
        lastUpdateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        realtimeConnected: false,
        dataFreshness: 'offline' as const
      };
    }
  }

  // Placeholder methods for compatibility
  static initializeRealtime(onUpdate?: (data: PortalStatistics) => void): void {
    console.log('[UNIFIED] Real-time not implemented yet');
  }

  static cleanup(): void {
    console.log('[UNIFIED] Cleanup called');
  }
}
