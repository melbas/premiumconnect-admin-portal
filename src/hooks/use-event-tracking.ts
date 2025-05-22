
import { useCallback, useEffect } from 'react';
import { eventTrackingService, EventType, EventData } from '@/services/eventTrackingService';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook for tracking user events
 */
export const useEventTracking = () => {
  const { user } = useAuth();

  // Track a custom event
  const trackEvent = useCallback((
    eventType: EventType,
    eventName: string,
    eventData?: EventData
  ) => {
    return eventTrackingService.trackEvent({
      eventType,
      eventName,
      userId: user?.id,
      eventData
    });
  }, [user]);

  // Track a page view
  const trackPageView = useCallback((pageName: string, pageData?: EventData) => {
    return trackEvent('page_view', pageName, pageData);
  }, [trackEvent]);

  // Track a game event
  const trackGameEvent = useCallback((gameName: string, action: string, gameData?: EventData) => {
    return trackEvent('game', `${gameName}_${action}`, {
      ...gameData,
      action
    });
  }, [trackEvent]);

  // Track component mount as page view
  const usePageViewTracking = (pageName: string, pageData?: EventData) => {
    useEffect(() => {
      trackPageView(pageName, pageData);
    }, [pageName]); // eslint-disable-line react-hooks/exhaustive-deps
  };

  return {
    trackEvent,
    trackPageView,
    trackGameEvent,
    usePageViewTracking
  };
};
