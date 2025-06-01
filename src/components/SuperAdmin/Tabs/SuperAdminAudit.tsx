

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Search, Filter, AlertTriangle, Activity, Users, FileText } from 'lucide-react';
import { adminAuditService } from '@/services/adminAuditService';

interface AuditLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  action_description: string;
  target_entity?: string;
  target_id?: string;
  previous_data?: any;
  new_data?: any;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  user_agent?: string;
  ip_address?: string;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  admin_user_id?: string;
  is_resolved: boolean;
  created_at: string;
}

const SuperAdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    actionType: 'all',
    criticality: 'all',
    startDate: '',
    endDate: '',
    adminUserId: ''
  });

  // Statistiques en temps réel
  const [stats, setStats] = useState({
    totalActions: 0,
    criticalActions: 0,
    activeUsers: 0,
    recentAlerts: 0
  });

  useEffect(() => {
    loadAuditData();
  }, [filters]);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const auditLogs = await adminAuditService.getLogs({
        actionType: filters.actionType === 'all' ? undefined : filters.actionType,
        criticality: filters.criticality === 'all' ? undefined : filters.criticality,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        adminUserId: filters.adminUserId || undefined,
        limit: 100
      });

      // Convertir les données reçues avec les types corrects
      const typedLogs: AuditLog[] = auditLogs.map(log => ({
        id: log.id,
        admin_user_id: log.admin_user_id,
        action_type: log.action_type,
        action_description: log.action_description,
        target_entity: log.target_entity,
        target_id: log.target_id,
        previous_data: log.previous_data,
        new_data: log.new_data,
        criticality: log.criticality as 'low' | 'medium' | 'high' | 'critical',
        created_at: log.created_at,
        user_agent: log.user_agent,
        ip_address: log.ip_address ? String(log.ip_address) : undefined
      }));

      setLogs(typedLogs);

      // Calculer les statistiques
      setStats({
        totalActions: typedLogs.length,
        criticalActions: typedLogs.filter(log => log.criticality === 'critical').length,
        activeUsers: new Set(typedLogs.map(log => log.admin_user_id)).size,
        recentAlerts: typedLogs.filter(log => 
          new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
      });
    } catch (error) {
      console.error('Erreur chargement données audit:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCriticalityTextColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      const exportFilters = {
        ...filters,
        actionType: filters.actionType === 'all' ? undefined : filters.actionType,
        criticality: filters.criticality === 'all' ? undefined : filters.criticality
      };
      const blob = await adminAuditService.exportLogs(format, exportFilters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action_description.toLowerCase().includes(filters.search.toLowerCase()) ||
    log.action_type.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Audit & Logs</h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button onClick={() => handleExport('json')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
          <Button onClick={() => handleExport('pdf')} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Actions Total</p>
                <p className="text-2xl font-bold">{stats.totalActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Actions Critiques</p>
                <p className="text-2xl font-bold">{stats.criticalActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Alertes Récentes</p>
                <p className="text-2xl font-bold">{stats.recentAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="logs">Logs Détaillés</TabsTrigger>
          <TabsTrigger value="users">Par Utilisateur</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filters.actionType} onValueChange={(value) => setFilters({ ...filters, actionType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="auth_login">Connexions</SelectItem>
                    <SelectItem value="user_create">Création utilisateur</SelectItem>
                    <SelectItem value="user_update">Modification utilisateur</SelectItem>
                    <SelectItem value="portal_create">Création portail</SelectItem>
                    <SelectItem value="config_update">Modification config</SelectItem>
                    <SelectItem value="data_export">Export données</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.criticality} onValueChange={(value) => setFilters({ ...filters, criticality: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Criticité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  placeholder="Date début"
                />

                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  placeholder="Date fin"
                />

                <Button onClick={loadAuditData} variant="outline">
                  Actualiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline des actions récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredLogs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border-l-4 border-gray-200 hover:bg-gray-50">
                    <div className={`w-3 h-3 rounded-full ${getCriticalityColor(log.criticality)} mt-2`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {log.action_description}
                        </p>
                        <Badge variant="outline" className={getCriticalityTextColor(log.criticality)}>
                          {log.criticality}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                        <span>{log.action_type}</span>
                        <span>•</span>
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                        <span>•</span>
                        <span>Utilisateur: {log.admin_user_id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logs Détaillés ({filteredLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Date/Heure</th>
                      <th className="text-left p-4">Type</th>
                      <th className="text-left p-4">Description</th>
                      <th className="text-left p-4">Utilisateur</th>
                      <th className="text-left p-4">Criticité</th>
                      <th className="text-left p-4">Entité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-sm">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{log.action_type}</Badge>
                        </td>
                        <td className="p-4 text-sm">{log.action_description}</td>
                        <td className="p-4 text-sm font-mono">
                          {log.admin_user_id.slice(0, 8)}...
                        </td>
                        <td className="p-4">
                          <Badge className={getCriticalityColor(log.criticality)}>
                            {log.criticality}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{log.target_entity || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité par Utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Section en développement - Affichage des statistiques par utilisateur admin</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertes de Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Section en développement - Gestion des alertes de sécurité</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => handleExport('csv')} className="h-20 flex-col">
                    <FileText className="w-8 h-8 mb-2" />
                    Export CSV
                  </Button>
                  <Button onClick={() => handleExport('json')} className="h-20 flex-col" variant="outline">
                    <FileText className="w-8 h-8 mb-2" />
                    Export JSON
                  </Button>
                  <Button onClick={() => handleExport('pdf')} className="h-20 flex-col" variant="outline">
                    <FileText className="w-8 h-8 mb-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminAudit;

