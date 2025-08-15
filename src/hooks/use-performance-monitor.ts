import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorRate: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error';
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
}

const PERFORMANCE_THRESHOLDS = {
  loadTime: 3000, // 3 seconds
  renderTime: 100, // 100ms
  memoryUsage: 100, // 100MB
  networkLatency: 1000, // 1 second
  errorRate: 0.05 // 5%
};

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    errorRate: 0
  });
  
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);

  const measureLoadTime = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        setMetrics(prev => ({ ...prev, loadTime }));
        
        if (loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
          setAlerts(prev => [...prev, {
            type: 'warning',
            metric: 'loadTime',
            value: loadTime,
            threshold: PERFORMANCE_THRESHOLDS.loadTime,
            timestamp: new Date()
          }]);
        }
      }
    }
  }, []);

  const measureRenderTime = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, renderTime }));
      
      if (renderTime > PERFORMANCE_THRESHOLDS.renderTime) {
        setAlerts(prev => [...prev, {
          type: 'warning',
          metric: `renderTime_${componentName}`,
          value: renderTime,
          threshold: PERFORMANCE_THRESHOLDS.renderTime,
          timestamp: new Date()
        }]);
      }
    };
  }, []);

  const measureMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      if (memoryUsage > PERFORMANCE_THRESHOLDS.memoryUsage) {
        setAlerts(prev => [...prev, {
          type: 'error',
          metric: 'memoryUsage',
          value: memoryUsage,
          threshold: PERFORMANCE_THRESHOLDS.memoryUsage,
          timestamp: new Date()
        }]);
      }
    }
  }, []);

  const measureNetworkLatency = useCallback(async (url: string) => {
    const startTime = performance.now();
    try {
      await fetch(url, { method: 'HEAD' });
      const latency = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, networkLatency: latency }));
      
      if (latency > PERFORMANCE_THRESHOLDS.networkLatency) {
        setAlerts(prev => [...prev, {
          type: 'warning',
          metric: 'networkLatency',
          value: latency,
          threshold: PERFORMANCE_THRESHOLDS.networkLatency,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Network latency measurement failed:', error);
    }
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  useEffect(() => {
    measureLoadTime();
    measureMemoryUsage();
    
    // Monitor memory usage every 30 seconds
    const memoryInterval = setInterval(measureMemoryUsage, 30000);
    
    return () => {
      clearInterval(memoryInterval);
    };
  }, [measureLoadTime, measureMemoryUsage]);

  return {
    metrics,
    alerts,
    measureRenderTime,
    measureNetworkLatency,
    clearAlerts
  };
};