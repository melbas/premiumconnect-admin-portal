
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CachedStatistics {
  data: any;
  lastFetch: Date;
  isStale: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const statisticsCache = new Map<string, CachedStatistics>();

export const useOptimizedStatistics = (siteId?: string) => {
  const [localCache, setLocalCache] = useState<any>(null);

  const cacheKey = `stats_${siteId || 'global'}`;

  const fetchStatistics = useCallback(async () => {
    // Vérifier le cache local d'abord
    const cached = statisticsCache.get(cacheKey);
    if (cached && !cached.isStale) {
      return cached.data;
    }

    // Simuler un appel API optimisé
    const response = await new Promise(resolve => 
      setTimeout(() => resolve({
        totalConnections: Math.floor(Math.random() * 10000),
        activeUsers: Math.floor(Math.random() * 500),
        revenue: Math.floor(Math.random() * 50000),
        conversionRate: Math.random() * 100,
        lastUpdated: new Date()
      }), 300)
    );

    // Mettre à jour le cache
    statisticsCache.set(cacheKey, {
      data: response,
      lastFetch: new Date(),
      isStale: false
    });

    // Marquer comme périmé après la durée de cache
    setTimeout(() => {
      const cached = statisticsCache.get(cacheKey);
      if (cached) {
        cached.isStale = true;
      }
    }, CACHE_DURATION);

    return response;
  }, [cacheKey]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['statistics', siteId],
    queryFn: fetchStatistics,
    staleTime: CACHE_DURATION,
    cacheTime: CACHE_DURATION * 2,
    refetchOnWindowFocus: false,
    refetchInterval: CACHE_DURATION
  });

  // Précharger les données du cache si disponibles
  useEffect(() => {
    const cached = statisticsCache.get(cacheKey);
    if (cached && !localCache) {
      setLocalCache(cached.data);
    }
  }, [cacheKey, localCache]);

  return {
    data: data || localCache,
    isLoading,
    error,
    refetch,
    isCached: !!localCache
  };
};
