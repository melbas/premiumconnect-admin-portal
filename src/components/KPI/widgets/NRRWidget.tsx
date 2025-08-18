import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { financialKPIService } from '@/services/kpi/FinancialKPIService';

interface NRRData {
  month: string;
  nrr: number;
}

const NRRWidget: React.FC = () => {
  const [data, setData] = useState<NRRData[]>([]);
  const [currentNRR, setCurrentNRR] = useState<number>(0);
  const [previousNRR, setPreviousNRR] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const kpis = await financialKPIService.getKPIsTrend(6); // Last 6 months
        
        const nrrData = kpis.map(kpi => ({
          month: new Date(kpi.metric_date).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
          nrr: kpi.nrr_percentage
        }));

        setData(nrrData);
        
        if (nrrData.length > 0) {
          setCurrentNRR(nrrData[nrrData.length - 1].nrr);
          if (nrrData.length > 1) {
            setPreviousNRR(nrrData[nrrData.length - 2].nrr);
          }
        }
      } catch (error) {
        console.error('Error loading NRR data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTrendIcon = () => {
    if (currentNRR > previousNRR) return <TrendingUp className="h-4 w-4 text-success" />;
    if (currentNRR < previousNRR) return <TrendingDown className="h-4 w-4 text-danger" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendText = () => {
    const diff = currentNRR - previousNRR;
    if (Math.abs(diff) < 0.1) return 'Stable';
    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}% vs mois précédent`;
  };

  const getHealthStatus = () => {
    if (currentNRR >= 120) return { badge: 'Excellent', color: 'bg-success/20 text-success', variant: 'default' as const };
    if (currentNRR >= 110) return { badge: 'Bon', color: 'bg-primary/20 text-primary', variant: 'default' as const };
    if (currentNRR >= 100) return { badge: 'Moyen', color: 'bg-warning/20 text-warning', variant: 'default' as const };
    return { badge: 'Critique', color: '', variant: 'destructive' as const };
  };

  const getLineColor = () => {
    if (currentNRR >= 120) return '#22c55e'; // success
    if (currentNRR >= 110) return '#3b82f6'; // primary
    if (currentNRR >= 100) return '#f59e0b'; // warning
    return '#ef4444'; // danger
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Net Revenue Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-60 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Net Revenue Retention (NRR)
          <Badge variant={healthStatus.variant} className={healthStatus.color}>
            {healthStatus.badge}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current NRR */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-primary">
              {currentNRR.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              {getTrendIcon()}
              <span>{getTrendText()}</span>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>Objectif: ≥110%</div>
            <div>Excellence: ≥120%</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                domain={[90, 'dataMax']}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'NRR']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              
              {/* Reference lines for targets */}
              <ReferenceLine y={100} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
              <ReferenceLine y={110} stroke="hsl(var(--primary))" strokeDasharray="5 5" />
              <ReferenceLine y={120} stroke="hsl(var(--success))" strokeDasharray="5 5" />
              
              <Line 
                type="monotone" 
                dataKey="nrr" 
                stroke={getLineColor()}
                strokeWidth={3}
                dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getLineColor(), strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Benchmarks */}
        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span>100% = Rétention complète</span>
          <span>110% = Bon upselling</span>
          <span>120% = Excellence SaaS</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NRRWidget;