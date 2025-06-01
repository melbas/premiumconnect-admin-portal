
// Re-export services for backward compatibility
export { StatisticsProvider as StatisticsService } from './portal/statisticsProvider';
export { UsersService } from './portal/usersService';
export { SessionsService } from './portal/sessionsService';

// Re-export types
export type { PortalStatistics, WiFiUser, WiFiSession, MetricTrend, StatisticField } from '@/types/portal';

// Legacy function exports for backward compatibility
import { StatisticsProvider } from './portal/statisticsProvider';
import { UsersService } from './portal/usersService';
import { SessionsService } from './portal/sessionsService';

export const getWifiUsers = UsersService.getWifiUsers.bind(UsersService);
export const getWifiSessions = SessionsService.getWifiSessions.bind(SessionsService);
export const getPortalStatistics = StatisticsProvider.getPortalStatistics.bind(StatisticsProvider);
export const incrementStatistic = StatisticsProvider.incrementStatistic.bind(StatisticsProvider);
export const getAggregatedUserStats = StatisticsProvider.getAggregatedUserStats.bind(StatisticsProvider);
export const getMetricTrend = StatisticsProvider.getMetricTrend.bind(StatisticsProvider);
