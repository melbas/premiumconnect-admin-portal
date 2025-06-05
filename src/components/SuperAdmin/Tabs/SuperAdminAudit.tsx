
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminAuditService } from '@/services/adminAuditService';
import {
  AuditStatsCards,
  AuditFilters,
  AuditTimeline,
  AuditLogsTable,
  AuditExportActions
} from './AuditComponents';
import type { AuditLog, AuditStats, AuditFiltersState } from './AuditComponents/types';

const SuperAdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditFiltersState>({
    search: '',
    actionType: 'all',
    criticality: 'all',
    startDate: '',
    endDate: '',
    adminUserId: ''
  });

  const [stats, setStats] = useState<AuditStats>({
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
        <AuditExportActions onExport={handleExport} />
      </div>

      <AuditStatsCards stats={stats} />

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="logs">Logs Détaillés</TabsTrigger>
          <TabsTrigger value="users">Par Utilisateur</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AuditFilters 
            filters={filters} 
            setFilters={setFilters} 
            onRefresh={loadAuditData} 
          />
          <AuditTimeline logs={filteredLogs} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <AuditLogsTable logs={filteredLogs} />
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
          <AuditExportActions onExport={handleExport} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminAudit;
