
import { supabase } from "@/integrations/supabase/client";

export type EventType = 'page_view' | 'game' | 'quiz' | 'auth' | 'purchase' | 'social' | 'engagement';

export interface EventData {
  [key: string]: any;
}

export interface DeviceInfo {
  userAgent?: string;
  screenSize?: string;
  language?: string;
  platform?: string;
  [key: string]: any;
}

export interface TrackEventParams {
  eventType: EventType;
  eventName: string;
  userId?: string;
  eventData?: EventData;
  deviceInfo?: DeviceInfo;
}

/**
 * Service for tracking user events in the application
 */
export const eventTrackingService = {
  /**
   * Track a user event
   */
  async trackEvent({
    eventType,
    eventName,
    userId,
    eventData = {},
    deviceInfo = {}
  }: TrackEventParams) {
    try {
      // Add default device info if not provided
      if (!deviceInfo.userAgent && typeof window !== 'undefined') {
        deviceInfo = {
          ...deviceInfo,
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screenSize: `${window.innerWidth}x${window.innerHeight}`
        };
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          event_type: eventType,
          event_name: eventName,
          user_id: userId,
          event_data: eventData,
          device_info: deviceInfo
        });

      if (error) {
        console.error('Error tracking event:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to track event:', error);
      return false;
    }
  },

  /**
   * Get events by type
   */
  async getEventsByType(eventType: EventType, limit = 100) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_type', eventType)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  },

  /**
   * Get events for a specific user
   */
  async getUserEvents(userId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting user events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get user events:', error);
      return [];
    }
  }
};
