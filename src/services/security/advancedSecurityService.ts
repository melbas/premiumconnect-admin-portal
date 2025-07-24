import { fraudDetectionService } from '@/services/ai/fraudDetectionService';
import { urlFilteringService } from './urlFilteringService';
import { arpProtectionService } from './arpProtectionService';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityDashboardMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: number;
  blockedRequests: number;
  suspiciousDevices: number;
  protectedUsers: number;
  recentIncidents: SecurityIncident[];
}

export interface SecurityIncident {
  id: string;
  type: 'fraud' | 'malware' | 'arp_attack' | 'unauthorized_access' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  title: string;
  description: string;
  affectedUsers: number;
  detectedAt: string;
  resolvedAt?: string;
  actions: string[];
}

export interface SecurityConfiguration {
  fraudDetectionEnabled: boolean;
  urlFilteringEnabled: boolean;
  arpProtectionEnabled: boolean;
  autoBlockThreats: boolean;
  alertThresholds: {
    suspiciousConnections: number;
    failedAttempts: number;
    bandwidthAnomaly: number;
  };
  notificationSettings: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    webhookUrl?: string;
  };
}

export const advancedSecurityService = {
  /**
   * Obtient un aperçu complet de la sécurité
   */
  async getSecurityDashboard(): Promise<SecurityDashboardMetrics> {
    try {
      console.log('🛡️ Generating security dashboard...');

      const [
        fraudStats,
        filteringStats,
        arpStats,
        recentIncidents
      ] = await Promise.all([
        fraudDetectionService.detectAnomalies('current_user'),
        urlFilteringService.getFilteringStats('day'),
        arpProtectionService.getProtectionStats('day'),
        this.getRecentIncidents()
      ]);

      // Calcul du niveau de menace global
      const threatLevel = this.calculateThreatLevel({
        fraudThreats: fraudStats.length,
        blockedUrls: filteringStats.totalFiltered,
        arpAnomalies: arpStats.totalAnomalies,
        activeIncidents: recentIncidents.filter(i => i.status === 'active').length
      });

      return {
        threatLevel,
        activeThreats: fraudStats.length + arpStats.activeThreats,
        blockedRequests: filteringStats.totalFiltered,
        suspiciousDevices: arpStats.totalAnomalies,
        protectedUsers: await this.getProtectedUsersCount(),
        recentIncidents: recentIncidents.slice(0, 10)
      };
    } catch (error) {
      console.error('❌ Error generating security dashboard:', error);
      return {
        threatLevel: 'low',
        activeThreats: 0,
        blockedRequests: 0,
        suspiciousDevices: 0,
        protectedUsers: 0,
        recentIncidents: []
      };
    }
  },

  /**
   * Calcule le niveau de menace global
   */
  calculateThreatLevel(metrics: {
    fraudThreats: number;
    blockedUrls: number;
    arpAnomalies: number;
    activeIncidents: number;
  }): 'low' | 'medium' | 'high' | 'critical' {
    const score = 
      (metrics.fraudThreats * 10) +
      (metrics.blockedUrls * 1) +
      (metrics.arpAnomalies * 5) +
      (metrics.activeIncidents * 15);

    if (score >= 100) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 20) return 'medium';
    return 'low';
  },

  /**
   * Obtient les incidents récents
   */
  async getRecentIncidents(): Promise<SecurityIncident[]> {
    try {
      const { data: alerts } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      return (alerts || []).map(alert => ({
        id: alert.id,
        type: this.mapAlertTypeToIncidentType(alert.alert_type),
        severity: this.mapSeverityToIncident(alert.severity),
        status: alert.is_resolved ? 'resolved' : 'active',
        title: alert.title,
        description: alert.description,
        affectedUsers: 1, // À calculer selon les données
        detectedAt: alert.created_at,
        resolvedAt: alert.resolved_at,
        actions: this.getRecommendedActions(alert.alert_type, alert.severity)
      }));
    } catch (error) {
      console.error('Error getting recent incidents:', error);
      return [];
    }
  },

  /**
   * Mappe les types d'alertes aux types d'incidents
   */
  mapAlertTypeToIncidentType(alertType: string): SecurityIncident['type'] {
    const mapping: Record<string, SecurityIncident['type']> = {
      'fraud_detection': 'fraud',
      'url_filtering': 'malware',
      'arp_protection': 'arp_attack',
      'unauthorized_access': 'unauthorized_access',
      'data_breach': 'data_breach'
    };
    return mapping[alertType] || 'unauthorized_access';
  },

  /**
   * Mappe la sévérité des alertes
   */
  mapSeverityToIncident(severity: string): SecurityIncident['severity'] {
    const mapping: Record<string, SecurityIncident['severity']> = {
      'info': 'low',
      'warning': 'medium',
      'danger': 'high',
      'critical': 'critical'
    };
    return mapping[severity] || 'medium';
  },

  /**
   * Obtient les actions recommandées selon le type d'alerte
   */
  getRecommendedActions(alertType: string, severity: string): string[] {
    const baseActions = [
      'Examiner les logs détaillés',
      'Notifier l\'équipe de sécurité'
    ];

    const specificActions: Record<string, string[]> = {
      'fraud_detection': [
        'Bloquer temporairement l\'utilisateur',
        'Vérifier l\'historique des transactions',
        'Analyser les patterns de comportement'
      ],
      'url_filtering': [
        'Mettre à jour les règles de filtrage',
        'Scanner les appareils infectés',
        'Sensibiliser les utilisateurs'
      ],
      'arp_protection': [
        'Isoler l\'appareil suspect',
        'Vérifier la configuration réseau',
        'Renforcer la surveillance ARP'
      ]
    };

    const criticalActions = [
      'Déclencher le plan d\'urgence',
      'Contacter les autorités si nécessaire',
      'Communiquer avec les utilisateurs affectés'
    ];

    let actions = [...baseActions];
    if (specificActions[alertType]) {
      actions.push(...specificActions[alertType]);
    }
    if (severity === 'critical') {
      actions.push(...criticalActions);
    }

    return actions;
  },

  /**
   * Obtient le nombre d'utilisateurs protégés
   */
  async getProtectedUsersCount(): Promise<number> {
    try {
      const { data: sessions } = await supabase
        .from('wifi_sessions')
        .select('user_id')
        .eq('is_active', true);

      return new Set(sessions?.map(s => s.user_id) || []).size;
    } catch (error) {
      console.error('Error getting protected users count:', error);
      return 0;
    }
  },

  /**
   * Lance une analyse de sécurité complète
   */
  async runSecurityScan(userId?: string): Promise<{
    scanId: string;
    results: {
      fraudCheck: any[];
      urlThreats: any;
      arpAnomalies: any[];
      recommendations: string[];
    };
  }> {
    const scanId = `scan-${Date.now()}`;
    console.log(`🔍 Starting comprehensive security scan: ${scanId}`);

    try {
      const [fraudCheck, urlThreats, arpAnomalies] = await Promise.all([
        userId ? fraudDetectionService.detectAnomalies(userId) : Promise.resolve([]),
        urlFilteringService.getFilteringStats('day'),
        arpProtectionService.monitorARPTable()
      ]);

      const recommendations = this.generateSecurityRecommendations({
        fraudThreats: fraudCheck.length,
        blockedUrls: urlThreats.totalFiltered,
        arpAnomalies: arpAnomalies.length
      });

      // Log the scan
      await supabase.from('events').insert({
        event_type: 'security',
        event_name: 'security_scan_completed',
        user_id: userId,
        event_data: {
          scanId,
          fraudThreats: fraudCheck.length,
          blockedUrls: urlThreats.totalFiltered,
          arpAnomalies: arpAnomalies.length,
          recommendations: recommendations.length
        }
      });

      return {
        scanId,
        results: {
          fraudCheck,
          urlThreats,
          arpAnomalies,
          recommendations
        }
      };
    } catch (error) {
      console.error('❌ Error running security scan:', error);
      throw error;
    }
  },

  /**
   * Génère des recommandations de sécurité
   */
  generateSecurityRecommendations(metrics: {
    fraudThreats: number;
    blockedUrls: number;
    arpAnomalies: number;
  }): string[] {
    const recommendations: string[] = [];

    if (metrics.fraudThreats > 5) {
      recommendations.push(
        'Activer l\'authentification à deux facteurs',
        'Renforcer les contrôles de connexion',
        'Mettre en place des alertes en temps réel'
      );
    }

    if (metrics.blockedUrls > 100) {
      recommendations.push(
        'Sensibiliser les utilisateurs aux menaces web',
        'Mettre à jour les règles de filtrage URL',
        'Considérer un proxy web plus restrictif'
      );
    }

    if (metrics.arpAnomalies > 3) {
      recommendations.push(
        'Implémenter la segmentation réseau',
        'Configurer des VLANs par type d\'appareil',
        'Activer la surveillance ARP dynamique'
      );
    }

    // Recommandations générales
    if (recommendations.length === 0) {
      recommendations.push(
        'Maintenir les politiques de sécurité actuelles',
        'Continuer la surveillance proactive',
        'Planifier des audits réguliers'
      );
    }

    return recommendations;
  },

  /**
   * Obtient la configuration de sécurité actuelle
   */
  async getSecurityConfiguration(): Promise<SecurityConfiguration> {
    // En production, cela viendrait de la base de données
    return {
      fraudDetectionEnabled: true,
      urlFilteringEnabled: true,
      arpProtectionEnabled: true,
      autoBlockThreats: false,
      alertThresholds: {
        suspiciousConnections: 10,
        failedAttempts: 5,
        bandwidthAnomaly: 80
      },
      notificationSettings: {
        emailAlerts: true,
        smsAlerts: false,
        webhookUrl: undefined
      }
    };
  },

  /**
   * Met à jour la configuration de sécurité
   */
  async updateSecurityConfiguration(config: Partial<SecurityConfiguration>): Promise<boolean> {
    try {
      console.log('⚙️ Updating security configuration:', config);
      
      // En production, cela mettrait à jour la base de données
      await supabase.from('events').insert({
        event_type: 'security',
        event_name: 'security_config_updated',
        event_data: {
          updatedConfig: config,
          updatedAt: new Date().toISOString()
        }
      });

      return true;
    } catch (error) {
      console.error('Error updating security configuration:', error);
      return false;
    }
  }
};