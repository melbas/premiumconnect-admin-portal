export interface NetworkEquipment {
  id: string;
  name: string;
  type: 'mikrotik' | 'cisco_meraki' | 'tplink_omada' | 'ubiquiti' | 'generic' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn' | 'direct';
  model: string;
  ipAddress: string;
  apiEndpoint?: string;
  connectionMethod?: 'direct' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn';
  subdomain?: string;
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
    token?: string;
    tunnelId?: string;
    privateKey?: string;
    publicKey?: string;
    endpoint?: string;
    tailscaleKey?: string;
    openvpnConfig?: string;
  };
  capabilities: string[];
  configuration?: any;
  dnsConfig?: {
    cloudflareApiKey?: string;
    domain?: string;
    zoneId?: string;
  };
}

export interface NetworkAdapter {
  authenticate(user: any): Promise<boolean>;
  authorizeUser(userId: string, sessionDuration: number): Promise<string>;
  disconnectUser(userId: string): Promise<boolean>;
  getActiveUsers(): Promise<any[]>;
  getSessionInfo(sessionId: string): Promise<any>;
  updateUserBandwidth(userId: string, uploadKbps: number, downloadKbps: number): Promise<boolean>;
  getEquipmentStatus(): Promise<any>;
  configurePortal(portalConfig: any): Promise<boolean>;
  getSupportedFeatures(): string[];
  testConnection(): Promise<boolean>;
  configureConnection(): Promise<boolean>;
}

export class NetworkAdapterFactory {
  private static adapters = new Map<string, NetworkAdapter>();

  static async createAdapter(equipment: NetworkEquipment): Promise<NetworkAdapter> {
    const key = `${equipment.type}_${equipment.id}`;
    
    if (this.adapters.has(key)) {
      return this.adapters.get(key)!;
    }

    let adapter: NetworkAdapter;

    switch (equipment.type) {
      case 'mikrotik':
        const { MikrotikAdapter } = await import('./adapters/MikrotikAdapter');
        adapter = new MikrotikAdapter(equipment);
        break;
      
      case 'cisco_meraki':
        const { CiscoMerakiAdapter } = await import('./adapters/CiscoMerakiAdapter');
        adapter = new CiscoMerakiAdapter(equipment);
        break;
      
      case 'tplink_omada':
        const { TPLinkOmadaAdapter } = await import('./adapters/TPLinkOmadaAdapter');
        adapter = new TPLinkOmadaAdapter(equipment);
        break;
      
      case 'ubiquiti':
        const { UbiquitiAdapter } = await import('./adapters/UbiquitiAdapter');
        adapter = new UbiquitiAdapter(equipment);
        break;

      case 'cloudflare_tunnel':
        const { CloudflareTunnelAdapter } = await import('./adapters/CloudflareTunnelAdapter');
        adapter = new CloudflareTunnelAdapter(equipment);
        break;

      case 'wireguard':
        const { WireGuardAdapter } = await import('./adapters/WireGuardAdapter');
        adapter = new WireGuardAdapter(equipment);
        break;

      case 'tailscale':
        const { TailscaleAdapter } = await import('./adapters/TailscaleAdapter');
        adapter = new TailscaleAdapter(equipment);
        break;

      case 'openvpn':
        const { OpenVPNAdapter } = await import('./adapters/OpenVPNAdapter');
        adapter = new OpenVPNAdapter(equipment);
        break;

      case 'direct':
        const { DirectConnectionAdapter } = await import('./adapters/DirectConnectionAdapter');
        adapter = new DirectConnectionAdapter(equipment);
        break;
      
      default:
        const { GenericRADIUSAdapter } = await import('./adapters/GenericRADIUSAdapter');
        adapter = new GenericRADIUSAdapter(equipment);
    }

    this.adapters.set(key, adapter);
    return adapter;
  }

  static getAdapter(equipmentId: string, type: string): NetworkAdapter | null {
    const key = `${type}_${equipmentId}`;
    return this.adapters.get(key) || null;
  }

  static async detectEquipmentType(ipAddress: string): Promise<NetworkEquipment['type'] | null> {
    try {
      const detectionPromises = [
        this.detectMikrotik(ipAddress),
        this.detectCiscoMeraki(ipAddress),
        this.detectTPLinkOmada(ipAddress),
        this.detectUbiquiti(ipAddress),
        this.detectCloudflare(ipAddress),
        this.detectWireGuard(ipAddress),
        this.detectTailscale(ipAddress),
        this.detectOpenVPN(ipAddress)
      ];

      const results = await Promise.allSettled(detectionPromises);
      
      for (let i = 0; i < results.length; i++) {
        if (results[i].status === 'fulfilled' && (results[i] as PromiseFulfilledResult<boolean>).value) {
          const types: NetworkEquipment['type'][] = [
            'mikrotik', 'cisco_meraki', 'tplink_omada', 'ubiquiti',
            'cloudflare_tunnel', 'wireguard', 'tailscale', 'openvpn'
          ];
          return types[i];
        }
      }

      return 'direct';
    } catch (error) {
      console.error('Equipment detection failed:', error);
      return null;
    }
  }

  private static async detectCloudflare(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting Cloudflare Tunnel at ${ip}...`);
      // In real implementation: check for Cloudflare tunnel endpoint
      return Math.random() > 0.8;
    } catch {
      return false;
    }
  }

  private static async detectWireGuard(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting WireGuard at ${ip}...`);
      // In real implementation: check for WireGuard interface
      return Math.random() > 0.8;
    } catch {
      return false;
    }
  }

  private static async detectTailscale(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting Tailscale at ${ip}...`);
      // In real implementation: check for Tailscale API
      return Math.random() > 0.8;
    } catch {
      return false;
    }
  }

  private static async detectOpenVPN(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting OpenVPN at ${ip}...`);
      // In real implementation: check for OpenVPN management interface
      return Math.random() > 0.8;
    } catch {
      return false;
    }
  }

  private static async detectMikrotik(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting MikroTik at ${ip}...`);
      return Math.random() > 0.7;
    } catch {
      return false;
    }
  }

  private static async detectCiscoMeraki(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting Cisco Meraki at ${ip}...`);
      return Math.random() > 0.8;
    } catch {
      return false;
    }
  }

  private static async detectTPLinkOmada(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting TP-Link Omada at ${ip}...`);
      return Math.random() > 0.8;
    } catch {
      return false;
    }
  }

  private static async detectUbiquiti(ip: string): Promise<boolean> {
    try {
      console.log(`Detecting Ubiquiti at ${ip}...`);
      return Math.random() > 0.6;
    } catch {
      return false;
    }
  }

  static clearCache(): void {
    this.adapters.clear();
  }
}
