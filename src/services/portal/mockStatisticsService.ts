
import { format, subDays } from "date-fns";
import { PortalStatistics, MetricTrend, StatisticField } from "@/types/portal";

// Mock data generator for development and testing
export class MockStatisticsService {
  private static generateRandomData(days: number): PortalStatistics[] {
    const data: PortalStatistics[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const baseValue = Math.floor(Math.random() * 100) + 50;
      
      data.push({
        id: `mock-${date}`,
        date,
        total_connections: baseValue + Math.floor(Math.random() * 200),
        video_views: Math.floor(baseValue * 0.7) + Math.floor(Math.random() * 50),
        quiz_completions: Math.floor(baseValue * 0.3) + Math.floor(Math.random() * 30),
        games_played: Math.floor(baseValue * 0.4) + Math.floor(Math.random() * 40),
        leads_collected: Math.floor(baseValue * 0.2) + Math.floor(Math.random() * 20),
        avg_session_duration: 5 + Math.random() * 15,
        game_completion_rate: 0.6 + Math.random() * 0.3,
        conversion_rate: 0.05 + Math.random() * 0.15,
        returning_users: Math.floor(baseValue * 0.25) + Math.floor(Math.random() * 25),
      });
    }
    
    return data;
  }

  static async getPortalStatistics(startDate?: string, endDate?: string): Promise<PortalStatistics[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    const days = startDate ? 30 : 7;
    return this.generateRandomData(days);
  }

  static async incrementStatistic(field: StatisticField, amount = 1): Promise<boolean> {
    console.log(`[MOCK] Incrementing ${field} by ${amount}`);
    await new Promise(resolve => setTimeout(resolve, 50));
    return true;
  }

  static async getMetricTrend(metric: StatisticField, days = 30): Promise<MetricTrend> {
    const statistics = await this.getPortalStatistics();
    
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
      data: [],
      trend: 0,
      firstValue: 0,
      lastValue: 0
    };
  }

  static async getTodayStatistics(): Promise<PortalStatistics> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const baseValue = Math.floor(Math.random() * 100) + 50;
    
    return {
      id: `mock-today`,
      date: today,
      total_connections: baseValue + Math.floor(Math.random() * 200),
      video_views: Math.floor(baseValue * 0.7) + Math.floor(Math.random() * 50),
      quiz_completions: Math.floor(baseValue * 0.3) + Math.floor(Math.random() * 30),
      games_played: Math.floor(baseValue * 0.4) + Math.floor(Math.random() * 40),
      leads_collected: Math.floor(baseValue * 0.2) + Math.floor(Math.random() * 20),
      avg_session_duration: 5 + Math.random() * 15,
      game_completion_rate: 0.6 + Math.random() * 0.3,
      conversion_rate: 0.05 + Math.random() * 0.15,
      returning_users: Math.floor(baseValue * 0.25) + Math.floor(Math.random() * 25),
    };
  }

  static async getAggregatedUserStats(days = 30) {
    return {
      total_users: 1250 + Math.floor(Math.random() * 500),
      active_users: 890 + Math.floor(Math.random() * 200),
      new_users: 45 + Math.floor(Math.random() * 50),
      retention_rate: 0.65 + Math.random() * 0.25
    };
  }

  static async getSystemHealth() {
    return {
      cacheHitRate: 0.85 + Math.random() * 0.1,
      lastUpdateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      realtimeConnected: Math.random() > 0.2,
      dataFreshness: Math.random() > 0.1 ? 'fresh' as const : 'stale' as const
    };
  }

  // Safe helper function for getting metric values
  private static getMetricValue(stat: PortalStatistics, field: StatisticField): number {
    try {
      // Use type assertion to bypass TypeScript issues temporarily
      const value = (stat as any)[field];
      return typeof value === 'number' ? value : 0;
    } catch (error) {
      console.warn(`Error accessing field ${field}:`, error);
      return 0;
    }
  }
}
