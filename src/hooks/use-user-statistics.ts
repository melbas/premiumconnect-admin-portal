
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatisticsService } from '@/services/portal/statisticsService';
import { format, subDays } from 'date-fns';

export const useUserStatistics = (days = 30) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Connexions',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: 'rgba(59, 130, 246, 1)',
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: '#ffffff',
      },
    ],
  });

  const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
  
  const { data: statistics, isLoading, error } = useQuery({
    queryKey: ['portalStatistics', startDate],
    queryFn: () => StatisticsService.getPortalStatistics(startDate),
  });

  useEffect(() => {
    if (!statistics) return;

    const labels = statistics.map((stat) => {
      const date = new Date(stat.date);
      return format(date, 'dd/MM');
    });

    const connectionData = statistics.map((stat) => stat.total_connections || 0);

    setChartData({
      labels,
      datasets: [
        {
          ...chartData.datasets[0],
          data: connectionData,
        },
      ],
    });
  }, [statistics]);

  return { chartData, isLoading, error };
};
