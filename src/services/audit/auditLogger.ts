
import { supabase } from '@/integrations/supabase/client';
import { AuditLogData, AuditLogFilters, RequestMetadata } from './types';

export class AuditLogger {
  private sessionId: string | null = null;

  setSessionId(sessionId: string | null): void {
    this.sessionId = sessionId;
  }

  private getRequestMetadata(): RequestMetadata {
    return {
      ip_address: null, // Sera rempli côté serveur
      user_agent: navigator.userAgent,
      session_id: this.sessionId,
      request_id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }

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
    } catch (error) {
      console.error('Erreur audit logger:', error);
    }
  }

  async getLogs(filters: AuditLogFilters = {}) {
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
}
