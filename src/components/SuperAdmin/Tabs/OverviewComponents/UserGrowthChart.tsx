
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { userGrowthData } from '../../mockData';

// User Growth Chart component
const UserGrowthChart: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Croissance des Utilisateurs</CardTitle>
        <CardDescription>Nouveaux utilisateurs au fil du temps</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartComponent
            type="line"
            data={userGrowthData}
            options={{
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
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

export default UserGrowthChart;
