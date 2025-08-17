import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Wifi, Shield, Activity, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { realtimeMetricsService, RealtimeMetrics } from '@/services/kpi/RealtimeMetricsService';
import { alertingService } from '@/services/kpi/AlertingService';
import UptimeGlobalWidget from './widgets/UptimeGlobalWidget';
import QoEHeatmapWidget from './widgets/QoEHeatmapWidget';
import AuthFunnelWidget from './widgets/AuthFunnelWidget';
import IncidentsLiveTable from './widgets/IncidentsLiveTable';
import CriticalSitesList from './widgets/CriticalSitesList';

const RealtimeDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const data = await realtimeMetricsService.getRealtimeMetrics();
        setMetrics(data);
        setLastUpdate(new Date());
        setError(null);
      } catch (err) {
        console.error('Failed to load realtime metrics:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Set up real-time subscription
    const unsubscribe = realtimeMetricsService.subscribeToMetrics((updatedMetrics) => {
      setMetrics(updatedMetrics);
      setLastUpdate(new Date());
      
      // Check for alerts on new data
      alertingService.checkAlerts('uptime', { 
        uptime: updatedMetrics.global_uptime,
        site_id: 'GLOBAL' 
      });
      
      alertingService.checkAlerts('qoe', { 
        qoe_score: updatedMetrics.global_qoe_score,
        site_id: 'GLOBAL' 
      });
      
      alertingService.checkAlerts('auth', { 
        success_rate: updatedMetrics.auth_success_rate,
        auth_method: 'ALL' 
      });
    });

    // Refresh every 60 seconds as fallback
    const interval = setInterval(loadInitialData, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  if (loading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="dashboard-title">Dashboard Temps Réel</h1>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="space-y-6">
        <h1 className="dashboard-title">Dashboard Temps Réel</h1>
        <Card className="border-danger/20 bg-danger/5">
          <CardContent className="flex items-center space-x-2 p-6">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <span className="text-danger">{error}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatLastUpdate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `il y a ${diffSecs}s`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `il y a ${diffMins}min`;
    const diffHours = Math.floor(diffMins / 60);
    return `il y a ${diffHours}h`;
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-success';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-danger';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <Badge variant="default" className="bg-success/20 text-success">Excellent</Badge>;
    if (value >= thresholds.warning) return <Badge variant="default" className="bg-warning/20 text-warning">Attention</Badge>;
    return <Badge variant="destructive">Critique</Badge>;
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="dashboard-title">Dashboard Temps Réel</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Dernière mise à jour: {formatLastUpdate(lastUpdate)}</span>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            LIVE
          </Badge>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Global Uptime */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Wifi className="h-4 w-4 mr-2" />
              Disponibilité Globale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getStatusColor(metrics?.global_uptime || 0, { good: 99.9, warning: 99.5 })}`}>
                  {metrics?.global_uptime?.toFixed(2) || '0.00'}%
                </span>
                {getStatusBadge(metrics?.global_uptime || 0, { good: 99.9, warning: 99.5 })}
              </div>
              <div className="text-xs text-muted-foreground">
                SLA: 99.9% | Seuil critique: 99.5%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QoE Score */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Score QoE Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getStatusColor(metrics?.global_qoe_score || 0, { good: 80, warning: 70 })}`}>
                  {Math.round(metrics?.global_qoe_score || 0)}/100
                </span>
                {getStatusBadge(metrics?.global_qoe_score || 0, { good: 80, warning: 70 })}
              </div>
              <div className="text-xs text-muted-foreground">
                Basé sur latence P95, perte paquets, débit
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Success Rate */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Taux Authentification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${getStatusColor(metrics?.auth_success_rate || 0, { good: 95, warning: 80 })}`}>
                  {metrics?.auth_success_rate?.toFixed(1) || '0.0'}%
                </span>
                {getStatusBadge(metrics?.auth_success_rate || 0, { good: 95, warning: 80 })}
              </div>
              <div className="text-xs text-muted-foreground">
                Portail → RADIUS → Internet (dernière heure)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Incidents Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${metrics?.active_incidents === 0 ? 'text-success' : 'text-danger'}`}>
                  {metrics?.active_incidents || 0}
                </span>
                {(metrics?.active_incidents || 0) === 0 ? (
                  <Badge variant="default" className="bg-success/20 text-success">Aucun</Badge>
                ) : (
                  <Badge variant="destructive">Actifs</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Incidents ouverts et en cours d'investigation
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uptime Global Widget with Site Details */}
        <UptimeGlobalWidget />
        
        {/* QoE Heatmap */}
        <QoEHeatmapWidget />
      </div>

      {/* Critical Sites List */}
      {metrics?.critical_sites && metrics.critical_sites.length > 0 && (
        <CriticalSitesList sites={metrics.critical_sites} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth Funnel */}
        <AuthFunnelWidget />
        
        {/* Live Incidents Table */}
        <IncidentsLiveTable />
      </div>
    </div>
  );
};

export default RealtimeDashboard;