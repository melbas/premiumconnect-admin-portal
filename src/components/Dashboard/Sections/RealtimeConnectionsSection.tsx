
import React, { useEffect, useState } from 'react';
import { useEnhancedStatistics } from '@/hooks/use-enhanced-statistics';
import { ChartComponent } from '../Chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getWifiUsers } from '@/services/captivePortalService';
import { format } from 'date-fns';

const RealtimeConnectionsSection = () => {
  const { statistics, isLoading: isLoadingStats, isRealtime } = useEnhancedStatistics(30);
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
  
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['wifiUsers'],
    queryFn: () => getWifiUsers(5),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    if (!statistics) return;

    const labels = statistics.map((stat) => {
      const date = new Date(stat.date);
      return format(date, 'dd/MM');
    });

    const connectionData = statistics.map((stat) => stat.total_connections || 0);

    setChartData(prevData => ({
      ...prevData,
      labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: connectionData,
        },
      ],
    }));
  }, [statistics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-lg">Connexions mensuelles</h2>
          <div className="flex items-center space-x-2">
            {isRealtime && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Temps réel
              </Badge>
            )}
            <Badge variant="outline">
              {statistics?.length || 0} jours de données
            </Badge>
          </div>
        </div>
        {isLoadingStats ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <ChartComponent type="line" data={chartData} height={300} />
        )}
      </div>
      
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-lg">Derniers utilisateurs</h2>
          <Badge variant="outline">
            Actualisé auto
          </Badge>
        </div>
        {isLoadingUsers ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {usersData?.users?.map((user) => (
              <div key={user.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">{user.name || 'Anonyme'}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email || user.phone || 'Pas de contact'}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {format(new Date(user.last_connection), 'HH:mm')}
                </div>
              </div>
            ))}
            {(!usersData?.users || usersData.users.length === 0) && (
              <div className="text-center text-gray-500 py-8">
                Aucun utilisateur récent
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeConnectionsSection;
