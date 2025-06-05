
import { SessionService, SecurityAlertsService, AuditLogger, ExportService, PresetActions } from './audit';
import { AuditLogData, SecurityAlertData, AuditLogFilters } from './audit/types';

class AdminAuditService {
  private sessionService = new SessionService();
  private securityAlertsService = new SecurityAlertsService();
  private auditLogger = new AuditLogger();
  private exportService = new ExportService();
  private presetActions = new PresetActions(this.auditLogger);

  // Session management methods
  generateSessionId(): string {
    const sessionId = this.sessionService.generateSessionId();
    this.auditLogger.setSessionId(sessionId);
    return sessionId;
  }

  // Audit logging methods
  async logAction(data: AuditLogData): Promise<void> {
    await this.auditLogger.logAction(data);
    await this.sessionService.updateSessionActivity();
  }

  async getLogs(filters: AuditLogFilters = {}) {
    return await this.auditLogger.getLogs(filters);
  }

  // Preset action methods
  async logLogin(adminUserId: string): Promise<void> {
    await this.presetActions.logLogin(adminUserId);
    await this.sessionService.createSession(adminUserId);
  }

  async logLogout(adminUserId: string): Promise<void> {
    await this.presetActions.logLogout(adminUserId);
    await this.sessionService.endSession();
  }

  async logUserCreate(adminUserId: string, targetUserId: string, userData: any): Promise<void> {
    await this.presetActions.logUserCreate(adminUserId, targetUserId, userData);
  }

  async logUserUpdate(adminUserId: string, targetUserId: string, previousData: any, newData: any): Promise<void> {
    await this.presetActions.logUserUpdate(adminUserId, targetUserId, previousData, newData);
  }

  async logPortalCreate(adminUserId: string, portalId: string, portalData: any): Promise<void> {
    await this.presetActions.logPortalCreate(adminUserId, portalId, portalData);
  }

  async logConfigUpdate(adminUserId: string, configType: string, previousData: any, newData: any): Promise<void> {
    await this.presetActions.logConfigUpdate(adminUserId, configType, previousData, newData);
  }

  async logDataExport(adminUserId: string, exportType: string, filters: any): Promise<void> {
    await this.presetActions.logDataExport(adminUserId, exportType, filters);
  }

  // Security alerts methods
  async createSecurityAlert(data: SecurityAlertData): Promise<void> {
    await this.securityAlertsService.createSecurityAlert(data);
  }

  // Export methods
  async exportLogs(format: 'csv' | 'json' | 'pdf', filters: any = {}) {
    const logs = await this.getLogs(filters);
    const adminUserId = 'current-admin-id'; // À récupérer du contexte

    // Log de l'export
    await this.logDataExport(adminUserId, `audit_logs_${format}`, filters);

    switch (format) {
      case 'csv':
        return this.exportService.exportToCSV(logs);
      case 'json':
        return this.exportService.exportToJSON(logs);
      case 'pdf':
        return this.exportService.exportToPDF(logs);
      default:
        throw new Error('Format d\'export non supporté');
    }
  }

  // Session management wrapper methods
  async createSession(adminUserId: string): Promise<void> {
    await this.sessionService.createSession(adminUserId);
  }

  async updateSessionActivity(): Promise<void> {
    await this.sessionService.updateSessionActivity();
  }

  async endSession(): Promise<void> {
    await this.sessionService.endSession();
  }
}

export const adminAuditService = new AdminAuditService();
export type { AuditLogData, SecurityAlertData };
