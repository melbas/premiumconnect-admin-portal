
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { MapProvider, InteractiveHeatmap } from '@/components/Maps';
import { mockWholesalers } from '@/stores/portal/mockData';

const UserActivityHeatmap: React.FC = () => {
  // Simuler le chargement des données
  const { data: sites, isLoading } = useQuery({
    queryKey: ['userActivitySites'],
    queryFn: async () => {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Retourner les sites des grossistes pour la heatmap
      return mockWholesalers.flatMap(w => w.sites);
    },
  });

  return (
    <div id="user-activity-heatmap" className="w-full h-full">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <MapProvider isDarkMode={document.documentElement.classList.contains('dark')}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Carte de Chaleur d'Activité</h3>
              <div className="text-sm text-muted-foreground">
                Activité par zone géographique
              </div>
            </div>
            <InteractiveHeatmap 
              sites={sites} 
              height={350}
              className="rounded-lg border"
            />
          </div>
        </MapProvider>
      )}
    </div>
  );
};

export default UserActivityHeatmap;
