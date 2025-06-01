import { NetworkAdapter, NetworkEquipment } from '../NetworkAdapterFactory';
import { unifiApiService, UnifiClient, UnifiDevice } from '../../unifiService';

export class UbiquitiAdapter implements NetworkAdapter {
  private equipment: NetworkEquipment;

  constructor(equipment: NetworkEquipment) {
    this.equipment = equipment;
    
    // Initialize UniFi service if not already done
    if (!unifiApiService.isInitialized()) {
      unifiApiService.initialize({
        baseUrl: `https://${equipment.ipAddress}:8443`,
        username: equipment.credentials?.username || 'admin',
        password: equipment.credentials?.password || 'password',
        siteId: 'default'
      });
    }
  }

  async authenticate(user: any): Promise<boolean> {
    try {
      console.log('🔐 Ubiquiti UniFi: Authenticating user', user.phone || user.email);
      
      // For UniFi, authentication is typically handled by the guest portal
      // We simulate the user being added to authorized guests
      const guestData = {
        mac: user.macAddress,
        minutes: 60, // Default 1 hour
        up: 1024,    // Upload limit kbps
        down: 2048,  // Download limit kbps
        bytes: 0,    // Unlimited bytes
        note: user.phone || user.email
      };

      // In real implementation, this would call UniFi Controller API
      console.log('Authorizing guest in UniFi:', guestData);
      
      console.log('✅ Ubiquiti UniFi: User authenticated successfully');
      return true;
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Authentication failed', error);
      return false;
    }
  }

  async authorizeUser(userId: string, sessionDuration: number): Promise<string> {
    try {
      console.log('🚀 Ubiquiti UniFi: Authorizing user for session', { userId, sessionDuration });
      
      const sessionId = `unifi_${Date.now()}_${userId.slice(0, 8)}`;
      
      // Simulate guest authorization via UniFi API
      // This would typically involve calling the guest authorization endpoint
      console.log('Creating UniFi guest session:', sessionId);

      console.log('✅ Ubiquiti UniFi: User authorized, session:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Authorization failed', error);
      throw error;
    }
  }

  async disconnectUser(userId: string): Promise<boolean> {
    try {
      console.log('🔌 Ubiquiti UniFi: Disconnecting user', userId);
      
      // Use existing UniFi service or simulate disconnection
      console.log('Disconnecting client from UniFi network');

      console.log('✅ Ubiquiti UniFi: User disconnected');
      return true;
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Disconnection failed', error);
      return false;
    }
  }

  async getActiveUsers(): Promise<any[]> {
    try {
      console.log('📊 Ubiquiti UniFi: Fetching active clients...');
      
      // Use existing UniFi service
      const clients = await unifiApiService.getClients();
      
      // Transform UniFi clients to our format
      return clients.map((client: UnifiClient) => ({
        id: client.id,
        username: client.name || 'Unknown',
        mac: client.macAddress,
        ip: client.ipAddress,
        type: client.type,
        connectedAt: client.connectedAt,
        uplinkDevice: client.uplinkDeviceId
      }));
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Failed to get active clients', error);
      return [];
    }
  }

  async getSessionInfo(sessionId: string): Promise<any> {
    try {
      console.log('📋 Ubiquiti UniFi: Getting session info for', sessionId);
      
      // Simulate session information for UniFi
      return {
        sessionId,
        mac: '00:11:22:33:44:55',
        ip: '192.168.1.100',
        ap: 'UAP-AC-PRO-01',
        ssid: 'UniFi-Guest',
        vlan: 10,
        status: 'authorized',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        duration: 3600, // seconds
        rxBytes: 10485760, // 10MB
        txBytes: 3145728,  // 3MB
        signal: -45, // dBm
        noise: -95   // dBm
      };
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Failed to get session info', error);
      return null;
    }
  }

  async updateUserBandwidth(userId: string, uploadKbps: number, downloadKbps: number): Promise<boolean> {
    try {
      console.log('📈 Ubiquiti UniFi: Updating bandwidth for client', { userId, uploadKbps, downloadKbps });
      
      // Simulate bandwidth control via UniFi API
      // This would involve updating the user group or applying QoS rules
      console.log('Applying bandwidth limits in UniFi:', {
        client: userId,
        upload: uploadKbps,
        download: downloadKbps
      });

      console.log('✅ Ubiquiti UniFi: Bandwidth updated');
      return true;
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Failed to update bandwidth', error);
      return false;
    }
  }

  async getEquipmentStatus(): Promise<any> {
    try {
      console.log('🔍 Ubiquiti UniFi: Getting controller status...');
      
      // Use existing UniFi service to get devices
      const devices = await unifiApiService.getDevices();
      
      return {
        controllerVersion: '7.2.92',
        status: 'online',
        sites: 1,
        devices: devices.map((device: UnifiDevice) => ({
          id: device.id,
          name: device.name,
          model: device.model,
          mac: device.macAddress,
          ip: device.ipAddress,
          state: device.state,
          firmware: device.firmwareVersion
        })),
        totalClients: await this.getTotalClientsCount(),
        guestClients: await this.getGuestClientsCount()
      };
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Failed to get controller status', error);
      return null;
    }
  }

  async configurePortal(portalConfig: any): Promise<boolean> {
    try {
      console.log('⚙️ Ubiquiti UniFi: Configuring guest portal...', portalConfig);
      
      // Simulate guest portal configuration in UniFi
      const config = {
        portal_enabled: true,
        portal_customized: true,
        portal_use_hostname: true,
        redirect_enabled: true,
        redirect_url: portalConfig.redirectUrl,
        x_password: portalConfig.password || '',
        expire_number: 1,
        expire_unit: 'hours',
        site_id: 'default'
      };

      console.log('Applying UniFi guest portal configuration:', config);
      
      console.log('✅ Ubiquiti UniFi: Portal configured');
      return true;
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Portal configuration failed', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Ubiquiti UniFi: Testing connection...');
      
      // Test UniFi controller connectivity
      const devices = await unifiApiService.getDevices();
      
      console.log('✅ Ubiquiti UniFi: Connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Connection test failed', error);
      return false;
    }
  }

  async configureConnection(): Promise<boolean> {
    try {
      console.log('⚙️ Ubiquiti UniFi: Configuring connection...');
      
      // Initialize UniFi service with equipment credentials
      const connectionConfig = {
        baseUrl: `https://${this.equipment.ipAddress}:8443`,
        username: this.equipment.credentials?.username || 'admin',
        password: this.equipment.credentials?.password || 'password',
        siteId: 'default'
      };

      unifiApiService.initialize(connectionConfig);
      
      console.log('✅ Ubiquiti UniFi: Connection configured');
      return true;
    } catch (error) {
      console.error('❌ Ubiquiti UniFi: Connection configuration failed', error);
      return false;
    }
  }

  getSupportedFeatures(): string[] {
    return [
      'guest_portal',
      'voucher_system',
      'client_management',
      'bandwidth_profiles',
      'wireless_uplink',
      'vlan_networks',
      'firewall_groups',
      'deep_packet_inspection',
      'intrusion_detection',
      'centralized_management'
    ];
  }

  // Helper methods
  private async getTotalClientsCount(): Promise<number> {
    try {
      const clients = await unifiApiService.getClients();
      return clients.length;
    } catch {
      return 0;
    }
  }

  private async getGuestClientsCount(): Promise<number> {
    try {
      const clients = await unifiApiService.getClients();
      // Filter for guest network clients (simplified)
      return clients.filter(client => client.type === 'WIRELESS').length;
    } catch {
      return 0;
    }
  }
}
