
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Router, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { getNetworkStatusSummary } from './siteNetworkUtils';

const NetworkMetricsCard: React.FC = () => {
  const metrics = getNetworkStatusSummary();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Réseau</CardTitle>
        <Router className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sites configurés</span>
            <Badge variant="outline">{metrics.total}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              Connectés
            </span>
            <Badge className="bg-green-100 text-green-800">{metrics.connected}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-600" />
              Déconnectés
            </span>
            <Badge variant="outline">{metrics.disconnected}</Badge>
          </div>
          
          {metrics.errors > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                Erreurs
              </span>
              <Badge variant="destructive">{metrics.errors}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMetricsCard;
