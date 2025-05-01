
import React, { useEffect, useRef } from 'react';
import { AlertTriangle, DollarSign, Layout, Users } from 'lucide-react';
import MetricCard from '@/components/Dashboard/MetricCard';
import ChartComponent from '@/components/Dashboard/ChartComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { overviewMetrics, revenueChartData, sites } from '../mockData';

// Component to render metrics
const MetricsOverview = () => {
  // Function to render the appropriate icon based on iconType
  const getIconForType = (iconType: string) => {
    switch (iconType) {
      case "layout":
        return <Layout size={24} className="text-primary" />;
      case "dollar":
        return <DollarSign size={24} className="text-primary" />;
      case "users":
        return <Users size={24} className="text-primary" />;
      case "alert-triangle":
        return <AlertTriangle size={24} className="text-primary" />;
      default:
        return <Users size={24} className="text-primary" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {overviewMetrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          icon={getIconForType(metric.iconType)}
          change={metric.change}
        />
      ))}
    </div>
  );
};

// Main Overview component
const SuperAdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Tableau de Bord Super Admin</h1>
      
      {/* Metrics section */}
      <MetricsOverview />
      
      {/* Revenue chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenu par Site (6 derniers mois)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartComponent
              type="bar"
              data={{
                labels: revenueChartData.labels,
                datasets: revenueChartData.datasets
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
              height={350}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Site status */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nom du Site</th>
                  <th>Emplacement</th>
                  <th>Utilisateurs</th>
                  <th>Revenu Mensuel</th>
                  <th>Disponibilité</th>
                  <th>Problèmes</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {sites.slice(0, 5).map((site) => (
                  <tr key={site.id}>
                    <td className="font-medium">{site.name}</td>
                    <td>{site.location}</td>
                    <td>{site.users.toLocaleString()}</td>
                    <td>{site.revenue.toLocaleString()} FCFA</td>
                    <td>{site.uptime}%</td>
                    <td>{site.issues}</td>
                    <td>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${site.status === 'active' 
                          ? 'bg-success/20 text-success' 
                          : site.status === 'maintenance'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-danger/20 text-danger'
                        }`}
                      >
                        {site.status === 'active' ? 'Actif' : 
                          site.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminOverview;
