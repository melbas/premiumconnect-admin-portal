
import { useCallback } from 'react';
import { adminAuditService } from '@/services/adminAuditService';

export const useAdminAudit = () => {
  const logAction = useCallback(async (
    actionType: string,
    description: string,
    options: {
      targetEntity?: string;
      targetId?: string;
      previousData?: any;
      newData?: any;
      criticality?: 'low' | 'medium' | 'high' | 'critical';
    } = {}
  ) => {
    try {
      const adminUserId = 'current-admin-id'; // À récupérer du contexte d'auth
      
      await adminAuditService.logAction({
        admin_user_id: adminUserId,
        action_type: actionType,
        action_description: description,
        ...options
      });
    } catch (error) {
      console.error('Erreur lors du logging d\'audit:', error);
    }
  }, []);

  const logLogin = useCallback(async (adminUserId: string) => {
    await adminAuditService.logLogin(adminUserId);
  }, []);

  const logLogout = useCallback(async (adminUserId: string) => {
    await adminAuditService.logLogout(adminUserId);
  }, []);

  const logUserAction = useCallback(async (
    action: 'create' | 'update' | 'delete',
    targetUserId: string,
    userData: any,
    previousData?: any
  ) => {
    const adminUserId = 'current-admin-id'; // À récupérer du contexte d'auth
    
    switch (action) {
      case 'create':
        await adminAuditService.logUserCreate(adminUserId, targetUserId, userData);
        break;
      case 'update':
        await adminAuditService.logUserUpdate(adminUserId, targetUserId, previousData, userData);
        break;
      case 'delete':
        await logAction('user_delete', `Suppression utilisateur: ${userData.name || userData.email}`, {
          targetEntity: 'wifi_users',
          targetId: targetUserId,
          previousData: userData,
          criticality: 'high'
        });
        break;
    }
  }, [logAction]);

  const logPortalAction = useCallback(async (
    action: 'create' | 'update' | 'delete',
    portalId: string,
    portalData: any,
    previousData?: any
  ) => {
    const adminUserId = 'current-admin-id'; // À récupérer du contexte d'auth
    
    switch (action) {
      case 'create':
        await adminAuditService.logPortalCreate(adminUserId, portalId, portalData);
        break;
      case 'update':
        await logAction('portal_update', `Modification portail: ${portalData.portal_name}`, {
          targetEntity: 'portal_config',
          targetId: portalId,
          previousData,
          newData: portalData,
          criticality: 'high'
        });
        break;
      case 'delete':
        await logAction('portal_delete', `Suppression portail: ${portalData.portal_name}`, {
          targetEntity: 'portal_config',
          targetId: portalId,
          previousData: portalData,
          criticality: 'critical'
        });
        break;
    }
  }, [logAction]);

  const logConfigChange = useCallback(async (
    configType: string,
    previousData: any,
    newData: any
  ) => {
    const adminUserId = 'current-admin-id'; // À récupérer du contexte d'auth
    await adminAuditService.logConfigUpdate(adminUserId, configType, previousData, newData);
  }, []);

  const logDataExport = useCallback(async (exportType: string, filters: any) => {
    const adminUserId = 'current-admin-id'; // À récupérer du contexte d'auth
    await adminAuditService.logDataExport(adminUserId, exportType, filters);
  }, []);

  return {
    logAction,
    logLogin,
    logLogout,
    logUserAction,
    logPortalAction,
    logConfigChange,
    logDataExport
  };
};
