
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getPortalStatistics, getWifiUsers, getMetricTrend } from '@/services/captivePortalService';
import { userSegmentationService } from '@/services/userSegmentationService';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, LineChart, PieChart, Users, 
  Activity, Calendar, Filter, Download
} from 'lucide-react';

import EngagementMetricsSection from './AnalyticsComponents/EngagementMetricsSection';
import UserSegmentsTable from './AnalyticsComponents/UserSegmentsTable';
import EventsTable from './AnalyticsComponents/EventsTable';
import UserActivityHeatmap from './AnalyticsComponents/UserActivityHeatmap';

const SuperAdminAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30');
  const { toast } = useToast();
  
  // Fetch statistics
  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['portalStatistics', timeRange],
    queryFn: () => {
      const days = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      return getPortalStatistics(startDate.toISOString().split('T')[0]);
    },
  });

  // Fetch user segments
  const { data: userSegments, isLoading: isLoadingSegments } = useQuery({
    queryKey: ['userSegments'],
    queryFn: () => userSegmentationService.getAllSegments(),
  });

  // Fetch users
  const { data: userData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['wifiUsers'],
    queryFn: () => getWifiUsers(100),
  });

  // Metrics trends
  const { data: connectionsData, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['metricTrend', 'total_connections', timeRange],
    queryFn: () => getMetricTrend('total_connections', parseInt(timeRange)),
  });

  const { data: sessionsData, isLoading: isLoadingSessionsData } = useQuery({
    queryKey: ['metricTrend', 'avg_session_duration', timeRange],
    queryFn: () => getMetricTrend('avg_session_duration', parseInt(timeRange)),
  });

  // Download reports handler
  const handleExportData = () => {
    if (!statistics) return;
    
    // Create CSV content
    const headers = "Date,Connections,Video Views,Quiz Completions,Games Played,Leads Collected,Avg Session Duration,Game Completion Rate,Conversion Rate,Returning Users\n";
    
    const csvContent = statistics.map(stat => 
      `${stat.date},${stat.total_connections},${stat.video_views},${stat.quiz_completions},${stat.games_played},${stat.leads_collected},${stat.avg_session_duration},${stat.game_completion_rate},${stat.conversion_rate},${stat.returning_users}`
    ).join("\n");
    
    // Create and trigger download
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    toast({
      title: "Rapport exporté",
      description: "Le rapport d'analyse a été téléchargé avec succès."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="dashboard-title">Analytique et Segmentation</h1>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période d'analyse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
              <SelectItem value="365">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportData} disabled={isLoadingStats}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Vue générale</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Segments</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Événements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EngagementMetricsSection 
            timeRange={parseInt(timeRange)} 
            statistics={statistics || []}
            isLoading={isLoadingStats}
          />
          
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Connexions
                </CardTitle>
                <CardDescription>
                  Nombre total de connexions au fil du temps
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingConnections ? (
                  <Skeleton className="w-full h-full" />
                ) : connectionsData ? (
                  <ChartComponent
                    type="line"
                    data={{
                      labels: connectionsData.data.map(item => item.date),
                      datasets: [
                        {
                          label: 'Connexions',
                          data: connectionsData.data.map(item => item.value || 0),
                          fill: true,
                          tension: 0.4,
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          borderColor: 'rgba(59, 130, 246, 1)',
                        }
                      ]
                    }}
                    height={300}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Durée moyenne de session
                </CardTitle>
                <CardDescription>
                  Temps moyen passé par session
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoadingSessionsData ? (
                  <Skeleton className="w-full h-full" />
                ) : sessionsData ? (
                  <ChartComponent
                    type="line"
                    data={{
                      labels: sessionsData.data.map(item => item.date),
                      datasets: [
                        {
                          label: 'Minutes',
                          data: sessionsData.data.map(item => item.value || 0),
                          fill: true,
                          tension: 0.4,
                          backgroundColor: 'rgba(139, 92, 246, 0.2)',
                          borderColor: 'rgba(139, 92, 246, 1)',
                        }
                      ]
                    }}
                    height={300}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    Aucune donnée disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Activité utilisateur par heure et jour
              </CardTitle>
              <CardDescription>
                Intensité des connexions utilisateurs par plage horaire
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <UserActivityHeatmap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs du portail WiFi</CardTitle>
              <CardDescription>
                {isLoadingUsers ? 'Chargement...' : `${userData?.count || 0} utilisateurs enregistrés`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-12" />
                  ))}
                </div>
              ) : userData && userData.users.length > 0 ? (
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-3 px-4">Nom</th>
                        <th className="text-left py-3 px-4">Contact</th>
                        <th className="text-left py-3 px-4">Méthode d'auth</th>
                        <th className="text-left py-3 px-4">Points</th>
                        <th className="text-left py-3 px-4">Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="py-3 px-4">{user.name || 'Anonyme'}</td>
                          <td className="py-3 px-4">{user.email || user.phone || 'Non spécifié'}</td>
                          <td className="py-3 px-4">{user.auth_method}</td>
                          <td className="py-3 px-4">{user.loyalty_points || 0}</td>
                          <td className="py-3 px-4">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  Aucun utilisateur trouvé
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <UserSegmentsTable segments={userSegments || []} isLoading={isLoadingSegments} />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <EventsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminAnalytics;
