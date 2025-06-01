
// Re-export services for backward compatibility
export { StatisticsService } from './portal/statisticsService';
export { UsersService } from './portal/usersService';
export { SessionsService } from './portal/sessionsService';

// Re-export types
export type { PortalStatistics, WiFiUser, WiFiSession, MetricTrend, StatisticField } from '@/types/portal';

// Legacy function exports for backward compatibility
import { StatisticsService } from './portal/statisticsService';
import { UsersService } from './portal/usersService';
import { SessionsService } from './portal/sessionsService';

export const getWifiUsers = UsersService.getWifiUsers.bind(UsersService);
export const getWifiSessions = SessionsService.getWifiSessions.bind(SessionsService);
export const getPortalStatistics = StatisticsService.getPortalStatistics.bind(StatisticsService);
export const incrementStatistic = StatisticsService.incrementStatistic.bind(StatisticsService);
export const getAggregatedUserStats = StatisticsService.getAggregatedUserStats.bind(StatisticsService);
export const getMetricTrend = StatisticsService.getMetricTrend.bind(StatisticsService);
