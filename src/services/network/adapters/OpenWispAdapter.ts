
import { NetworkAdapter, NetworkEquipment } from '../NetworkAdapterFactory';

export interface OpenWispConfig {
  baseUrl: string;
  apiToken: string;
  organization?: string;
  radiusSettings?: {
    radiusServer: string;
    radiusSecret: string;
    radiusPort: number;
  };
}

export class OpenWispAdapter implements NetworkAdapter {
  private equipment: NetworkEquipment;
  private config: OpenWispConfig;

  constructor(equipment: NetworkEquipment) {
    this.equipment = equipment;
    this.config = {
      baseUrl: equipment.credentials?.baseUrl || '',
      apiToken: equipment.credentials?.apiToken || '',
      organization: equipment.credentials?.organization,
      radiusSettings: equipment.credentials?.radiusSettings
    };
  }

  async authenticate(user: any): Promise<boolean> {
    try {
      console.log(`Authenticating user ${user.username} via OpenWisp`);
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenWisp API error: ${response.status}`);
      }

      const users = await response.json();
      const existingUser = users.results?.find((u: any) => u.username === user.username);
      
      return !!existingUser;
    } catch (error) {
      console.error('OpenWisp authentication failed:', error);
      return false;
    }
  }

  async authorizeUser(userId: string, sessionDuration: number): Promise<string> {
    try {
      console.log(`Authorizing user ${userId} for ${sessionDuration} seconds via OpenWisp`);
      
      const sessionData = {
        user_id: userId,
        duration: sessionDuration,
        start_time: new Date().toISOString(),
        organization: this.config.organization
      };

      const response = await fetch(`${this.config.baseUrl}/api/v1/radius/accounting/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        throw new Error(`OpenWisp authorization failed: ${response.status}`);
      }

      const result = await response.json();
      return result.session_id || `session_${Date.now()}_${userId}`;
    } catch (error) {
      console.error('OpenWisp authorization failed:', error);
      throw error;
    }
  }

  async disconnectUser(userId: string): Promise<boolean> {
    try {
      console.log(`Disconnecting user ${userId} from OpenWisp`);
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/radius/accounting/stop/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          stop_time: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('OpenWisp disconnect failed:', error);
      return false;
    }
  }

  async getActiveUsers(): Promise<any[]> {
    try {
      console.log('Fetching active users from OpenWisp');
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/radius/accounting/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenWisp API error: ${response.status}`);
      }

      const result = await response.json();
      return result.results || [];
    } catch (error) {
      console.error('Failed to fetch active users from OpenWisp:', error);
      return [];
    }
  }

  async getSessionInfo(sessionId: string): Promise<any> {
    try {
      console.log(`Fetching session info for ${sessionId} from OpenWisp`);
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/radius/accounting/${sessionId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenWisp API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch session info from OpenWisp:', error);
      return null;
    }
  }

  async updateUserBandwidth(userId: string, uploadKbps: number, downloadKbps: number): Promise<boolean> {
    try {
      console.log(`Updating bandwidth for user ${userId}: ${uploadKbps}/${downloadKbps} kbps`);
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bandwidth_limit_upload: uploadKbps,
          bandwidth_limit_download: downloadKbps
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update user bandwidth in OpenWisp:', error);
      return false;
    }
  }

  async getEquipmentStatus(): Promise<any> {
    try {
      console.log('Fetching equipment status from OpenWisp');
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/devices/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`OpenWisp API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        devices: result.results || [],
        total: result.count || 0,
        online: result.results?.filter((device: any) => device.status === 'up').length || 0
      };
    } catch (error) {
      console.error('Failed to fetch equipment status from OpenWisp:', error);
      return { devices: [], total: 0, online: 0 };
    }
  }

  async configurePortal(portalConfig: any): Promise<boolean> {
    try {
      console.log('Configuring captive portal in OpenWisp');
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/config/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: portalConfig.name || 'Captive Portal Config',
          backend: 'netjsonconfig.OpenWrt',
          config: {
            captive_portal: portalConfig
          },
          organization: this.config.organization
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to configure portal in OpenWisp:', error);
      return false;
    }
  }

  getSupportedFeatures(): string[] {
    return [
      'user_authentication',
      'session_management',
      'bandwidth_control',
      'device_monitoring',
      'captive_portal',
      'radius_accounting',
      'user_management',
      'organization_support',
      'api_integration',
      'real_time_monitoring'
    ];
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing OpenWisp connection');
      
      const response = await fetch(`${this.config.baseUrl}/api/v1/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('OpenWisp connection test failed:', error);
      return false;
    }
  }

  async configureConnection(): Promise<boolean> {
    try {
      console.log('Configuring OpenWisp connection');
      
      // Verify API token and organization
      const testResult = await this.testConnection();
      if (!testResult) {
        return false;
      }

      // Configure RADIUS settings if provided
      if (this.config.radiusSettings) {
        const radiusConfig = {
          radius_server: this.config.radiusSettings.radiusServer,
          radius_secret: this.config.radiusSettings.radiusSecret,
          radius_port: this.config.radiusSettings.radiusPort
        };

        const response = await fetch(`${this.config.baseUrl}/api/v1/config/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'RADIUS Configuration',
            backend: 'netjsonconfig.OpenWrt',
            config: { radius: radiusConfig },
            organization: this.config.organization
          })
        });

        return response.ok;
      }

      return true;
    } catch (error) {
      console.error('Failed to configure OpenWisp connection:', error);
      return false;
    }
  }
}
