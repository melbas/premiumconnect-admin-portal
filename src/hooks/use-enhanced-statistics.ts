
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StatisticsProvider } from '@/services/portal/statisticsProvider';
import { PortalStatistics, MetricTrend, StatisticField } from '@/types/portal';
import { format, subDays } from 'date-fns';

export const useEnhancedStatistics = (days = 30) => {
  const [isRealtime, setIsRealtime] = useState(false);
  const queryClient = useQueryClient();

  const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
  
  // Main statistics query using the provider
  const { data: statistics, isLoading, error, refetch } = useQuery({
    queryKey: ['enhanced-portal-statistics', startDate],
    queryFn: () => StatisticsProvider.getPortalStatistics(startDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Today's statistics with more frequent updates
  const { data: todayStats, isLoading: isTodayLoading } = useQuery({
    queryKey: ['today-statistics'],
    queryFn: () => StatisticsProvider.getTodayStatistics(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  // System health monitoring
  const { data: systemHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => StatisticsProvider.getSystemHealth(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
  });

  // Initialize real-time updates
  useEffect(() => {
    const handleRealtimeUpdate = (updatedData: PortalStatistics) => {
      console.log('Real-time update received, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['enhanced-portal-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['today-statistics'] });
      setIsRealtime(true);
    };

    StatisticsProvider.initializeRealtime(handleRealtimeUpdate);

    return () => {
      StatisticsProvider.cleanup();
      setIsRealtime(false);
    };
  }, [queryClient]);

  // Get metric trend with caching
  const getMetricTrend = useCallback(async (metric: StatisticField, trendDays = 30): Promise<MetricTrend> => {
    return StatisticsProvider.getMetricTrend(metric, trendDays);
  }, []);

  // Increment statistic with optimistic update
  const incrementStatistic = useCallback(async (field: StatisticField, amount = 1): Promise<boolean> => {
    const success = await StatisticsProvider.incrementStatistic(field, amount);
    if (success) {
      // Trigger immediate refresh of today's stats
      queryClient.invalidateQueries({ queryKey: ['today-statistics'] });
    }
    return success;
  }, [queryClient]);

  // Force refresh all data
  const forceRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['enhanced-portal-statistics'] });
    queryClient.invalidateQueries({ queryKey: ['today-statistics'] });
    queryClient.invalidateQueries({ queryKey: ['system-health'] });
    refetch();
  }, [queryClient, refetch]);

  return {
    statistics: statistics || [],
    todayStats,
    systemHealth,
    isLoading: isLoading || isTodayLoading,
    error,
    isRealtime,
    getMetricTrend,
    incrementStatistic,
    forceRefresh,
  };
};
