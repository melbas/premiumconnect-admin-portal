
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { serverStatus } from '../../mockData';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { Server, Clock, Users } from 'lucide-react';

const ServerMonitoring = () => {
  // Create chart data for peak hours
  const peakHoursData = {
    labels: serverStatus.peakHours.map(hour => hour.hour),
    datasets: [
      {
        label: 'Connexions',
        data: serverStatus.peakHours.map(hour => hour.connections),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 2,
      }
    ]
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Serveur</CardTitle>
          <CardDescription>Statistiques de performance et métriques en temps réel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibilité</p>
                <p className="text-2xl font-semibold">{serverStatus.uptime}%</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Latence Moyenne</p>
                <p className="text-2xl font-semibold">{serverStatus.latency} ms</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border rounded-lg">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions Actives</p>
                <p className="text-2xl font-semibold">{serverStatus.activeSessions}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Heures de Pointe (Connexions)</h4>
            <div className="h-64">
              <ChartComponent 
                type="bar"
                data={peakHoursData}
                height={200}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerMonitoring;
