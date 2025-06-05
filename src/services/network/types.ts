
export interface NetworkEquipment {
  id: string;
  name: string;
  type: 'mikrotik' | 'cisco_meraki' | 'tplink_omada' | 'ubiquiti' | 'generic' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn' | 'direct' | 'openwisp';
  model: string;
  ipAddress: string;
  apiEndpoint?: string;
  connectionMethod?: 'direct' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn' | 'openwisp';
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
    // OpenWisp specific credentials
    baseUrl?: string;
    apiToken?: string;
    organization?: string;
    radiusSettings?: {
      radiusServer: string;
      radiusSecret: string;
      radiusPort: number;
    };
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
