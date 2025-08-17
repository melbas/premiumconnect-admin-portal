import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Alert {
  id: string;
  type: 'uptime' | 'qoe' | 'auth' | 'incident' | 'financial' | 'performance';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  data?: any;
  acknowledged: boolean;
  created_at: string;
  expires_at?: string;
}

export interface AlertRule {
  type: Alert['type'];
  condition: (data: any) => boolean;
  severity: Alert['severity'];
  title: string;
  message: (data: any) => string;
  cooldown_minutes?: number;
}

class AlertingService {
  private alertRules: AlertRule[] = [
    // Uptime alerts
    {
      type: 'uptime',
      condition: (data) => data.uptime < 99.9,
      severity: 'critical',
      title: 'SLA Breach - Uptime Critical',
      message: (data) => `Site ${data.site_id} uptime dropped to ${data.uptime}% (below 99.9% SLA threshold)`
    },
    
    // QoE alerts
    {
      type: 'qoe',
      condition: (data) => data.qoe_score < 70,
      severity: 'high',
      title: 'QoE Score Critical',
      message: (data) => `Site ${data.site_id} QoE score dropped to ${data.qoe_score} (below 70 threshold)`
    },
    {
      type: 'qoe',
      condition: (data) => data.qoe_drop && data.qoe_drop > 10,
      severity: 'high',
      title: 'QoE Score Rapid Decline',
      message: (data) => `Site ${data.site_id} QoE score dropped by ${data.qoe_drop} points in 30 minutes`
    },
    
    // Auth funnel alerts
    {
      type: 'auth',
      condition: (data) => data.success_rate < 80,
      severity: 'high',
      title: 'Authentication Success Rate Low',
      message: (data) => `${data.auth_method} authentication success rate dropped to ${data.success_rate}% (below 80% threshold)`
    },
    
    // Incident alerts
    {
      type: 'incident',
      condition: (data) => data.sla_breached || (data.eta && new Date(data.eta) < new Date()),
      severity: 'critical',
      title: 'Incident SLA Breach',
      message: (data) => `Incident ${data.incident_id} has breached SLA (${data.mttr_minutes || 'N/A'} minutes elapsed)`
    },
    {
      type: 'incident',
      condition: (data) => {
        const timeSinceUpdate = Date.now() - new Date(data.last_update_at).getTime();
        return timeSinceUpdate > 30 * 60 * 1000; // 30 minutes
      },
      severity: 'medium',
      title: 'Incident Requires Update',
      message: (data) => `Incident ${data.incident_id} has not been updated in over 30 minutes`
    },
    
    // Financial alerts
    {
      type: 'financial',
      condition: (data) => data.churn_mrr > data.expansion_mrr,
      severity: 'high',
      title: 'Negative MRR Growth',
      message: (data) => `Churn MRR (${data.churn_mrr.toLocaleString()} FCFA) exceeds Expansion MRR (${data.expansion_mrr.toLocaleString()} FCFA) over 7-day period`
    },
    {
      type: 'financial',
      condition: (data) => data.nrr_percentage < 100,
      severity: 'high',
      title: 'NRR Below Target',
      message: (data) => `Net Revenue Retention dropped to ${data.nrr_percentage}% (below 100% threshold)`
    },
    {
      type: 'financial',
      condition: (data) => data.arpu_decline >= 5,
      severity: 'medium',
      title: 'ARPU Decline Alert',
      message: (data) => `ARPU declined by ${data.arpu_decline}% month-over-month (threshold: 5%)`
    }
  ];

  private recentAlerts: Map<string, number> = new Map();
  private alertSubscriptions: Array<(alert: Alert) => void> = [];

  // Check data against alert rules
  async checkAlerts(type: Alert['type'], data: any): Promise<Alert[]> {
    const triggeredAlerts: Alert[] = [];
    
    const relevantRules = this.alertRules.filter(rule => rule.type === type);
    
    for (const rule of relevantRules) {
      try {
        if (rule.condition(data)) {
          // Check cooldown
          const alertKey = `${type}-${rule.title}-${JSON.stringify(data)}`;
          const lastTriggered = this.recentAlerts.get(alertKey);
          const cooldownMs = (rule.cooldown_minutes || 15) * 60 * 1000;
          
          if (lastTriggered && (Date.now() - lastTriggered) < cooldownMs) {
            continue; // Skip due to cooldown
          }
          
          const alert: Alert = {
            id: crypto.randomUUID(),
            type: rule.type,
            severity: rule.severity,
            title: rule.title,
            message: rule.message(data),
            data,
            acknowledged: false,
            created_at: new Date().toISOString()
          };
          
          triggeredAlerts.push(alert);
          this.recentAlerts.set(alertKey, Date.now());
          
          // Notify subscribers
          this.alertSubscriptions.forEach(callback => callback(alert));
          
          // Show toast notification
          this.showToastNotification(alert);
        }
      } catch (error) {
        console.error('Error checking alert rule:', rule.title, error);
      }
    }
    
    return triggeredAlerts;
  }

  // Show toast notification based on alert severity
  private showToastNotification(alert: Alert): void {
    const variant = alert.severity === 'critical' ? 'destructive' : 
                   alert.severity === 'high' ? 'destructive' :
                   'default';
    
    toast({
      title: alert.title,
      description: alert.message,
      variant,
      duration: alert.severity === 'critical' ? 0 : 5000 // Critical alerts stay until dismissed
    });
  }

  // Subscribe to alert notifications
  onAlert(callback: (alert: Alert) => void): () => void {
    this.alertSubscriptions.push(callback);
    
    return () => {
      const index = this.alertSubscriptions.indexOf(callback);
      if (index > -1) {
        this.alertSubscriptions.splice(index, 1);
      }
    };
  }

  // Get recent alerts from storage/database
  async getRecentAlerts(hours = 24): Promise<Alert[]> {
    try {
      // In a real implementation, this would fetch from a database
      // For now, return empty array as we don't have an alerts table
      return [];
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      return [];
    }
  }

  // Acknowledge an alert
  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      // In a real implementation, this would update the database
      console.log('Alert acknowledged:', alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }

  // Add custom alert rule
  addCustomRule(rule: AlertRule): void {
    this.alertRules.push(rule);
  }

  // Remove alert rule
  removeRule(type: Alert['type'], title: string): void {
    this.alertRules = this.alertRules.filter(
      rule => !(rule.type === type && rule.title === title)
    );
  }

  // Clear cooldowns (for testing)
  clearCooldowns(): void {
    this.recentAlerts.clear();
  }

  // Get alert statistics
  getAlertStats(): {
    total_rules: number;
    rules_by_type: Record<Alert['type'], number>;
    recent_alerts: number;
  } {
    const rules_by_type = this.alertRules.reduce((acc, rule) => {
      acc[rule.type] = (acc[rule.type] || 0) + 1;
      return acc;
    }, {} as Record<Alert['type'], number>);
    
    return {
      total_rules: this.alertRules.length,
      rules_by_type,
      recent_alerts: this.recentAlerts.size
    };
  }

  // Simulate test alerts (for development)
  async triggerTestAlert(type: Alert['type']): Promise<void> {
    const testData = {
      uptime: { site_id: 'TEST-001', uptime: 98.5 },
      qoe: { site_id: 'TEST-001', qoe_score: 65, qoe_drop: 15 },
      auth: { auth_method: 'sms', success_rate: 75 },
      incident: { 
        incident_id: 'INC-TEST-001', 
        sla_breached: true, 
        mttr_minutes: 300,
        last_update_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      financial: { 
        churn_mrr: 500000, 
        expansion_mrr: 300000, 
        nrr_percentage: 95,
        arpu_decline: 7
      },
      performance: { cpu_usage: 95, memory_usage: 90 }
    };
    
    await this.checkAlerts(type, testData[type]);
  }
}

export const alertingService = new AlertingService();
export default alertingService;