
import { supabase } from "@/integrations/supabase/client";
import { WiFiSession } from "@/types/portal";

export class SessionsService {
  // Get WiFi sessions with optional limit and offset
  static async getWifiSessions(limit = 10, offset = 0): Promise<{ sessions: WiFiSession[], count: number }> {
    try {
      const { data: sessions, error } = await supabase
        .from('wifi_sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching WiFi sessions:', error);
        return { sessions: [], count: 0 };
      }

      const { count, error: countError } = await supabase
        .from('wifi_sessions')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error counting WiFi sessions:', countError);
      }

      return { sessions: sessions || [], count: count || 0 };
    } catch (error) {
      console.error('Failed to fetch WiFi sessions:', error);
      return { sessions: [], count: 0 };
    }
  }
}
