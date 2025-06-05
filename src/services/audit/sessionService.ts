
import { supabase } from '@/integrations/supabase/client';

export class SessionService {
  private sessionId: string | null = null;

  generateSessionId(): string {
    this.sessionId = crypto.randomUUID();
    return this.sessionId;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

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
}
