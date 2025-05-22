
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { campaignChartData } from '../../mockData';

// Campaign Performance Chart component
const CampaignChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance des Campagnes</CardTitle>
        <CardDescription>Répartition des clics par type de campagne</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartComponent
            type="doughnut"
            data={{
              labels: campaignChartData.labels,
              datasets: campaignChartData.datasets
            }}
            options={{
              plugins: {
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

export default CampaignChart;
