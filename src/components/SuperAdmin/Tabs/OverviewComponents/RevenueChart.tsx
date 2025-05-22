
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { revenueData } from '../../mockData';

// Revenue Chart component
const RevenueChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenu par Site (6 derniers mois)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartComponent
            type="bar"
            data={{
              labels: revenueData.labels,
              datasets: revenueData.datasets
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: 'Revenu en FCFA'
                },
                legend: {
                  position: 'bottom'
                }
              }
            }}
            height={300}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
