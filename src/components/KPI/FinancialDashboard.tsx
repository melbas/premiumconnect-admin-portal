import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { financialKPIService, FinancialKPIs } from '@/services/kpi/FinancialKPIService';
import { alertingService } from '@/services/kpi/AlertingService';
import MRRBreakdownChart from './widgets/MRRBreakdownChart';
import NRRWidget from './widgets/NRRWidget';
import ARPUTrendChart from './widgets/ARPUTrendChart';
import ChurnDualWidget from './widgets/ChurnDualWidget';

const FinancialDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<FinancialKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await financialKPIService.getCurrentKPIs();
        setKpis(data);
        setError(null);

        // Check for financial alerts
        if (data) {
          // Check NRR alert
          if (data.nrr_percentage < 100) {
            alertingService.checkAlerts('nrr', { 
              nrr: data.nrr_percentage,
              threshold: 100 
            });
          }

          // Check churn alert
          if (data.churn_rate_customers > 8) {
            alertingService.checkAlerts('churn', { 
              churn_rate: data.churn_rate_customers,
              threshold: 8 
            });
          }

          // Check ARPU alert (compare with previous month)
          const previousMonth = await financialKPIService.getKPIsForDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
          if (previousMonth && data.arpu < previousMonth.arpu * 0.95) {
            alertingService.checkAlerts('arpu', { 
              current_arpu: data.arpu,
              previous_arpu: previousMonth.arpu,
              change_percent: ((data.arpu - previousMonth.arpu) / previousMonth.arpu) * 100
            });
          }
        }
      } catch (err) {
        console.error('Failed to load financial KPIs:', err);
        setError('Impossible de charger les indicateurs financiers');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Refresh daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      loadData();
      // Then refresh every 24 hours
      const interval = setInterval(loadData, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-success" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-danger" />;
    return null;
  };

  const getHealthBadge = (metric: string, value: number) => {
    switch (metric) {
      case 'nrr':
        if (value >= 120) return <Badge variant="default" className="bg-success/20 text-success">Excellent</Badge>;
        if (value >= 110) return <Badge variant="default" className="bg-primary/20 text-primary">Bon</Badge>;
        if (value >= 100) return <Badge variant="default" className="bg-warning/20 text-warning">Moyen</Badge>;
        return <Badge variant="destructive">Critique</Badge>;
      
      case 'churn':
        if (value <= 3) return <Badge variant="default" className="bg-success/20 text-success">Excellent</Badge>;
        if (value <= 5) return <Badge variant="default" className="bg-primary/20 text-primary">Bon</Badge>;
        if (value <= 8) return <Badge variant="default" className="bg-warning/20 text-warning">Attention</Badge>;
        return <Badge variant="destructive">Critique</Badge>;
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="dashboard-title">Indicateurs Financiers</h1>
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

  if (error && !kpis) {
    return (
      <div className="space-y-6">
        <h1 className="dashboard-title">Indicateurs Financiers</h1>
        <Card className="border-danger/20 bg-danger/5">
          <CardContent className="flex items-center space-x-2 p-6">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <span className="text-danger">{error}</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="dashboard-title">Indicateurs Financiers</h1>
        <div className="text-sm text-muted-foreground">
          Mis à jour quotidiennement à minuit
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR Total */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              MRR Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(kpis?.mrr_total || 0)}
                </span>
                {getTrendIcon(kpis?.mrr_total || 0, (kpis?.mrr_total || 0) - (kpis?.mrr_new || 0) + (kpis?.mrr_churn || 0))}
              </div>
              <div className="text-xs text-muted-foreground">
                +{formatCurrency(kpis?.mrr_new || 0)} nouveau • -{formatCurrency(kpis?.mrr_churn || 0)} churn
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NRR */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Net Revenue Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatPercentage(kpis?.nrr_percentage || 0)}
                </span>
                {getHealthBadge('nrr', kpis?.nrr_percentage || 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                Objectif: ≥110% • Excellent: ≥120%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ARPU */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="h-4 w-4 mr-2" />
              ARPU Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(kpis?.arpu || 0)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                B2B: {formatCurrency(kpis?.arpu_b2b || 0)} • B2C: {formatCurrency(kpis?.arpu_b2c || 0)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Taux de Churn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatPercentage(kpis?.churn_rate_customers || 0)}
                </span>
                {getHealthBadge('churn', kpis?.churn_rate_customers || 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                {kpis?.churned_customers || 0} clients perdus ce mois
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Breakdown */}
        <MRRBreakdownChart />
        
        {/* NRR Trend */}
        <NRRWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ARPU Trend */}
        <ARPUTrendChart />
        
        {/* Churn Analysis */}
        <ChurnDualWidget />
      </div>

      {/* Customer Growth Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé Croissance Client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">+{kpis?.new_customers || 0}</div>
              <div className="text-sm text-muted-foreground">Nouveaux clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{kpis?.total_customers || 0}</div>
              <div className="text-sm text-muted-foreground">Total clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger">-{kpis?.churned_customers || 0}</div>
              <div className="text-sm text-muted-foreground">Clients perdus</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;