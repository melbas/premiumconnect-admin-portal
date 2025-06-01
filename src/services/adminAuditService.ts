
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogData {
  admin_user_id: string;
  action_type: string;
  action_description: string;
  target_entity?: string;
  target_id?: string;
  previous_data?: any;
  new_data?: any;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityAlertData {
  alert_type: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  admin_user_id?: string;
  metadata?: any;
}

class AdminAuditService {
  private sessionId: string | null = null;
  private requestId: string | null = null;

  // Générer un ID de session unique
  generateSessionId(): string {
    this.sessionId = crypto.randomUUID();
    return this.sessionId;
  }

  // Capturer les métadonnées de la requête
  private getRequestMetadata() {
    return {
      ip_address: null, // Sera rempli côté serveur
      user_agent: navigator.userAgent,
      session_id: this.sessionId,
      request_id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }

  // Enregistrer un log d'audit
  async logAction(data: AuditLogData): Promise<void> {
    try {
      const metadata = this.getRequestMetadata();
      
      const { error } = await supabase
        .from('admin_audit_logs')
        .insert({
          ...data,
          session_id: metadata.session_id,
          request_id: metadata.request_id,
          user_agent: metadata.user_agent
        });

      if (error) {
        console.error('Erreur lors de l\'enregistrement du log d\'audit:', error);
      }

      // Mettre à jour le nombre d'actions dans la session
      if (this.sessionId) {
        await this.updateSessionActivity();
      }
    } catch (error) {
      console.error('Erreur audit service:', error);
    }
  }

  // Actions spécifiques pré-configurées
  async logLogin(adminUserId: string): Promise<void> {
    await this.logAction({
      admin_user_id: adminUserId,
      action_type: 'auth_login',
      action_description: 'Connexion réussie au back-office',
      criticality: 'medium'
    });

    // Créer une session
    await this.createSession(adminUserId);
  }

  async logLogout(adminUserId: string): Promise<void> {
    await this.logAction({
      admin_user_id: adminUserId,
      action_type: 'auth_logout',
      action_description: 'Déconnexion du back-office',
      criticality: 'low'
    });

    // Terminer la session
    await this.endSession();
  }

  async logUserCreate(adminUserId: string, targetUserId: string, userData: any): Promise<void> {
    await this.logAction({
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
    await this.logAction({
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
    await this.logAction({
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
    await this.logAction({
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
    await this.logAction({
      admin_user_id: adminUserId,
      action_type: 'data_export',
      action_description: `Export de données: ${exportType}`,
      new_data: { export_type: exportType, filters },
      criticality: 'high'
    });
  }

  // Gestion des sessions admin
  async createSession(adminUserId: string): Promise<void> {
    try {
      const sessionToken = crypto.randomUUID();
      this.sessionId = sessionToken;

      const { error } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: adminUserId,
          session_token: sessionToken,
          user_agent: navigator.userAgent,
          is_active: true
        });

      if (error) {
        console.error('Erreur création session:', error);
      }
    } catch (error) {
      console.error('Erreur service session:', error);
    }
  }

  async updateSessionActivity(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const { error } = await supabase
        .from('admin_sessions')
        .update({
          last_activity: new Date().toISOString(),
          total_actions: 1 // Sera incrémenté par un trigger SQL
        })
        .eq('session_token', this.sessionId);

      if (error) {
        console.error('Erreur mise à jour session:', error);
      }
    } catch (error) {
      console.error('Erreur update session:', error);
    }
  }

  async endSession(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const { error } = await supabase
        .from('admin_sessions')
        .update({
          ended_at: new Date().toISOString(),
          is_active: false
        })
        .eq('session_token', this.sessionId);

      if (error) {
        console.error('Erreur fin session:', error);
      }

      this.sessionId = null;
    } catch (error) {
      console.error('Erreur end session:', error);
    }
  }

  // Créer une alerte de sécurité
  async createSecurityAlert(data: SecurityAlertData): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .insert(data);

      if (error) {
        console.error('Erreur création alerte sécurité:', error);
      }
    } catch (error) {
      console.error('Erreur alerte sécurité:', error);
    }
  }

  // Récupérer les logs avec filtres
  async getLogs(filters: {
    adminUserId?: string;
    actionType?: string;
    startDate?: string;
    endDate?: string;
    criticality?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.adminUserId) {
        query = query.eq('admin_user_id', filters.adminUserId);
      }
      if (filters.actionType) {
        query = query.eq('action_type', filters.actionType);
      }
      if (filters.criticality) {
        query = query.eq('criticality', filters.criticality);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur récupération logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur getLogs:', error);
      return [];
    }
  }

  // Export des logs
  async exportLogs(format: 'csv' | 'json' | 'pdf', filters: any = {}) {
    const logs = await this.getLogs(filters);
    const adminUserId = 'current-admin-id'; // À récupérer du contexte

    // Log de l'export
    await this.logDataExport(adminUserId, `audit_logs_${format}`, filters);

    switch (format) {
      case 'csv':
        return this.exportToCSV(logs);
      case 'json':
        return this.exportToJSON(logs);
      case 'pdf':
        return this.exportToPDF(logs);
      default:
        throw new Error('Format d\'export non supporté');
    }
  }

  private exportToCSV(logs: any[]) {
    const headers = ['Date', 'Utilisateur', 'Action', 'Description', 'Entité', 'Criticité'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.admin_user_id,
        log.action_type,
        `"${log.action_description}"`,
        log.target_entity || '',
        log.criticality
      ].join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  private exportToJSON(logs: any[]) {
    return new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  }

  private exportToPDF(logs: any[]) {
    // Implémentation basique pour PDF (nécessiterait une lib comme jsPDF)
    const content = logs.map(log => 
      `${new Date(log.created_at).toLocaleString()} - ${log.action_description}`
    ).join('\n');
    
    return new Blob([content], { type: 'text/plain' });
  }
}

export const adminAuditService = new AdminAuditService();
