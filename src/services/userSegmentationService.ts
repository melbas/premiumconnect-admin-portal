
import { supabase } from "@/integrations/supabase/client";

export interface UserSegment {
  id: string;
  name: string;
  description?: string;
  criteria: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface UserSegmentMembership {
  id: string;
  user_id: string;
  segment_id: string;
  created_at?: string;
}

/**
 * Service for managing user segmentation
 */
export const userSegmentationService = {
  /**
   * Get all defined user segments
   */
  async getAllSegments(): Promise<UserSegment[]> {
    try {
      const { data, error } = await supabase
        .from('user_segments')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching segments:', error);
        return [];
      }

      return (data || []).map(segment => ({
        ...segment,
        criteria: typeof segment.criteria === 'string' 
          ? JSON.parse(segment.criteria) 
          : segment.criteria || {}
      }));
    } catch (error) {
      console.error('Failed to fetch segments:', error);
      return [];
    }
  },

  /**
   * Create a new user segment
   */
  async createSegment(segment: Omit<UserSegment, 'id' | 'created_at' | 'updated_at'>): Promise<UserSegment | null> {
    try {
      const { data, error } = await supabase
        .from('user_segments')
        .insert(segment)
        .select()
        .single();

      if (error) {
        console.error('Error creating segment:', error);
        return null;
      }

      return data ? {
        ...data,
        criteria: typeof data.criteria === 'string' 
          ? JSON.parse(data.criteria) 
          : data.criteria || {}
      } : null;
    } catch (error) {
      console.error('Failed to create segment:', error);
      return null;
    }
  },

  /**
   * Update an existing user segment
   */
  async updateSegment(id: string, segment: Partial<Omit<UserSegment, 'id' | 'created_at' | 'updated_at'>>): Promise<UserSegment | null> {
    try {
      const { data, error } = await supabase
        .from('user_segments')
        .update({ ...segment, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating segment:', error);
        return null;
      }

      return data ? {
        ...data,
        criteria: typeof data.criteria === 'string' 
          ? JSON.parse(data.criteria) 
          : data.criteria || {}
      } : null;
    } catch (error) {
      console.error('Failed to update segment:', error);
      return null;
    }
  },

  /**
   * Delete a user segment
   */
  async deleteSegment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_segments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting segment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete segment:', error);
      return false;
    }
  },

  /**
   * Get users in a specific segment
   */
  async getUsersInSegment(segmentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_segment_memberships')
        .select('wifi_users(*)')
        .eq('segment_id', segmentId);

      if (error) {
        console.error('Error fetching users in segment:', error);
        return [];
      }

      return (data || []).map(item => item.wifi_users);
    } catch (error) {
      console.error('Failed to fetch users in segment:', error);
      return [];
    }
  },

  /**
   * Add a user to a segment
   */
  async addUserToSegment(userId: string, segmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_segment_memberships')
        .insert({
          user_id: userId,
          segment_id: segmentId
        });

      if (error) {
        console.error('Error adding user to segment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to add user to segment:', error);
      return false;
    }
  },

  /**
   * Remove a user from a segment
   */
  async removeUserFromSegment(userId: string, segmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_segment_memberships')
        .delete()
        .eq('user_id', userId)
        .eq('segment_id', segmentId);

      if (error) {
        console.error('Error removing user from segment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to remove user from segment:', error);
      return false;
    }
  }
};
