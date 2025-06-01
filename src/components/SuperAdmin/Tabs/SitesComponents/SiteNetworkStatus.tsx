
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Shield, 
  Zap, 
  Key, 
  Link, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Router
} from 'lucide-react';

interface SiteNetworkStatusProps {
  method?: 'direct' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn';
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  isActive: boolean;
  lastTested?: Date;
}

const SiteNetworkStatus: React.FC<SiteNetworkStatusProps> = ({
  method = 'direct',
  status,
  isActive,
  lastTested
}) => {
  const getMethodIcon = () => {
    switch (method) {
      case 'cloudflare_tunnel':
        return <Shield className="h-3 w-3" />;
      case 'wireguard':
        return <Zap className="h-3 w-3" />;
      case 'tailscale':
        return <Link className="h-3 w-3" />;
      case 'openvpn':
        return <Key className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getStatusInfo = () => {
    if (!isActive) {
      return {
        badge: <Badge variant="outline" className="bg-gray-100"><Router className="h-3 w-3 mr-1" />Inactif</Badge>,
        description: 'Configuration désactivée'
      };
    }

    switch (status) {
      case 'connected':
        return {
          badge: <Badge className="bg-green-100 text-green-800">{getMethodIcon()}<CheckCircle className="h-3 w-3 ml-1" /></Badge>,
          description: 'Connexion établie'
        };
      case 'testing':
        return {
          badge: <Badge variant="secondary">{getMethodIcon()}<span className="ml-1">Test...</span></Badge>,
          description: 'Test de connexion en cours'
        };
      case 'error':
        return {
          badge: <Badge variant="destructive">{getMethodIcon()}<XCircle className="h-3 w-3 ml-1" /></Badge>,
          description: 'Erreur de connexion'
        };
      default:
        return {
          badge: <Badge variant="outline">{getMethodIcon()}<AlertTriangle className="h-3 w-3 ml-1" /></Badge>,
          description: 'Statut inconnu'
        };
    }
  };

  const { badge, description } = getStatusInfo();

  return (
    <div className="flex flex-col items-center gap-1">
      {badge}
      <span className="text-xs text-muted-foreground text-center">{description}</span>
      {lastTested && (
        <span className="text-xs text-muted-foreground">
          Testé: {lastTested.toLocaleString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      )}
    </div>
  );
};

export default SiteNetworkStatus;
