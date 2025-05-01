
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChartComponent from '@/components/Dashboard/ChartComponent';
import { technicalIssues, uptimeChartData } from '../mockData';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Simulate random technical alerts
  useEffect(() => {
    const alertInterval = setInterval(() => {
      // 30% chance to generate an alert
      if (Math.random() < 0.3) {
        const randomSiteId = Math.floor(Math.random() * 7) + 1;
        const randomSiteName = [
          "Dakar Central", "Thiès Ouest", "Saint-Louis Port", 
          "Touba Résidentiel", "Ziguinchor Centre", "Mbour Côtier", "Kaolack Est"
        ][randomSiteId - 1];
        
        const issueSeverities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
        const randomSeverity = issueSeverities[Math.floor(Math.random() * issueSeverities.length)];
        
        const issueTypes = [
          "Instabilité réseau",
          "Pic de latence",
          "Problème d'alimentation",
          "Interruption fibre",
          "Panne équipement"
        ];
        const randomType = issueTypes[Math.floor(Math.random() * issueTypes.length)];
        
        const newIssue: TechnicalIssue = {
          id: `${Date.now()}`,
          description: `${randomType} - ${randomSiteName}`,
          siteId: randomSiteId.toString(),
          siteName: randomSiteName,
          severity: randomSeverity,
          status: 'open',
          reportedAt: new Date().toISOString()
        };
        
        setIssues(prev => [newIssue, ...prev]);
        
        toast({
          title: "Alerte Technique",
          description: `${randomSeverity === 'critical' ? '⚠️ CRITIQUE' : 
                         randomSeverity === 'high' ? '⚠️ Important' : 
                         randomSeverity === 'medium' ? 'Modéré' : 'Mineur'}: 
                        ${randomType} détecté sur ${randomSiteName}`,
          variant: randomSeverity === 'critical' || randomSeverity === 'high' ? 'destructive' : undefined
        });
      }
    }, 30000); // 30 seconds interval
    
    // Clear interval on component unmount
    return () => clearInterval(alertInterval);
  }, [toast]);

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

  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Surveillance Technique</h1>
      
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
      
      {/* Technical Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Incidents Techniques</CardTitle>
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
                {issues.slice(0, 10).map((issue) => (
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Technical Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total des Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{issues.length}</div>
            <p className="text-sm text-muted-foreground">
              {issues.filter(issue => issue.status === 'open' || issue.status === 'in-progress').length} incidents actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Incidents Critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {issues.filter(issue => issue.severity === 'critical' && issue.status !== 'resolved').length}
            </div>
            <p className="text-sm text-muted-foreground">
              Nécessitant une attention immédiate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Temps Moyen de Résolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              3,2h
            </div>
            <p className="text-sm text-muted-foreground">
              Pour les incidents des 7 derniers jours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminTechnical;
