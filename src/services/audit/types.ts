
export interface AuditLogData {
  admin_user_id: string;
  action_type: string;
  action_description: string;
  target_entity?: string;
  target_id?: string;
  previous_data?: any;
  new_data?: any;
  criticality?: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityAlertData {
  alert_type: string;
  severity: 'info' | 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  admin_user_id?: string;
  metadata?: any;
}

export interface AuditLogFilters {
  adminUserId?: string;
  actionType?: string;
  startDate?: string;
  endDate?: string;
  criticality?: string;
  limit?: number;
  offset?: number;
}

export interface RequestMetadata {
  ip_address: string | null;
  user_agent: string;
  session_id: string | null;
  request_id: string;
  timestamp: string;
}
