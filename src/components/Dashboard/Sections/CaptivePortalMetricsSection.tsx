
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPortalStatistics, getWifiUsers, getWifiSessions } from '@/services/captivePortalService';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  Timer,
  VideoIcon,
  FileCheck,
  Gamepad2,
  UserPlus
} from "lucide-react";

const MetricCard = ({ title, value, icon, isLoading }) => {
  return (
    <div className="dashboard-card">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CaptivePortalMetricsSection = () => {
  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['portalMetrics'],
    queryFn: async () => {
      const stats = await getPortalStatistics();
      return stats[stats.length - 1] || {
        total_connections: 0,
        video_views: 0,
        quiz_completions: 0,
        games_played: 0,
        leads_collected: 0
      };
    }
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['totalUsers'],
    queryFn: async () => {
      const { count } = await getWifiUsers(1, 0);
      return { count };
    }
  });

  const { data: sessionsData, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['activeSessions'],
    queryFn: async () => {
      const { count } = await getWifiSessions(1, 0);
      return { count };
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Utilisateurs totaux"
        value={usersData?.count || 0}
        icon={<Users className="h-6 w-6" />}
        isLoading={isLoadingUsers}
      />
      <MetricCard
        title="Sessions actives"
        value={sessionsData?.count || 0}
        icon={<Timer className="h-6 w-6" />}
        isLoading={isLoadingSessions}
      />
      <MetricCard
        title="Vues de vidéos"
        value={statistics?.video_views || 0}
        icon={<VideoIcon className="h-6 w-6" />}
        isLoading={isLoadingStats}
      />
      <MetricCard
        title="Quiz complétés"
        value={statistics?.quiz_completions || 0}
        icon={<FileCheck className="h-6 w-6" />}
        isLoading={isLoadingStats}
      />
      <MetricCard
        title="Jeux joués"
        value={statistics?.games_played || 0}
        icon={<Gamepad2 className="h-6 w-6" />}
        isLoading={isLoadingStats}
      />
      <MetricCard
        title="Leads collectés"
        value={statistics?.leads_collected || 0}
        icon={<UserPlus className="h-6 w-6" />}
        isLoading={isLoadingStats}
      />
    </div>
  );
};

export default CaptivePortalMetricsSection;
