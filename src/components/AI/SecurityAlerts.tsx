
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fraudDetectionService, type SecurityThreat } from '@/services/ai/fraudDetectionService';
import { useAuth } from '@/context/AuthContext';
import { Shield, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

interface SecurityAlertsProps {
  userId?: string;
  language?: 'fr' | 'wo' | 'ff' | 'en';
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({
  userId,
  language = 'fr'
}) => {
  const { user } = useAuth();
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = userId || user?.id;

  useEffect(() => {
    if (currentUserId) {
      loadSecurityThreats();
    }
  }, [currentUserId]);

  const loadSecurityThreats = async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const detectedThreats = await fraudDetectionService.detectAnomalies(currentUserId);
      setThreats(detectedThreats);
    } catch (err) {
      console.error('Error loading security threats:', err);
      setError('Impossible de charger les alertes de sécurité');
    } finally {
      setIsLoading(false);
    }
  };

  const dismissThreat = (threatId: string) => {
    setThreats(prev => prev.filter(threat => threat.id !== threatId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default: return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!currentUserId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Connectez-vous pour voir vos alertes de sécurité
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          Alertes de sécurité
          {language === 'wo' && <Badge variant="outline">Wolof</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : threats.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucune menace détectée. Votre système est sécurisé.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat) => (
              <Alert key={threat.id} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(threat.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{threat.threatType}</h4>
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(threat.confidence * 100)}% confiance
                        </Badge>
                      </div>
                      <AlertDescription className="mb-2">
                        {threat.details}
                      </AlertDescription>
                      {threat.recommendations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Recommandations :</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {threat.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span>•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Détecté le {new Date(threat.detectedAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissThreat(threat.id)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Alert>
            ))}
            
            <div className="pt-4 border-t">
              <Button 
                onClick={loadSecurityThreats} 
                variant="outline" 
                className="w-full"
              >
                Actualiser les alertes
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAlerts;
