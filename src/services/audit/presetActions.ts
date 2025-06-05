
import { AuditLogger } from './auditLogger';

export class PresetActions {
  constructor(private auditLogger: AuditLogger) {}

  async logLogin(adminUserId: string): Promise<void> {
    await this.auditLogger.logAction({
      admin_user_id: adminUserId,
      action_type: 'auth_login',
      action_description: 'Connexion réussie au back-office',
      criticality: 'medium'
    });
  }

  async logLogout(adminUserId: string): Promise<void> {
    await this.auditLogger.logAction({
      admin_user_id: adminUserId,
      action_type: 'auth_logout',
      action_description: 'Déconnexion du back-office',
      criticality: 'low'
    });
  }

  async logUserCreate(adminUserId: string, targetUserId: string, userData: any): Promise<void> {
    await this.auditLogger.logAction({
      admin_user_id: adminUserId,
      action_type: 'user_create',
      action_description: `Création d'un nouvel utilisateur: ${userData.name || userData.email}`,
      target_entity: 'wifi_users',
      target_id: targetUserId,
      new_data: userData,
      criticality: 'high'
    });
  }

  async logUserUpdate(adminUserId: string, targetUserId: string, previousData: any, newData: any): Promise<void> {
    await this.auditLogger.logAction({
      admin_user_id: adminUserId,
      action_type: 'user_update',
      action_description: `Modification utilisateur: ${newData.name || newData.email}`,
      target_entity: 'wifi_users',
      target_id: targetUserId,
      previous_data: previousData,
      new_data: newData,
      criticality: 'high'
    });
  }

  async logPortalCreate(adminUserId: string, portalId: string, portalData: any): Promise<void> {
    await this.auditLogger.logAction({
      admin_user_id: adminUserId,
      action_type: 'portal_create',
      action_description: `Création portail captif: ${portalData.portal_name}`,
      target_entity: 'portal_config',
      target_id: portalId,
      new_data: portalData,
      criticality: 'high'
    });
  }

  async logConfigUpdate(adminUserId: string, configType: string, previousData: any, newData: any): Promise<void> {
    await this.auditLogger.logAction({
      admin_user_id: adminUserId,
      action_type: 'config_update',
      action_description: `Modification configuration: ${configType}`,
      target_entity: 'system_config',
      previous_data: previousData,
      new_data: newData,
      criticality: 'critical'
    });
  }

  async logDataExport(adminUserId: string, exportType: string, filters: any): Promise<void> {
    await this.auditLogger.logAction({
      admin_user_id: adminUserId,
      action_type: 'data_export',
      action_description: `Export de données: ${exportType}`,
      new_data: { export_type: exportType, filters },
      criticality: 'high'
    });
  }
}
