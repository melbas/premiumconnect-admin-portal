import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users } from 'lucide-react';
import { financialKPIService } from '@/services/kpi/FinancialKPIService';

interface ARPUData {
  month: string;
  arpu_total: number;
  arpu_b2b: number;
  arpu_b2c: number;
}

const ARPUTrendChart: React.FC = () => {
  const [data, setData] = useState<ARPUData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const kpis = await financialKPIService.getKPIsTrend(6); // Last 6 months
        
        const arpuData = kpis.map(kpi => ({
          month: new Date(kpi.metric_date).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
          arpu_total: kpi.arpu,
          arpu_b2b: kpi.arpu_b2b,
          arpu_b2c: kpi.arpu_b2c
        }));

        setData(arpuData);
      } catch (error) {
        console.error('Error loading ARPU data:', error);
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

  const calculateGrowth = (current: number, previous: number): string => {
    if (!previous) return 'N/A';
    const growth = ((current - previous) / previous) * 100;
    return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Évolution ARPU
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Évolution ARPU - 6 Mois
          </div>
          <div className="text-sm text-muted-foreground">
            {currentMonth && formatCurrency(currentMonth.arpu_total)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Growth Indicators */}
        {currentMonth && previousMonth && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-semibold">
                {calculateGrowth(currentMonth.arpu_total, previousMonth.arpu_total)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">B2B</div>
              <div className="font-semibold">
                {calculateGrowth(currentMonth.arpu_b2b, previousMonth.arpu_b2b)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">B2C</div>
              <div className="font-semibold">
                {calculateGrowth(currentMonth.arpu_b2c, previousMonth.arpu_b2c)}
              </div>
            </div>
          </div>
        )}

        {/* Trend Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  name === 'arpu_total' ? 'ARPU Total' :
                  name === 'arpu_b2b' ? 'ARPU B2B' :
                  name === 'arpu_b2c' ? 'ARPU B2C' : name
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              
              <Line 
                type="monotone" 
                dataKey="arpu_total" 
                name="ARPU Total"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="arpu_b2b" 
                name="ARPU B2B"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="arpu_b2c" 
                name="ARPU B2C"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(var(--warning))', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• ARPU B2B typiquement 3-5x supérieur au B2C</div>
            <div>• Surveillance des baisses ≥5% MoM (hors promotions)</div>
            <div>• Optimisation via upselling et réduction churn</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ARPUTrendChart;