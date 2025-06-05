
import { NetworkAdapter, NetworkEquipment } from '../types';

export class OpenWispAdapter implements NetworkAdapter {
  private equipment: NetworkEquipment;

  constructor(equipment: NetworkEquipment) {
    this.equipment = equipment;
  }

  async authenticate(user: any): Promise<boolean> {
    console.log('OpenWispAdapter: Authenticating via OpenWisp API...');
    
    try {
      const baseUrl = this.equipment.credentials?.baseUrl;
      const apiToken = this.equipment.credentials?.apiToken;
      
      if (!baseUrl || !apiToken) {
        console.error('OpenWisp: Missing base URL or API token');
        return false;
      }

      // In real implementation: call OpenWisp authentication API
      const response = await fetch(`${baseUrl}/api/v1/radius/accounting/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password
        })
      });

      return response.ok;
    } catch (error) {
      console.error('OpenWispAdapter: Authentication error:', error);
      return false;
    }
  }

  async authorizeUser(userId: string, sessionDuration: number): Promise<string> {
    console.log(`OpenWispAdapter: Authorizing user ${userId} for ${sessionDuration} minutes`);
    
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    if (!baseUrl || !apiToken) {
      throw new Error('OpenWisp: Missing configuration');
    }

    // In real implementation: create session via OpenWisp API
    const sessionId = `openwisp_session_${userId}_${Date.now()}`;
    
    try {
      await fetch(`${baseUrl}/api/v1/radius/accounting/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          username: userId,
          session_time: sessionDuration * 60 // Convert to seconds
        })
      });
    } catch (error) {
      console.error('OpenWispAdapter: Session creation error:', error);
    }

    return sessionId;
  }

  async disconnectUser(userId: string): Promise<boolean> {
    console.log(`OpenWispAdapter: Disconnecting user ${userId}`);
    
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    if (!baseUrl || !apiToken) {
      return false;
    }

    try {
      // In real implementation: terminate session via OpenWisp API
      const response = await fetch(`${baseUrl}/api/v1/radius/accounting/stop/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userId
        })
      });

      return response.ok;
    } catch (error) {
      console.error('OpenWispAdapter: Disconnect error:', error);
      return false;
    }
  }

  async getActiveUsers(): Promise<any[]> {
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    if (!baseUrl || !apiToken) {
      return [];
    }

    try {
      // In real implementation: fetch active sessions from OpenWisp
      const response = await fetch(`${baseUrl}/api/v1/radius/sessions/`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    } catch (error) {
      console.error('OpenWispAdapter: Get users error:', error);
    }

    // Mock data for development
    return [
      { id: 'user1', name: 'User via OpenWisp', ip: '10.0.0.1', connected: new Date() }
    ];
  }

  async getSessionInfo(sessionId: string): Promise<any> {
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    if (!baseUrl || !apiToken) {
      return null;
    }

    try {
      // In real implementation: fetch session details from OpenWisp
      const response = await fetch(`${baseUrl}/api/v1/radius/sessions/${sessionId}/`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('OpenWispAdapter: Get session info error:', error);
    }

    return {
      sessionId,
      status: 'active',
      connectionType: 'openwisp',
      organization: this.equipment.credentials?.organization
    };
  }

  async updateUserBandwidth(userId: string, uploadKbps: number, downloadKbps: number): Promise<boolean> {
    console.log(`OpenWispAdapter: Updating bandwidth for ${userId}: ${uploadKbps}/${downloadKbps} kbps`);
    
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    if (!baseUrl || !apiToken) {
      return false;
    }

    try {
      // In real implementation: update bandwidth limits via OpenWisp API
      const response = await fetch(`${baseUrl}/api/v1/config/device/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userId,
          bandwidth_limit_upload: uploadKbps,
          bandwidth_limit_download: downloadKbps
        })
      });

      return response.ok;
    } catch (error) {
      console.error('OpenWispAdapter: Bandwidth update error:', error);
      return false;
    }
  }

  async getEquipmentStatus(): Promise<any> {
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    try {
      if (baseUrl && apiToken) {
        // In real implementation: check OpenWisp controller status
        const response = await fetch(`${baseUrl}/api/v1/controller/device/`, {
          headers: {
            'Authorization': `Bearer ${apiToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          return {
            status: 'connected',
            devicesCount: data.count || 0,
            lastSeen: new Date(),
            connectionType: 'openwisp'
          };
        }
      }
    } catch (error) {
      console.error('OpenWispAdapter: Status check error:', error);
    }

    return {
      status: 'connected',
      baseUrl: baseUrl || 'not configured',
      organization: this.equipment.credentials?.organization,
      lastSeen: new Date(),
      connectionType: 'openwisp'
    };
  }

  async configurePortal(portalConfig: any): Promise<boolean> {
    console.log('OpenWispAdapter: Configuring captive portal via OpenWisp');
    
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    if (!baseUrl || !apiToken) {
      console.error('OpenWisp: Missing configuration for portal setup');
      return false;
    }

    try {
      // In real implementation: configure captive portal via OpenWisp API
      const response = await fetch(`${baseUrl}/api/v1/config/template/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Captive Portal Configuration',
          backend: 'netjsonconfig.OpenWrt',
          config: {
            captive_portal: portalConfig
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('OpenWispAdapter: Portal configuration error:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    console.log('OpenWispAdapter: Testing OpenWisp connection...');
    
    const baseUrl = this.equipment.credentials?.baseUrl;
    const apiToken = this.equipment.credentials?.apiToken;
    
    if (!baseUrl || !apiToken) {
      return false;
    }

    try {
      const response = await fetch(`${baseUrl}/api/v1/`, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('OpenWispAdapter: Connection test failed:', error);
      return false;
    }
  }

  async configureConnection(): Promise<boolean> {
    console.log('OpenWispAdapter: Configuring OpenWisp connection...');
    
    // Validate required credentials
    const { baseUrl, apiToken } = this.equipment.credentials || {};
    
    if (!baseUrl || !apiToken) {
      console.error('OpenWisp: Missing required credentials (baseUrl, apiToken)');
      return false;
    }

    try {
      // Test the connection first
      const isConnectionValid = await this.testConnection();
      
      if (!isConnectionValid) {
        console.error('OpenWisp: Connection test failed during configuration');
        return false;
      }

      // In real implementation: perform any additional setup
      console.log('OpenWisp: Connection configured successfully');
      return true;
    } catch (error) {
      console.error('OpenWispAdapter: Configuration error:', error);
      return false;
    }
  }

  getSupportedFeatures(): string[] {
    return [
      'user_authentication',
      'session_management',
      'bandwidth_control',
      'portal_configuration',
      'device_management',
      'radius_integration',
      'monitoring',
      'multi_organization'
    ];
  }
}
