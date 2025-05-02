
import { toast } from "@/hooks/use-toast";

// Types for UniFi API responses
export interface UnifiSite {
  id: string;
  name: string;
  desc?: string;
  role?: string;
}

export interface UnifiDevice {
  id: string;
  name?: string;
  model?: string;
  macAddress: string;
  ipAddress?: string;
  state: 'ONLINE' | 'OFFLINE' | 'PROVISIONING';
  firmwareVersion?: string;
  uplink?: {
    deviceId?: string;
  };
}

export interface UnifiDeviceStatistics {
  uptimeSec: number;
  lastHeartbeatAt: string;
  cpuUtilizationPct: number;
  memoryUtilizationPct: number;
  txRateBps: number;
  rxRateBps: number;
}

export interface UnifiClient {
  id: string;
  name?: string;
  connectedAt: string;
  ipAddress?: string;
  type: 'WIRED' | 'WIRELESS';
  macAddress: string;
  uplinkDeviceId?: string;
}

export interface UnifiVoucher {
  id: string;
  createdAt: string;
  name?: string;
  code: string;
  authorizeGuestLimit: number;
  authorizedGuestCount: number;
  activeAt?: string;
  expiresAt?: string;
  expired: boolean;
  timeLimitMinutes?: number;
  dataUsageLimitMBytes?: number;
  rxRateLimitKBps?: number;
  txRateLimitKBps?: number;
}

// Configuration for UniFi API
export interface UnifiApiConfig {
  baseUrl: string;
  username: string;
  password: string;
  siteId?: string; // Default site ID
}

// Singleton class for UniFi API interactions
class UnifiApiService {
  private config: UnifiApiConfig | null = null;
  private authToken: string | null = null;
  
  // For demo/development purposes, use mock data when no real API is connected
  private useMockData = true;

  // Initialize with configuration
  public initialize(config: UnifiApiConfig): void {
    this.config = config;
    this.authToken = null;
    this.useMockData = false;
    // In a real app, we would authenticate here
    // this.authenticate();
  }

  // Check if service is initialized
  public isInitialized(): boolean {
    return !!this.config;
  }

  // Get all sites
  public async getSites(): Promise<UnifiSite[]> {
    if (this.useMockData) {
      return this.getMockSites();
    }

    try {
      // Would normally make an API call like:
      // const response = await fetch(`${this.config?.baseUrl}/v1/sites`, {
      //   headers: { Authorization: `Bearer ${this.authToken}` }
      // });
      // return await response.json();
      
      return this.getMockSites();
    } catch (error) {
      this.handleError('Failed to fetch sites', error);
      return [];
    }
  }

  // Get devices for a site
  public async getDevices(siteId?: string): Promise<UnifiDevice[]> {
    if (this.useMockData) {
      return this.getMockDevices();
    }

    const site = siteId || this.config?.siteId;
    if (!site) {
      this.handleError('No site ID provided');
      return [];
    }

    try {
      // Would normally make an API call
      return this.getMockDevices();
    } catch (error) {
      this.handleError('Failed to fetch devices', error);
      return [];
    }
  }

  // Get statistics for a device
  public async getDeviceStatistics(deviceId: string, siteId?: string): Promise<UnifiDeviceStatistics | null> {
    if (this.useMockData) {
      return this.getMockDeviceStatistics(deviceId);
    }

    const site = siteId || this.config?.siteId;
    if (!site) {
      this.handleError('No site ID provided');
      return null;
    }

    try {
      // Would normally make an API call
      return this.getMockDeviceStatistics(deviceId);
    } catch (error) {
      this.handleError('Failed to fetch device statistics', error);
      return null;
    }
  }

  // Get clients for a site
  public async getClients(siteId?: string): Promise<UnifiClient[]> {
    if (this.useMockData) {
      return this.getMockClients();
    }

    const site = siteId || this.config?.siteId;
    if (!site) {
      this.handleError('No site ID provided');
      return [];
    }

    try {
      // Would normally make an API call
      return this.getMockClients();
    } catch (error) {
      this.handleError('Failed to fetch clients', error);
      return [];
    }
  }

  // Execute action on a device (e.g., restart)
  public async executeDeviceAction(deviceId: string, action: string, siteId?: string): Promise<boolean> {
    if (this.useMockData) {
      // Simulate success for mock data
      toast({
        title: "Action exécutée",
        description: `Action ${action} exécutée sur l'appareil ${deviceId}`,
      });
      return true;
    }

    const site = siteId || this.config?.siteId;
    if (!site) {
      this.handleError('No site ID provided');
      return false;
    }

    try {
      // Would normally make an API call
      toast({
        title: "Action exécutée",
        description: `Action ${action} exécutée sur l'appareil ${deviceId}`,
      });
      return true;
    } catch (error) {
      this.handleError(`Failed to execute action ${action}`, error);
      return false;
    }
  }

  // Get vouchers for a site
  public async getVouchers(siteId?: string): Promise<UnifiVoucher[]> {
    if (this.useMockData) {
      return this.getMockVouchers();
    }

    const site = siteId || this.config?.siteId;
    if (!site) {
      this.handleError('No site ID provided');
      return [];
    }

    try {
      // Would normally make an API call
      return this.getMockVouchers();
    } catch (error) {
      this.handleError('Failed to fetch vouchers', error);
      return [];
    }
  }

  // Private helper method to handle errors
  private handleError(message: string, error?: any): void {
    console.error(`UniFi API Error: ${message}`, error);
    toast({
      title: "Erreur API UniFi",
      description: message,
      variant: "destructive",
    });
  }

  // Mock data methods for development/demo purposes
  private getMockSites(): UnifiSite[] {
    return [
      { id: 'site1', name: 'Dakar Central', desc: 'Site principal de Dakar' },
      { id: 'site2', name: 'Thiès Ouest', desc: 'Site secondaire à Thiès' },
      { id: 'site3', name: 'Saint-Louis Port', desc: 'Point d\'accès du port' },
      { id: 'site4', name: 'Touba Résidentiel', desc: 'Réseau résidentiel' },
      { id: 'site5', name: 'Ziguinchor Centre', desc: 'Centre commercial' }
    ];
  }

  private getMockDevices(): UnifiDevice[] {
    return [
      { id: 'dev1', name: 'AP-Dakar-01', model: 'UAP-AC-PRO', macAddress: '78:8a:20:41:0e:66', ipAddress: '192.168.1.10', state: 'ONLINE', firmwareVersion: '6.0.14' },
      { id: 'dev2', name: 'SW-Dakar-01', model: 'USW-Pro-48-POE', macAddress: '78:8a:20:42:1e:67', ipAddress: '192.168.1.11', state: 'ONLINE', firmwareVersion: '6.2.33' },
      { id: 'dev3', name: 'AP-Thies-01', model: 'UAP-AC-LR', macAddress: '78:8a:20:43:0e:68', ipAddress: '192.168.2.10', state: 'OFFLINE', firmwareVersion: '6.0.14' },
      { id: 'dev4', name: 'AP-StLouis-01', model: 'UAP-AC-M', macAddress: '78:8a:20:44:0e:69', ipAddress: '192.168.3.10', state: 'ONLINE', firmwareVersion: '5.43.52' },
      { id: 'dev5', name: 'Router-Touba-01', model: 'UDM-Pro', macAddress: '78:8a:20:45:0e:70', ipAddress: '192.168.4.1', state: 'ONLINE', firmwareVersion: '7.1.66' }
    ];
  }

  private getMockDeviceStatistics(deviceId: string): UnifiDeviceStatistics {
    // Generate some random but realistic statistics
    const uptimeDays = Math.floor(Math.random() * 30) + 1; // 1-30 days
    return {
      uptimeSec: uptimeDays * 86400, // Convert days to seconds
      lastHeartbeatAt: new Date().toISOString(),
      cpuUtilizationPct: Math.random() * 80, // 0-80%
      memoryUtilizationPct: Math.random() * 70, // 0-70%
      txRateBps: Math.random() * 20000000, // 0-20 Mbps
      rxRateBps: Math.random() * 50000000, // 0-50 Mbps
    };
  }

  private getMockClients(): UnifiClient[] {
    return [
      { id: 'client1', name: 'iPhone de Oumar', connectedAt: new Date(Date.now() - 3600000).toISOString(), ipAddress: '192.168.1.101', type: 'WIRELESS', macAddress: '00:11:22:33:44:55', uplinkDeviceId: 'dev1' },
      { id: 'client2', name: 'Laptop de Fatou', connectedAt: new Date(Date.now() - 7200000).toISOString(), ipAddress: '192.168.1.102', type: 'WIRELESS', macAddress: '00:11:22:33:44:56', uplinkDeviceId: 'dev1' },
      { id: 'client3', name: 'PC de Bureau', connectedAt: new Date(Date.now() - 86400000).toISOString(), ipAddress: '192.168.1.103', type: 'WIRED', macAddress: '00:11:22:33:44:57', uplinkDeviceId: 'dev2' },
      { id: 'client4', name: 'Android de Amadou', connectedAt: new Date(Date.now() - 1800000).toISOString(), ipAddress: '192.168.2.101', type: 'WIRELESS', macAddress: '00:11:22:33:44:58', uplinkDeviceId: 'dev3' },
      { id: 'client5', name: 'Tablette Samsung', connectedAt: new Date(Date.now() - 900000).toISOString(), ipAddress: '192.168.3.101', type: 'WIRELESS', macAddress: '00:11:22:33:44:59', uplinkDeviceId: 'dev4' }
    ];
  }

  private getMockVouchers(): UnifiVoucher[] {
    const now = new Date();
    return [
      { 
        id: 'v1', 
        createdAt: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        name: 'Forfait Journalier',
        code: '4861490518',
        authorizeGuestLimit: 1,
        authorizedGuestCount: 1,
        activeAt: new Date(now.getTime() - 43200000).toISOString(), // 12 hours ago
        expiresAt: new Date(now.getTime() + 43200000).toISOString(), // 12 hours from now
        expired: false,
        timeLimitMinutes: 1440, // 24 hours
        dataUsageLimitMBytes: 1000,
        rxRateLimitKBps: 1600,
        txRateLimitKBps: 1600
      },
      { 
        id: 'v2', 
        createdAt: new Date(now.getTime() - 604800000).toISOString(), // 7 days ago
        name: 'Forfait Hebdomadaire',
        code: '9517538246',
        authorizeGuestLimit: 3,
        authorizedGuestCount: 2,
        activeAt: new Date(now.getTime() - 432000000).toISOString(), // 5 days ago
        expiresAt: new Date(now.getTime() + 172800000).toISOString(), // 2 days from now
        expired: false,
        timeLimitMinutes: 10080, // 7 days
        dataUsageLimitMBytes: 5000,
        rxRateLimitKBps: 2000,
        txRateLimitKBps: 2000
      },
      { 
        id: 'v3', 
        createdAt: new Date(now.getTime() - 1209600000).toISOString(), // 14 days ago
        name: 'Forfait Mensuel',
        code: '7382916450',
        authorizeGuestLimit: 5,
        authorizedGuestCount: 0,
        activeAt: undefined,
        expiresAt: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
        expired: true,
        timeLimitMinutes: 43200, // 30 days
        dataUsageLimitMBytes: 20000,
        rxRateLimitKBps: 3000,
        txRateLimitKBps: 3000
      }
    ];
  }
}

// Export singleton instance
export const unifiApiService = new UnifiApiService();
