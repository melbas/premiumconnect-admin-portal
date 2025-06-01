
import { adminAuditService } from '@/services/adminAuditService';

export interface AuditableAction {
  type: string;
  description: string;
  entity?: string;
  entityId?: string;
  data?: any;
  previousData?: any;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
}

class AuditMiddleware {
  private static instance: AuditMiddleware;
  private isEnabled = true;

  static getInstance(): AuditMiddleware {
    if (!AuditMiddleware.instance) {
      AuditMiddleware.instance = new AuditMiddleware();
    }
    return AuditMiddleware.instance;
  }

  // Wrapper pour les actions CRUD automatiques
  async wrapAction<T>(
    action: () => Promise<T>,
    auditData: AuditableAction,
    adminUserId: string
  ): Promise<T> {
    if (!this.isEnabled) {
      return action();
    }

    const startTime = Date.now();
    let result: T;
    let error: any = null;

    try {
      result = await action();
      
      // Log de succès
      await adminAuditService.logAction({
        admin_user_id: adminUserId,
        action_type: auditData.type,
        action_description: auditData.description,
        target_entity: auditData.entity,
        target_id: auditData.entityId,
        previous_data: auditData.previousData,
        new_data: auditData.data,
        criticality: auditData.criticality || 'medium'
      });

      return result;
    } catch (err) {
      error = err;
      
      // Log d'erreur
      await adminAuditService.logAction({
        admin_user_id: adminUserId,
        action_type: `${auditData.type}_failed`,
        action_description: `Échec: ${auditData.description} - ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
        target_entity: auditData.entity,
        target_id: auditData.entityId,
        previous_data: auditData.previousData,
        new_data: auditData.data,
        criticality: 'high'
      });

      // Créer une alerte de sécurité si l'action est critique
      if (auditData.criticality === 'critical') {
        await adminAuditService.createSecurityAlert({
          alert_type: 'failed_critical_action',
          severity: 'danger',
          title: 'Échec d\'action critique',
          description: `Échec lors de: ${auditData.description}`,
          admin_user_id: adminUserId,
          metadata: { error: err instanceof Error ? err.message : err }
        });
      }

      throw err;
    }
  }

  // Détection automatique d'activités suspectes
  async detectSuspiciousActivity(adminUserId: string, actionType: string) {
    try {
      // Vérifier le nombre d'actions dans les dernières minutes
      const recentActions = await adminAuditService.getLogs({
        adminUserId,
        startDate: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes
        limit: 100
      });

      // Alerte si plus de 50 actions en 5 minutes
      if (recentActions.length > 50) {
        await adminAuditService.createSecurityAlert({
          alert_type: 'suspicious_activity',
          severity: 'warning',
          title: 'Activité suspecte détectée',
          description: `${recentActions.length} actions en 5 minutes pour l'utilisateur ${adminUserId}`,
          admin_user_id: adminUserId,
          metadata: { action_count: recentActions.length, timeframe: '5_minutes' }
        });
      }

      // Alerte pour actions critiques multiples
      const criticalActions = recentActions.filter(action => action.criticality === 'critical');
      if (criticalActions.length > 5) {
        await adminAuditService.createSecurityAlert({
          alert_type: 'multiple_critical_actions',
          severity: 'danger',
          title: 'Actions critiques multiples',
          description: `${criticalActions.length} actions critiques en 5 minutes`,
          admin_user_id: adminUserId,
          metadata: { critical_count: criticalActions.length }
        });
      }
    } catch (error) {
      console.error('Erreur détection activité suspecte:', error);
    }
  }

  // Helper pour les actions courantes
  async auditUserAction(
    adminUserId: string,
    action: 'create' | 'update' | 'delete',
    userId: string,
    userData: any,
    previousData?: any
  ) {
    const actionMap = {
      create: { type: 'user_create', desc: 'Création utilisateur', criticality: 'high' as const },
      update: { type: 'user_update', desc: 'Modification utilisateur', criticality: 'medium' as const },
      delete: { type: 'user_delete', desc: 'Suppression utilisateur', criticality: 'critical' as const }
    };

    const config = actionMap[action];
    
    await adminAuditService.logAction({
      admin_user_id: adminUserId,
      action_type: config.type,
      action_description: `${config.desc}: ${userData.name || userData.email}`,
      target_entity: 'wifi_users',
      target_id: userId,
      previous_data: previousData,
      new_data: userData,
      criticality: config.criticality
    });

    await this.detectSuspiciousActivity(adminUserId, config.type);
  }

  async auditPortalAction(
    adminUserId: string,
    action: 'create' | 'update' | 'delete',
    portalId: string,
    portalData: any,
    previousData?: any
  ) {
    const actionMap = {
      create: { type: 'portal_create', desc: 'Création portail', criticality: 'high' as const },
      update: { type: 'portal_update', desc: 'Modification portail', criticality: 'medium' as const },
      delete: { type: 'portal_delete', desc: 'Suppression portail', criticality: 'critical' as const }
    };

    const config = actionMap[action];
    
    await adminAuditService.logAction({
      admin_user_id: adminUserId,
      action_type: config.type,
      action_description: `${config.desc}: ${portalData.portal_name}`,
      target_entity: 'portal_config',
      target_id: portalId,
      previous_data: previousData,
      new_data: portalData,
      criticality: config.criticality
    });

    await this.detectSuspiciousActivity(adminUserId, config.type);
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

export const auditMiddleware = AuditMiddleware.getInstance();
