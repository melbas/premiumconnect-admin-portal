
export interface SiteNetworkConfig {
  siteId: string;
  siteName: string;
  method: 'direct' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn' | 'openwisp';
  credentials: {
    tunnelId?: string;
    cloudflareToken?: string;
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
      radiusServer?: string;
      radiusSecret?: string;
      radiusPort?: number;
    };
  };
  subdomain?: string;
  dnsConfig?: {
    cloudflareApiKey?: string;
    domain?: string;
    zoneId?: string;
  };
  isActive: boolean;
  lastTested?: Date;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
}

export interface ConnectionMethod {
  value: SiteNetworkConfig['method'];
  label: string;
  icon: any;
  description: string;
}
