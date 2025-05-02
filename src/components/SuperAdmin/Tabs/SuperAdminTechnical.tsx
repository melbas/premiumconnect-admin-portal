
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChartComponent from '@/components/Dashboard/ChartComponent';
import { 
  RefreshCw, Server, Wifi, AlertTriangle, 
  Bell, BellOff, Filter, Download
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  unifiApiService, 
  UnifiDevice, 
  UnifiDeviceStatistics, 
  UnifiClient 
} from '@/services/unifiService';
import { technicalIssues, uptimeChartData } from '../mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Define proper TypeScript interfaces
interface TechnicalIssue {
  id: string;
  description: string;
  siteId: string;
  siteName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  reportedAt: string;
  resolvedAt?: string;
}

const SuperAdminTechnical: React.FC = () => {
  const [issues, setIssues] = useState<TechnicalIssue[]>(technicalIssues);
  const [devices, setDevices] = useState<UnifiDevice[]>([]);
  const [deviceStats, setDeviceStats] = useState<Record<string, UnifiDeviceStatistics>>({});
  const [clients, setClients] = useState<UnifiClient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('devices');
  const [issueFilter, setIssueFilter] = useState<string>('all');
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch UniFi data
  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      // Fetch devices
      const devicesData = await unifiApiService.getDevices();
      setDevices(devicesData);

      // Fetch stats for each device
      const statsPromises = devicesData.map(device => 
        unifiApiService.getDeviceStatistics(device.id)
      );
      const statsResults = await Promise.all(statsPromises);
      
      // Create a map of deviceId -> stats
      const statsMap: Record<string, UnifiDeviceStatistics> = {};
      devicesData.forEach((device, index) => {
        if (statsResults[index]) {
          statsMap[device.id] = statsResults[index] as UnifiDeviceStatistics;
        }
      });
      setDeviceStats(statsMap);

      // Fetch clients
      const clientsData = await unifiApiService.getClients();
      setClients(clientsData);

      // Check for potential issues based on device stats
      checkForIssues(devicesData, statsMap);

      toast({
        title: "Données actualisées",
        description: "Les données techniques ont été actualisées avec succès",
      });
    } catch (error) {
      console.error('Error fetching UniFi data:', error);
      toast({
        title: "Erreur de synchronisation",
        description: "Impossible de récupérer les données. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  // Check for potential issues based on device statistics
  const checkForIssues = (devices: UnifiDevice[], stats: Record<string, UnifiDeviceStatistics>) => {
    if (!alertsEnabled) return;
    
    devices.forEach(device => {
      const deviceStats = stats[device.id];
      if (!deviceStats) return;
      
      // Check CPU usage (over 80%)
      if (deviceStats.cpuUtilizationPct > 80) {
        const existingIssue = issues.find(
          issue => issue.description.includes(`CPU élevé`) && 
                   issue.description.includes(device.name || device.macAddress) &&
                   issue.status !== 'resolved'
        );
        
        if (!existingIssue) {
          const newIssue: TechnicalIssue = {
            id: `cpu-${device.id}-${Date.now()}`,
            description: `CPU élevé sur ${device.name || device.macAddress}: ${deviceStats.cpuUtilizationPct.toFixed(1)}%`,
            siteId: 'site1', // We would get the actual siteId in a real app
            siteName: 'Dakar Central', // We would get the actual site name in a real app
            severity: deviceStats.cpuUtilizationPct > 90 ? 'critical' : 'high',
            status: 'open',
            reportedAt: new Date().toISOString()
          };
          
          setIssues(prev => [...prev, newIssue]);
          
          toast({
            title: "Nouvel incident détecté",
            description: newIssue.description,
            variant: "destructive"
          });
        }
      }
      
      // Check memory usage (over 85%)
      if (deviceStats.memoryUtilizationPct > 85) {
        const existingIssue = issues.find(
          issue => issue.description.includes(`Mémoire élevée`) && 
                   issue.description.includes(device.name || device.macAddress) &&
                   issue.status !== 'resolved'
        );
        
        if (!existingIssue) {
          const newIssue: TechnicalIssue = {
            id: `memory-${device.id}-${Date.now()}`,
            description: `Mémoire élevée sur ${device.name || device.macAddress}: ${deviceStats.memoryUtilizationPct.toFixed(1)}%`,
            siteId: 'site1',
            siteName: 'Dakar Central',
            severity: deviceStats.memoryUtilizationPct > 95 ? 'critical' : 'high',
            status: 'open',
            reportedAt: new Date().toISOString()
          };
          
          setIssues(prev => [...prev, newIssue]);
          
          toast({
            title: "Nouvel incident détecté",
            description: newIssue.description,
            variant: "destructive"
          });
        }
      }
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // Handle issue status update
  const updateIssueStatus = (id: string, newStatus: 'open' | 'in-progress' | 'resolved') => {
    setIssues(prev => prev.map(issue => 
      issue.id === id
        ? { ...issue, status: newStatus, resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : issue.resolvedAt }
        : issue
    ));
    
    toast({
      title: "État de l'incident mis à jour",
      description: `L'incident a été marqué comme ${
        newStatus === 'resolved' ? 'résolu' : 
        newStatus === 'in-progress' ? 'en cours' : 'ouvert'
      }.`,
    });
  };

  // Handle device restart
  const handleRestartDevice = async (deviceId: string) => {
    const success = await unifiApiService.executeDeviceAction(deviceId, "RESTART");
    if (success) {
      toast({
        title: "Redémarrage initié",
        description: "L'appareil va redémarrer. Cela peut prendre quelques minutes.",
      });
    }
  };

  // Get severity badge class
  const getSeverityClass = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return 'bg-danger/20 text-danger';
      case 'high':
        return 'bg-warning/20 text-warning';
      case 'medium':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted/40 text-muted-foreground';
    }
  };

  // Get status badge class
  const getStatusClass = (status: 'open' | 'in-progress' | 'resolved') => {
    switch (status) {
      case 'open':
        return 'bg-danger/20 text-danger';
      case 'in-progress':
        return 'bg-warning/20 text-warning';
      case 'resolved':
        return 'bg-success/20 text-success';
      default:
        return 'bg-muted/40 text-muted-foreground';
    }
  };

  // Format bytes to human readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i] + '/s';
  };

  // Format uptime seconds to human readable format
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}j ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Filter issues based on selected filter
  const filteredIssues = issues.filter(issue => {
    if (issueFilter === 'all') return true;
    if (issueFilter === 'open') return issue.status === 'open';
    if (issueFilter === 'in-progress') return issue.status === 'in-progress';
    if (issueFilter === 'resolved') return issue.status === 'resolved';
    if (issueFilter === 'critical') return issue.severity === 'critical' && issue.status !== 'resolved';
    if (issueFilter === 'high') return issue.severity === 'high' && issue.status !== 'resolved';
    return true;
  });

  // Handle alert toggle
  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled);
    toast({
      title: alertsEnabled ? "Alertes désactivées" : "Alertes activées",
      description: alertsEnabled 
        ? "Les nouvelles alertes automatiques sont désactivées." 
        : "Les alertes automatiques sont maintenant activées.",
    });
  };

  // Export issues to CSV
  const exportIssues = () => {
    const header = ['ID', 'Description', 'Site', 'Gravité', 'Statut', 'Signalé', 'Résolu'];
    const rows = filteredIssues.map(issue => [
      issue.id,
      issue.description,
      issue.siteName,
      issue.severity,
      issue.status,
      new Date(issue.reportedAt).toLocaleString('fr-FR'),
      issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleString('fr-FR') : ''
    ]);
    
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `incidents-techniques-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Le fichier CSV a été téléchargé.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="dashboard-title">Surveillance Technique</h1>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </Button>
      </div>

      {/* Device Status Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Appareils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.length}</div>
            <p className="text-sm text-muted-foreground">
              {devices.filter(device => device.state === 'ONLINE').length} en ligne, {' '}
              {devices.filter(device => device.state === 'OFFLINE').length} hors ligne
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Clients Connectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clients.length}</div>
            <p className="text-sm text-muted-foreground">
              {clients.filter(client => client.type === 'WIRELESS').length} sans fil, {' '}
              {clients.filter(client => client.type === 'WIRED').length} filaires
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {issues.filter(issue => issue.status === 'open' || issue.status === 'in-progress').length}
            </div>
            <p className="text-sm text-muted-foreground">
              {issues.filter(issue => issue.severity === 'critical' && issue.status !== 'resolved').length} critiques, {' '}
              {issues.filter(issue => issue.status === 'resolved').length} résolus
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="devices">Appareils</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-6">
          {/* Site Uptime Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tendances de Disponibilité (30 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ChartComponent
                  type="line"
                  data={{
                    labels: uptimeChartData.labels,
                    datasets: uptimeChartData.datasets
                  }}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Disponibilité (%)'
                      },
                      legend: {
                        position: 'bottom'
                      }
                    },
                    scales: {
                      y: {
                        min: 97,
                        max: 100,
                        ticks: {
                          callback: (value) => `${value}%`
                        }
                      }
                    }
                  }}
                  height={350}
                />
              </div>
            </CardContent>
          </Card>

          {/* Devices Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appareils Réseau</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => console.log('Filtrer appareils')}
                >
                  <Filter size={16} />
                  <span>Filtrer</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Modèle</th>
                      <th>Adresse IP</th>
                      <th>État</th>
                      <th>Uptime</th>
                      <th>CPU</th>
                      <th>Mémoire</th>
                      <th>Bande Passante</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device) => {
                      const stats = deviceStats[device.id];
                      return (
                        <tr key={device.id}>
                          <td className="font-medium">{device.name || device.macAddress}</td>
                          <td>{device.model || 'N/A'}</td>
                          <td>{device.ipAddress || 'N/A'}</td>
                          <td>
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                device.state === 'ONLINE' ? 'bg-success/20 text-success' : 
                                device.state === 'PROVISIONING' ? 'bg-warning/20 text-warning' :
                                'bg-danger/20 text-danger'
                              }`}
                            >
                              {device.state === 'ONLINE' ? 'En ligne' : 
                               device.state === 'PROVISIONING' ? 'En cours' : 'Hors ligne'}
                            </span>
                          </td>
                          <td>{stats ? formatUptime(stats.uptimeSec) : 'N/A'}</td>
                          <td>
                            {stats ? (
                              <div className="flex items-center">
                                <div className="mr-2 h-2.5 w-full max-w-24 rounded-full bg-muted">
                                  <div 
                                    className={`h-full rounded-full ${
                                      stats.cpuUtilizationPct > 80 ? 'bg-danger' :
                                      stats.cpuUtilizationPct > 60 ? 'bg-warning' : 'bg-success'
                                    }`}
                                    style={{ width: `${stats.cpuUtilizationPct}%` }}
                                  />
                                </div>
                                <span>{stats.cpuUtilizationPct.toFixed(1)}%</span>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td>
                            {stats ? (
                              <div className="flex items-center">
                                <div className="mr-2 h-2.5 w-full max-w-24 rounded-full bg-muted">
                                  <div 
                                    className={`h-full rounded-full ${
                                      stats.memoryUtilizationPct > 80 ? 'bg-danger' :
                                      stats.memoryUtilizationPct > 60 ? 'bg-warning' : 'bg-success'
                                    }`}
                                    style={{ width: `${stats.memoryUtilizationPct}%` }}
                                  />
                                </div>
                                <span>{stats.memoryUtilizationPct.toFixed(1)}%</span>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td>
                            {stats ? (
                              <div className="text-xs">
                                <div className="flex items-center">
                                  <span className="w-8 inline-block text-success">↓</span>
                                  <span>{formatBytes(stats.rxRateBps)}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-8 inline-block text-danger">↑</span>
                                  <span>{formatBytes(stats.txRateBps)}</span>
                                </div>
                              </div>
                            ) : 'N/A'}
                          </td>
                          <td>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRestartDevice(device.id)}
                              disabled={device.state !== 'ONLINE'}
                            >
                              Redémarrer
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {devices.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-4 text-muted-foreground">
                          {isLoading ? 'Chargement des appareils...' : 'Aucun appareil trouvé'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-6">
          {/* Clients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Clients Connectés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Adresse MAC</th>
                      <th>Adresse IP</th>
                      <th>Type</th>
                      <th>Connecté depuis</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      // Calculate time since connection
                      const connectedAt = new Date(client.connectedAt);
                      const now = new Date();
                      const diffMs = now.getTime() - connectedAt.getTime();
                      const diffMins = Math.round(diffMs / 60000);
                      
                      let timeDisplay;
                      if (diffMins < 60) {
                        timeDisplay = `${diffMins} min`;
                      } else if (diffMins < 1440) {
                        timeDisplay = `${Math.floor(diffMins / 60)} h`;
                      } else {
                        timeDisplay = `${Math.floor(diffMins / 1440)} j`;
                      }
                      
                      return (
                        <tr key={client.id}>
                          <td className="font-medium">{client.name || 'Client sans nom'}</td>
                          <td>{client.macAddress}</td>
                          <td>{client.ipAddress || 'N/A'}</td>
                          <td>
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                client.type === 'WIRELESS' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                              }`}
                            >
                              {client.type === 'WIRELESS' ? 'Sans fil' : 'Filaire'}
                            </span>
                          </td>
                          <td>{timeDisplay}</td>
                          <td>
                            <Button variant="outline" size="sm">
                              Bloquer
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {clients.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted-foreground">
                          {isLoading ? 'Chargement des clients...' : 'Aucun client connecté'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-6">
          {/* Technical Issues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Incidents Techniques</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={toggleAlerts}
                >
                  {alertsEnabled ? <BellOff size={16} /> : <Bell size={16} />}
                  {alertsEnabled ? 'Désactiver alertes' : 'Activer alertes'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={exportIssues}
                >
                  <Download size={16} />
                  <span>Exporter CSV</span>
                </Button>
                <Select defaultValue={issueFilter} onValueChange={setIssueFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les incidents</SelectItem>
                    <SelectItem value="open">Ouverts</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="resolved">Résolus</SelectItem>
                    <SelectItem value="critical">Critiques</SelectItem>
                    <SelectItem value="high">Haute priorité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Site</th>
                      <th>Gravité</th>
                      <th>Statut</th>
                      <th>Signalé</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td className="font-medium">{issue.description}</td>
                        <td>{issue.siteName}</td>
                        <td>
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeverityClass(issue.severity)}`}
                          >
                            {issue.severity === 'critical' ? 'Critique' : 
                             issue.severity === 'high' ? 'Haute' : 
                             issue.severity === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </td>
                        <td>
                          <span 
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(issue.status)}`}
                          >
                            {issue.status === 'open' ? 'Ouvert' : 
                             issue.status === 'in-progress' ? 'En cours' : 'Résolu'}
                          </span>
                        </td>
                        <td>
                          {new Date(issue.reportedAt).toLocaleString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>
                          <select
                            value={issue.status}
                            onChange={(e) => updateIssueStatus(
                              issue.id, 
                              e.target.value as 'open' | 'in-progress' | 'resolved'
                            )}
                            className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="open">Ouvert</option>
                            <option value="in-progress">En cours</option>
                            <option value="resolved">Résolu</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredIssues.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted-foreground">
                          {issueFilter !== 'all' 
                            ? 'Aucun incident ne correspond à ce filtre' 
                            : 'Aucun incident technique signalé'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminTechnical;
