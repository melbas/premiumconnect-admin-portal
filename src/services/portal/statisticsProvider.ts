
import { PortalStatistics, MetricTrend, StatisticField } from "@/types/portal";
import { UnifiedStatisticsService } from "./unifiedStatisticsService";
import { MockStatisticsService } from "./mockStatisticsService";

export class StatisticsProvider {
  private static get service() {
    return UnifiedStatisticsService;
  }

  static async getPortalStatistics(startDate?: string, endDate?: string): Promise<PortalStatistics[]> {
    try {
      return await this.service.getPortalStatistics(startDate, endDate);
    } catch (error) {
      console.error('Statistics provider error, falling back to mock data:', error);
      return await MockStatisticsService.getPortalStatistics(startDate, endDate);
    }
  }

  static async incrementStatistic(field: StatisticField, amount = 1): Promise<boolean> {
    try {
      return await this.service.incrementStatistic(field, amount);
    } catch (error) {
      console.error('Increment statistic error, using mock:', error);
      return await MockStatisticsService.incrementStatistic(field, amount);
    }
  }

  static async getMetricTrend(metric: StatisticField, days = 30): Promise<MetricTrend> {
    try {
      return await this.service.getMetricTrend(metric, days);
    } catch (error) {
      console.error('Metric trend error, using mock:', error);
      return await MockStatisticsService.getMetricTrend(metric, days);
    }
  }

  static async getTodayStatistics(): Promise<PortalStatistics> {
    try {
      return await this.service.getTodayStatistics();
    } catch (error) {
      console.error('Today statistics error, using mock:', error);
      return await MockStatisticsService.getTodayStatistics();
    }
  }

  static async getAggregatedUserStats(days = 30) {
    try {
      return await this.service.getAggregatedUserStats(days);
    } catch (error) {
      console.error('Aggregated user stats error, using mock:', error);
      return await MockStatisticsService.getAggregatedUserStats(days);
    }
  }

  static async getSystemHealth() {
    try {
      return await this.service.getSystemHealth();
    } catch (error) {
      console.error('System health error, using mock:', error);
      return await MockStatisticsService.getSystemHealth();
    }
  }

  static initializeRealtime(onUpdate?: (data: PortalStatistics) => void): void {
    this.service.initializeRealtime(onUpdate);
  }

  static cleanup(): void {
    this.service.cleanup();
  }
}
