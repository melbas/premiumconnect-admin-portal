import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { financialKPIService } from '@/services/kpi/FinancialKPIService';

interface MRRData {
  month: string;
  new_mrr: number;
  expansion_mrr: number;
  contraction_mrr: number;
  churn_mrr: number;
  net_mrr: number;
}

const MRRBreakdownChart: React.FC = () => {
  const [data, setData] = useState<MRRData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const kpis = await financialKPIService.getKPIsTrend(6); // Last 6 months
        
        const mrrData = kpis.map(kpi => ({
          month: new Date(kpi.metric_date).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
          new_mrr: kpi.mrr_new,
          expansion_mrr: kpi.mrr_expansion,
          contraction_mrr: -kpi.mrr_contraction, // Negative for visual
          churn_mrr: -kpi.mrr_churn, // Negative for visual
          net_mrr: kpi.mrr_new + kpi.mrr_expansion - kpi.mrr_contraction - kpi.mrr_churn
        }));

        setData(mrrData);
      } catch (error) {
        console.error('Error loading MRR data:', error);
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
    }).format(Math.abs(value));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Décomposition MRR</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Décomposition MRR - 6 Derniers Mois</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'new_mrr' ? 'Nouveau MRR' :
                  name === 'expansion_mrr' ? 'Expansion MRR' :
                  name === 'contraction_mrr' ? 'Contraction MRR' :
                  name === 'churn_mrr' ? 'Churn MRR' : name
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              
              {/* Positive bars */}
              <Bar dataKey="new_mrr" name="Nouveau MRR" fill="hsl(var(--success))" />
              <Bar dataKey="expansion_mrr" name="Expansion MRR" fill="hsl(var(--primary))" />
              
              {/* Negative bars */}
              <Bar dataKey="contraction_mrr" name="Contraction MRR" fill="hsl(var(--warning))" />
              <Bar dataKey="churn_mrr" name="Churn MRR" fill="hsl(var(--danger))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Nouveau MRR</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Expansion</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>Contraction</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-danger rounded"></div>
            <span>Churn</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MRRBreakdownChart;