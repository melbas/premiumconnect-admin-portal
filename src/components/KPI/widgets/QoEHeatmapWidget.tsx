import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Zap, Clock, Signal } from 'lucide-react';
import { realtimeMetricsService, QoEMeasurement } from '@/services/kpi/RealtimeMetricsService';

interface QoESiteData {
  site_id: string;
  avg_qoe_score: number;
  measurements_count: number;
  latest_measurement: QoEMeasurement;
  trend: 'up' | 'down' | 'stable';
}

const QoEHeatmapWidget: React.FC = () => {
  const [siteData, setSiteData] = useState<QoESiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'qoe' | 'latency' | 'packet_loss' | 'throughput'>('qoe');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get QoE measurements for the last 2 hours
        const measurements = await realtimeMetricsService.getQoEMeasurements(200);
        
        // Group by site and calculate aggregates
        const siteMap = new Map<string, QoEMeasurement[]>();
        measurements.forEach(measurement => {
          if (!siteMap.has(measurement.site_id)) {
            siteMap.set(measurement.site_id, []);
          }
          siteMap.get(measurement.site_id)!.push(measurement);
        });

        const processedData: QoESiteData[] = Array.from(siteMap.entries()).map(([siteId, siteMeasurements]) => {
          const sortedMeasurements = siteMeasurements.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          const avgQoE = siteMeasurements.reduce((sum, m) => sum + m.qoe_score, 0) / siteMeasurements.length;
          
          // Calculate trend based on recent vs older measurements
          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (sortedMeasurements.length >= 4) {
            const recent = sortedMeasurements.slice(0, 2);
            const older = sortedMeasurements.slice(-2);
            const recentAvg = recent.reduce((sum, m) => sum + m.qoe_score, 0) / recent.length;
            const olderAvg = older.reduce((sum, m) => sum + m.qoe_score, 0) / older.length;
            
            const diff = recentAvg - olderAvg;
            if (diff > 5) trend = 'up';
            else if (diff < -5) trend = 'down';
          }

          return {
            site_id: siteId,
            avg_qoe_score: avgQoE,
            measurements_count: siteMeasurements.length,
            latest_measurement: sortedMeasurements[0],
            trend
          };
        });

        // Sort by QoE score (worst first for attention)
        processedData.sort((a, b) => a.avg_qoe_score - b.avg_qoe_score);
        
        setSiteData(processedData);
      } catch (error) {
        console.error('Error fetching QoE data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const getQoEColor = (score: number): string => {
    if (score >= 80) return 'bg-success/20 text-success border-success/30';
    if (score >= 70) return 'bg-warning/20 text-warning border-warning/30';
    if (score >= 50) return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
    return 'bg-danger/20 text-danger border-danger/30';
  };

  const getMetricValue = (measurement: QoEMeasurement): { value: string; unit: string; color: string } => {
    switch (selectedMetric) {
      case 'qoe':
        return {
          value: Math.round(measurement.qoe_score).toString(),
          unit: '/100',
          color: getQoEColor(measurement.qoe_score)
        };
      case 'latency':
        const latency = measurement.latency_p95_ms || 0;
        return {
          value: Math.round(latency).toString(),
          unit: 'ms',
          color: latency <= 50 ? 'bg-success/20 text-success border-success/30' :
                 latency <= 100 ? 'bg-warning/20 text-warning border-warning/30' :
                 'bg-danger/20 text-danger border-danger/30'
        };
      case 'packet_loss':
        const loss = measurement.packet_loss_percentage || 0;
        return {
          value: loss.toFixed(1),
          unit: '%',
          color: loss <= 1 ? 'bg-success/20 text-success border-success/30' :
                 loss <= 3 ? 'bg-warning/20 text-warning border-warning/30' :
                 'bg-danger/20 text-danger border-danger/30'
        };
      case 'throughput':
        const throughput = measurement.throughput_mbps || 0;
        return {
          value: throughput.toFixed(1),
          unit: 'Mbps',
          color: throughput >= 50 ? 'bg-success/20 text-success border-success/30' :
                 throughput >= 20 ? 'bg-warning/20 text-warning border-warning/30' :
                 'bg-danger/20 text-danger border-danger/30'
        };
      default:
        return { value: '0', unit: '', color: 'bg-muted' };
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable'): React.ReactNode => {
    switch (trend) {
      case 'up':
        return <Activity className="h-3 w-3 text-success rotate-45" />;
      case 'down':
        return <Activity className="h-3 w-3 text-danger -rotate-45" />;
      case 'stable':
        return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Heatmap QoE par Site
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Heatmap QoE par Site
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {siteData.length} sites actifs
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMetric('qoe')}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              selectedMetric === 'qoe' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            <Activity className="h-3 w-3 mr-1 inline" />
            QoE Score
          </button>
          <button
            onClick={() => setSelectedMetric('latency')}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              selectedMetric === 'latency' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            <Clock className="h-3 w-3 mr-1 inline" />
            Latence P95
          </button>
          <button
            onClick={() => setSelectedMetric('packet_loss')}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              selectedMetric === 'packet_loss' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            <Signal className="h-3 w-3 mr-1 inline" />
            Perte Paquets
          </button>
          <button
            onClick={() => setSelectedMetric('throughput')}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              selectedMetric === 'throughput' 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
            }`}
          >
            <Zap className="h-3 w-3 mr-1 inline" />
            Débit
          </button>
        </div>

        {/* Heatmap Grid */}
        {siteData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune donnée QoE disponible</p>
            <p className="text-xs">Les métriques apparaîtront dès que les premiers relevés seront effectués</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {siteData.slice(0, 15).map((site) => {
              const metric = getMetricValue(site.latest_measurement);
              
              return (
                <div
                  key={site.site_id}
                  className={`p-3 rounded-lg border text-center transition-all hover:scale-105 ${metric.color}`}
                  title={`${site.site_id} - QoE: ${Math.round(site.avg_qoe_score)}/100`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate flex-1">
                      {site.site_id}
                    </span>
                    {getTrendIcon(site.trend)}
                  </div>
                  <div className="text-lg font-bold">
                    {metric.value}
                    <span className="text-xs font-normal ml-0.5">{metric.unit}</span>
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {site.latest_measurement.user_count || 0} users
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-success/20 border border-success/30"></div>
                <span>Excellent</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-warning/20 border border-warning/30"></div>
                <span>Dégradé</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-danger/20 border border-danger/30"></div>
                <span>Critique</span>
              </div>
            </div>
            <span>Dernières 2 heures</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QoEHeatmapWidget;