
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, Users, FileText } from 'lucide-react';

interface AuditStatsCardsProps {
  stats: {
    totalActions: number;
    criticalActions: number;
    activeUsers: number;
    recentAlerts: number;
  };
}

const AuditStatsCards: React.FC<AuditStatsCardsProps> = ({ stats }) => {
  return (
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
  );
};

export default AuditStatsCards;
