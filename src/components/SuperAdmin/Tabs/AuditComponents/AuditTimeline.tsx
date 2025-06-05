
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface AuditTimelineProps {
  logs: AuditLog[];
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {logs.slice(0, 20).map((log) => (
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
  );
};

export default AuditTimeline;
