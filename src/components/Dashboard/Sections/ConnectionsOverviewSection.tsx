
import React from 'react';
import { useUserStatistics } from '@/hooks/use-user-statistics';
import { ChartComponent } from '../Chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { getWifiUsers } from '@/services/captivePortalService';

const ConnectionsOverviewSection = () => {
  const { chartData, isLoading: isLoadingStats } = useUserStatistics(30);
  
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['wifiUsers'],
    queryFn: () => getWifiUsers(5),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 dashboard-card">
        <h2 className="font-medium text-lg mb-4">Connexions mensuelles</h2>
        {isLoadingStats ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <ChartComponent type="line" data={chartData} height={300} />
        )}
      </div>
      
      <div className="dashboard-card">
        <h2 className="font-medium text-lg mb-4">Derniers utilisateurs</h2>
        {isLoadingUsers ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {usersData?.users.map((user) => (
              <div key={user.id} className="flex items-center p-3 border rounded-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-3">
                  <div className="font-medium">{user.name || 'Anonyme'}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email || user.phone || 'Pas de contact'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsOverviewSection;
