
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartComponent } from '@/components/Dashboard/Chart';
import { dashboardStats, revenueData, userGrowthData, deviceUsageData, overviewMetrics, campaignChartData, users, sites } from '../mockData';
import { 
  Users, 
  DollarSign, 
  AlertTriangle, 
  LayoutDashboard as Layout, 
  MapPin, 
  BarChart, 
  PlusCircle, 
  UserPlus 
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Component to render metrics
const MetricCard = ({ title, value, icon, change }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold mt-1">{value}</h2>
            {change && (
              <p className={`text-xs flex items-center mt-1 ${change.isPositive ? "text-success" : "text-danger"}`}>
                {change.isPositive ? "↑" : "↓"} {change.value}%
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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

// Recent Activity component
const RecentActivity = () => {
  const activities = [
    { id: 1, description: "Nouveau site créé: Kaolack Est", time: "Il y a 30 minutes", type: "site" },
    { id: 2, description: "Campagne approuvée: Promo Ramadan", time: "Il y a 2 heures", type: "marketing" },
    { id: 3, description: "Problème résolu: Instabilité réseau à Thiès", time: "Il y a 5 heures", type: "technical" },
    { id: 4, description: "Nouveau grossiste ajouté: Fatou Ndiaye", time: "Il y a 1 jour", type: "wholesaler" }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "site":
        return <MapPin size={18} className="text-primary" />;
      case "marketing":
        return <BarChart size={18} className="text-success" />;
      case "technical":
        return <AlertTriangle size={18} className="text-warning" />;
      case "wholesaler":
        return <Users size={18} className="text-secondary" />;
      default:
        return <Users size={18} className="text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités Récentes</CardTitle>
        <CardDescription>Les dernières actions effectuées sur le tableau de bord</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="p-2 bg-background rounded-full border border-border">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Actions component
const QuickActions = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `Action déclenchée`,
      description: `Vous avez sélectionné l'action: ${action}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
        <CardDescription>Accès rapide aux actions courantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Créer un site")}
          >
            <PlusCircle size={16} />
            <span>Créer un site</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Ajouter un grossiste")}
          >
            <UserPlus size={16} />
            <span>Ajouter un grossiste</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Lancer une campagne")}
          >
            <BarChart size={16} />
            <span>Lancer une campagne</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start space-x-2 h-auto py-3"
            onClick={() => handleAction("Surveiller les problèmes")}
          >
            <AlertTriangle size={16} />
            <span>Surveiller les problèmes</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// User Growth Chart component
const UserGrowthChart = () => {
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

// Top Wholesalers component
const TopWholesalers = () => {
  // Sort wholesalers by revenue
  const topWholesalers = [...users]
    .filter(user => user.revenue)
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Grossistes</CardTitle>
        <CardDescription>Classés par revenu</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Site</TableHead>
              <TableHead className="text-right">Revenu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topWholesalers.map((wholesaler) => (
              <TableRow key={wholesaler.id}>
                <TableCell className="font-medium">{wholesaler.name}</TableCell>
                <TableCell>{wholesaler.assignedSiteId ? `Site #${wholesaler.assignedSiteId}` : "Non assigné"}</TableCell>
                <TableCell className="text-right">{wholesaler.revenue?.toLocaleString()} FCFA</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Main Overview component
const SuperAdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Tableau de Bord Wifi Sénégal</h1>
      
      {/* Metrics section */}
      <MetricsOverview />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
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
        
        {/* User growth chart */}
        <UserGrowthChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Campaign performance chart */}
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
        
        {/* Top wholesalers */}
        <TopWholesalers />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activities */}
        <RecentActivity />
        
        {/* Quick actions */}
        <QuickActions />
      </div>
      
      {/* Site status */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des Sites</CardTitle>
          <CardDescription>Les 5 premiers sites par nombre d'utilisateurs</CardDescription>
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
                    <td>{site.users?.toLocaleString()}</td>
                    <td>{site.revenue?.toLocaleString()} FCFA</td>
                    <td>{site.uptime}%</td>
                    <td>{site.issues}</td>
                    <td>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${site.status === 'active' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-danger/20 text-danger'
                        }`}
                      >
                        {site.status === 'active' ? 'Actif' : 'Hors ligne'}
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
