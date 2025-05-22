
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Minus, Users, Video, Gamepad2, FileCheck, UserPlus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  isLoading: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, isLoading }) => {
  const getTrendIcon = () => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
            {icon}
          </div>
          <div className={`flex items-center ${change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
            {getTrendIcon()}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface EngagementMetricsSectionProps {
  timeRange: number;
  statistics: any[];
  isLoading: boolean;
}

const EngagementMetricsSection: React.FC<EngagementMetricsSectionProps> = ({ 
  timeRange, 
  statistics,
  isLoading
}) => {
  // Calculate metrics and trends
  const calculateMetrics = () => {
    if (!statistics.length) {
      return {
        totalConnections: 0,
        videoViews: 0,
        gamesPlayed: 0,
        quizCompletions: 0,
        newUsers: 0,
        connectionsTrend: 0,
        viewsTrend: 0,
        gamesTrend: 0,
        quizTrend: 0,
        usersTrend: 0
      };
    }

    // Get today's values
    const latest = statistics[statistics.length - 1];
    
    // Get values from beginning of period
    const earliest = statistics[0];
    
    // Calculate totals
    const totalConnections = statistics.reduce((sum, stat) => sum + (stat.total_connections || 0), 0);
    const totalViews = statistics.reduce((sum, stat) => sum + (stat.video_views || 0), 0);
    const totalGamesPlayed = statistics.reduce((sum, stat) => sum + (stat.games_played || 0), 0);
    const totalQuizCompletions = statistics.reduce((sum, stat) => sum + (stat.quiz_completions || 0), 0);
    const totalNewUsers = statistics.reduce((sum, stat) => sum + (stat.leads_collected || 0), 0);
    
    // Calculate trends
    const midPoint = Math.floor(statistics.length / 2);
    const firstHalf = statistics.slice(0, midPoint);
    const secondHalf = statistics.slice(midPoint);
    
    const firstHalfConnections = firstHalf.reduce((sum, stat) => sum + (stat.total_connections || 0), 0);
    const secondHalfConnections = secondHalf.reduce((sum, stat) => sum + (stat.total_connections || 0), 0);
    
    const connectionsTrend = firstHalfConnections === 0 ? 0 : 
      Math.round(((secondHalfConnections - firstHalfConnections) / firstHalfConnections) * 100);
    
    // Calculate other trends using the same method
    const firstHalfViews = firstHalf.reduce((sum, stat) => sum + (stat.video_views || 0), 0);
    const secondHalfViews = secondHalf.reduce((sum, stat) => sum + (stat.video_views || 0), 0);
    const viewsTrend = firstHalfViews === 0 ? 0 : 
      Math.round(((secondHalfViews - firstHalfViews) / firstHalfViews) * 100);
    
    const firstHalfGames = firstHalf.reduce((sum, stat) => sum + (stat.games_played || 0), 0);
    const secondHalfGames = secondHalf.reduce((sum, stat) => sum + (stat.games_played || 0), 0);
    const gamesTrend = firstHalfGames === 0 ? 0 : 
      Math.round(((secondHalfGames - firstHalfGames) / firstHalfGames) * 100);
    
    const firstHalfQuiz = firstHalf.reduce((sum, stat) => sum + (stat.quiz_completions || 0), 0);
    const secondHalfQuiz = secondHalf.reduce((sum, stat) => sum + (stat.quiz_completions || 0), 0);
    const quizTrend = firstHalfQuiz === 0 ? 0 : 
      Math.round(((secondHalfQuiz - firstHalfQuiz) / firstHalfQuiz) * 100);
    
    const firstHalfUsers = firstHalf.reduce((sum, stat) => sum + (stat.leads_collected || 0), 0);
    const secondHalfUsers = secondHalf.reduce((sum, stat) => sum + (stat.leads_collected || 0), 0);
    const usersTrend = firstHalfUsers === 0 ? 0 : 
      Math.round(((secondHalfUsers - firstHalfUsers) / firstHalfUsers) * 100);
    
    return {
      totalConnections,
      videoViews: totalViews,
      gamesPlayed: totalGamesPlayed,
      quizCompletions: totalQuizCompletions,
      newUsers: totalNewUsers,
      connectionsTrend,
      viewsTrend,
      gamesTrend,
      quizTrend,
      usersTrend
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      <MetricCard
        title="Connexions"
        value={metrics.totalConnections.toLocaleString()}
        change={metrics.connectionsTrend}
        icon={<Users className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Vues de vidéos"
        value={metrics.videoViews.toLocaleString()}
        change={metrics.viewsTrend}
        icon={<Video className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Jeux joués"
        value={metrics.gamesPlayed.toLocaleString()}
        change={metrics.gamesTrend}
        icon={<Gamepad2 className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Quiz complétés"
        value={metrics.quizCompletions.toLocaleString()}
        change={metrics.quizTrend}
        icon={<FileCheck className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
      />
      <MetricCard
        title="Nouveaux utilisateurs"
        value={metrics.newUsers.toLocaleString()}
        change={metrics.usersTrend}
        icon={<UserPlus className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EngagementMetricsSection;
