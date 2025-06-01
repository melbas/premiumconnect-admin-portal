import React from "react";
import { useEnhancedStatistics } from "@/hooks/use-enhanced-statistics";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DevelopmentPanel from "../DevelopmentPanel";
import {
  Users,
  Timer,
  VideoIcon,
  FileCheck,
  Gamepad2,
  UserPlus,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle
} from "lucide-react";

interface SimpleMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading: boolean;
  onClick?: () => void;
}

const SimpleMetricCard = ({ title, value, icon, isLoading, onClick }: SimpleMetricCardProps) => {
  return (
    <div className="dashboard-card cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex items-center justify-between">
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
    </div>
  );
};

const SystemHealthIndicator = ({ systemHealth, isRealtime, onRefresh }) => {
  if (!systemHealth) return null;

  const getHealthColor = (freshness: string) => {
    switch (freshness) {
      case 'fresh': return 'bg-green-500';
      case 'stale': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isRealtime ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm font-medium">
              {isRealtime ? 'Temps réel actif' : 'Mode cache'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getHealthColor(systemHealth.dataFreshness)}`} />
            <span className="text-sm text-muted-foreground">
              Données {systemHealth.dataFreshness === 'fresh' ? 'à jour' : 'obsolètes'}
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
    </div>
  );
};

const EnhancedMetricsSection = () => {
  const {
    todayStats,
    systemHealth,
    isLoading,
    isRealtime,
    incrementStatistic,
    forceRefresh
  } = useEnhancedStatistics();

  const handleMetricClick = async (field: string) => {
    console.log(`Clicked on ${field} metric`);
    // Could implement drill-down functionality here
  };

  const handleTestIncrement = async (field: string) => {
    try {
      await incrementStatistic(field as any, 1);
      console.log(`Successfully incremented ${field}`);
    } catch (error) {
      console.error(`Failed to increment ${field}:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <DevelopmentPanel />
      
      <SystemHealthIndicator 
        systemHealth={systemHealth}
        isRealtime={isRealtime}
        onRefresh={forceRefresh}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SimpleMetricCard
          title="Connexions totales"
          value={todayStats?.total_connections || 0}
          icon={<Users className="h-6 w-6" />}
          isLoading={isLoading}
          onClick={() => handleMetricClick('total_connections')}
        />
        
        <SimpleMetricCard
          title="Vues de vidéos"
          value={todayStats?.video_views || 0}
          icon={<VideoIcon className="h-6 w-6" />}
          isLoading={isLoading}
          onClick={() => handleMetricClick('video_views')}
        />
        
        <SimpleMetricCard
          title="Quiz complétés"
          value={todayStats?.quiz_completions || 0}
          icon={<FileCheck className="h-6 w-6" />}
          isLoading={isLoading}
          onClick={() => handleMetricClick('quiz_completions')}
        />
        
        <SimpleMetricCard
          title="Jeux joués"
          value={todayStats?.games_played || 0}
          icon={<Gamepad2 className="h-6 w-6" />}
          isLoading={isLoading}
          onClick={() => handleMetricClick('games_played')}
        />
        
        <SimpleMetricCard
          title="Leads collectés"
          value={todayStats?.leads_collected || 0}
          icon={<UserPlus className="h-6 w-6" />}
          isLoading={isLoading}
          onClick={() => handleMetricClick('leads_collected')}
        />
        
        <SimpleMetricCard
          title="Durée moyenne (min)"
          value={Math.round(todayStats?.avg_session_duration || 0)}
          icon={<Timer className="h-6 w-6" />}
          isLoading={isLoading}
          onClick={() => handleMetricClick('avg_session_duration')}
        />
      </div>

      {/* Development testing buttons */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 w-full mb-2">Tests d'incrémentation :</p>
        <Button size="sm" variant="outline" onClick={() => handleTestIncrement('total_connections')}>
          +1 Connexion
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleTestIncrement('video_views')}>
          +1 Vidéo
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleTestIncrement('quiz_completions')}>
          +1 Quiz
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleTestIncrement('games_played')}>
          +1 Jeu
        </Button>
      </div>
    </div>
  );
};

export default EnhancedMetricsSection;
