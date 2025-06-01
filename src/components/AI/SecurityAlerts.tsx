
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fraudDetectionService, type SecurityThreat } from '@/services/ai/fraudDetectionService';
import { useAuth } from '@/context/AuthContext';
import { Shield, AlertTriangle, Eye, Info, X } from 'lucide-react';

interface SecurityAlertsProps {
  userId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({
  userId,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const { user } = useAuth();
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissedThreats, setDismissedThreats] = useState<Set<string>>(new Set());

  const currentUserId = userId || user?.id;

  useEffect(() => {
    if (currentUserId) {
      loadSecurityThreats();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (autoRefresh && currentUserId) {
      const interval = setInterval(loadSecurityThreats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, currentUserId]);

  const loadSecurityThreats = async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    try {
      const detectedThreats = await fraudDetectionService.detectAnomalies(currentUserId);
      setThreats(detectedThreats.filter(threat => !dismissedThreats.has(threat.id)));
    } catch (error) {
      console.error('Error loading security threats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissThreat = (threatId: string) => {
    setDismissedThreats(prev => new Set([...prev, threatId]));
    setThreats(prev => prev.filter(threat => threat.id !== threatId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Eye className="w-4 h-4" />;
      case 'low':
        return <Info className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getThreatTypeLabel = (threatType: string) => {
    const labels: Record<string, string> = {
      'unusual_activity': 'Activité inhabituelle',
      'fraud': 'Fraude potentielle',
      'abuse': 'Abus détecté',
      'spam': 'Comportement spam',
      'multiple_accounts': 'Comptes multiples'
    };
    return labels[threatType] || threatType;
  };

  if (!currentUserId) {
    return null;
  }

  const visibleThreats = threats.filter(threat => !dismissedThreats.has(threat.id));
  const africanSpecificThreats = visibleThreats.filter(threat => threat.africaSpecific);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Sécurité & Détection
          </div>
          <Button 
            onClick={loadSecurityThreats} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? 'Analyse...' : 'Actualiser'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visibleThreats.length === 0 ? (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Aucune menace détectée. Votre compte est sécurisé.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Alertes spécifiques à l'Afrique */}
            {africanSpecificThreats.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-orange-600 flex items-center gap-2">
                  🌍 Alertes contexte africain
                </h4>
                {africanSpecificThreats.map((threat) => (
                  <Alert key={threat.id} className="border-orange-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getSeverityIcon(threat.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {getThreatTypeLabel(threat.threatType)}
                            </span>
                            <Badge className={getSeverityColor(threat.severity)}>
                              {threat.severity}
                            </Badge>
                            <Badge variant="outline">
                              {Math.round(threat.confidence * 100)}% sûr
                            </Badge>
                          </div>
                          <AlertDescription className="mb-2">
                            {threat.details}
                          </AlertDescription>
                          {threat.recommendations.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              <strong>Recommandations :</strong>
                              <ul className="list-disc list-inside mt-1">
                                {threat.recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissThreat(threat.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {/* Autres alertes */}
            {visibleThreats.filter(threat => !threat.africaSpecific).map((threat) => (
              <Alert key={threat.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(threat.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {getThreatTypeLabel(threat.threatType)}
                        </span>
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(threat.confidence * 100)}% sûr
                        </Badge>
                      </div>
                      <AlertDescription className="mb-2">
                        {threat.details}
                      </AlertDescription>
                      {threat.recommendations.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Actions recommandées :</strong>
                          <ul className="list-disc list-inside mt-1">
                            {threat.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissThreat(threat.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Alert>
            ))}

            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              Dernière vérification : {new Date().toLocaleTimeString('fr-FR')}
              {autoRefresh && ' • Actualisation automatique activée'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAlerts;
