import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Users, DollarSign } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { financialKPIService } from '@/services/kpi/FinancialKPIService';

interface ChurnData {
  month: string;
  churn_rate_customers: number;
  churn_rate_revenue: number;
  churned_customers: number;
  churn_mrr: number;
}

const ChurnDualWidget: React.FC = () => {
  const [data, setData] = useState<ChurnData[]>([]);
  const [currentData, setCurrentData] = useState<ChurnData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const kpis = await financialKPIService.getKPIsTrend(6); // Last 6 months
        
        const churnData = kpis.map(kpi => ({
          month: new Date(kpi.metric_date).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
          churn_rate_customers: kpi.churn_rate_customers,
          churn_rate_revenue: kpi.churn_rate_revenue,
          churned_customers: kpi.churned_customers,
          churn_mrr: kpi.mrr_churn
        }));

        setData(churnData);
        if (churnData.length > 0) {
          setCurrentData(churnData[churnData.length - 1]);
        }
      } catch (error) {
        console.error('Error loading churn data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getChurnHealthBadge = (rate: number) => {
    if (rate <= 3) return <Badge variant="default" className="bg-success/20 text-success">Excellent</Badge>;
    if (rate <= 5) return <Badge variant="default" className="bg-primary/20 text-primary">Bon</Badge>;
    if (rate <= 8) return <Badge variant="default" className="bg-warning/20 text-warning">Attention</Badge>;
    return <Badge variant="destructive">Critique</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Analyse du Churn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
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
            <AlertTriangle className="h-5 w-5 mr-2" />
            Analyse du Churn
          </div>
          {currentData && getChurnHealthBadge(currentData.churn_rate_customers)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Metrics */}
        {currentData && (
          <div className="grid grid-cols-2 gap-4">
            {/* Customer Churn */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Churn Clients</span>
              </div>
              <div className="text-2xl font-bold text-danger">
                {currentData.churn_rate_customers.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {currentData.churned_customers} clients perdus
              </div>
            </div>

            {/* Revenue Churn */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Churn Revenus</span>
              </div>
              <div className="text-2xl font-bold text-danger">
                {currentData.churn_rate_revenue.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(currentData.churn_mrr)} MRR perdu
              </div>
            </div>
          </div>
        )}

        {/* Trend Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                yAxisId="rate"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="volume"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'churned_customers') return [value, 'Clients perdus'];
                  return [`${value.toFixed(1)}%`, name === 'churn_rate_customers' ? 'Churn Clients' : 'Churn Revenus'];
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              
              {/* Churn rates as lines */}
              <Line 
                yAxisId="rate"
                type="monotone" 
                dataKey="churn_rate_customers" 
                name="Churn Clients %"
                stroke="hsl(var(--danger))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--danger))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="rate"
                type="monotone" 
                dataKey="churn_rate_revenue" 
                name="Churn Revenus %"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 3 }}
              />
              
              {/* Volume as bars */}
              <Bar 
                yAxisId="volume"
                dataKey="churned_customers" 
                name="Clients perdus"
                fill="hsl(var(--danger) / 0.3)"
                stroke="hsl(var(--danger))"
                strokeWidth={1}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            <strong>Objectifs:</strong> Churn clients &lt;5% • Churn revenus &lt; churn clients (rétention des gros comptes)
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Actions:</strong> Détection précoce via scoring • Programmes rétention • Amélioration produit
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChurnDualWidget;