
import { supabase } from "@/integrations/supabase/client";
import { WiFiUser } from "@/types/portal";

export class UsersService {
  // Get WiFi users with optional limit and offset
  static async getWifiUsers(limit = 10, offset = 0): Promise<{ users: WiFiUser[], count: number }> {
    try {
      const { data: users, error } = await supabase
        .from('wifi_users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching WiFi users:', error);
        return { users: [], count: 0 };
      }

      const { count, error: countError } = await supabase
        .from('wifi_users')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error counting WiFi users:', countError);
      }

      return { users: users || [], count: count || 0 };
    } catch (error) {
      console.error('Failed to fetch WiFi users:', error);
      return { users: [], count: 0 };
    }
  }
}
