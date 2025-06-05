
import { supabase } from '@/integrations/supabase/client';
import { SecurityAlertData } from './types';

export class SecurityAlertsService {
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
}
