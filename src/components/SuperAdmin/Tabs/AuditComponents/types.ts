
export interface AuditLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  action_description: string;
  target_entity?: string;
  target_id?: string;
  previous_data?: any;
  new_data?: any;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  user_agent?: string;
  ip_address?: string;
}

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  admin_user_id?: string;
  is_resolved: boolean;
  created_at: string;
}

export interface AuditStats {
  totalActions: number;
  criticalActions: number;
  activeUsers: number;
  recentAlerts: number;
}

export interface AuditFiltersState {
  search: string;
  actionType: string;
  criticality: string;
  startDate: string;
  endDate: string;
  adminUserId: string;
}
