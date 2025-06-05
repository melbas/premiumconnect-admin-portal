
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface AuditLogsTableProps {
  logs: AuditLog[];
}

const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ logs }) => {
  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs Détaillés ({logs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Heure</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Criticité</TableHead>
              <TableHead>Entité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm">
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.action_type}</Badge>
                </TableCell>
                <TableCell className="text-sm">{log.action_description}</TableCell>
                <TableCell className="text-sm font-mono">
                  {log.admin_user_id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  <Badge className={getCriticalityColor(log.criticality)}>
                    {log.criticality}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{log.target_entity || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AuditLogsTable;
