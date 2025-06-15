
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: 'load' | 'runtime' | 'network' | 'memory';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled = true;

  startTracking() {
    if (!this.isEnabled) return;

    // Surveiller les Core Web Vitals
    this.trackCoreWebVitals();
    
    // Surveiller la mémoire
    this.trackMemoryUsage();
    
    // Surveiller les erreurs
    this.trackErrors();
  }

  private trackCoreWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.addMetric({
          name: 'FCP',
          value: entry.startTime,
          timestamp: new Date(),
          category: 'load'
        });
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.addMetric({
          name: 'LCP',
          value: entry.startTime,
          timestamp: new Date(),
          category: 'load'
        });
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.addMetric({
          name: 'JS_Heap_Used',
          value: memory.usedJSHeapSize / 1024 / 1024, // MB
          timestamp: new Date(),
          category: 'memory'
        });
      }, 30000); // Toutes les 30 secondes
    }
  }

  private trackErrors() {
    window.addEventListener('error', (event) => {
      this.addMetric({
        name: 'JS_Error',
        value: 1,
        timestamp: new Date(),
        category: 'runtime'
      });
      
      console.error('Performance Monitor - JS Error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.addMetric({
        name: 'Promise_Rejection',
        value: 1,
        timestamp: new Date(),
        category: 'runtime'
      });
      
      console.error('Performance Monitor - Unhandled Promise:', event.reason);
    });
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Garder seulement les 1000 dernières métriques
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Envoyer les métriques critiques immédiatement
    if (this.isCriticalMetric(metric)) {
      this.sendCriticalAlert(metric);
    }
  }

  private isCriticalMetric(metric: PerformanceMetric): boolean {
    switch (metric.name) {
      case 'LCP':
        return metric.value > 4000; // > 4 secondes
      case 'JS_Heap_Used':
        return metric.value > 100; // > 100 MB
      default:
        return false;
    }
  }

  private sendCriticalAlert(metric: PerformanceMetric) {
    console.warn(`🚨 Performance Alert: ${metric.name} = ${metric.value}`);
    
    // En production, envoyer à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/monitoring/alert', { ... })
    }
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  disable() {
    this.isEnabled = false;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Démarrer automatiquement le monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startTracking();
}
