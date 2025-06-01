
export interface SiteNetworkConfig {
  siteId: string;
  siteName: string;
  method: 'direct' | 'cloudflare_tunnel' | 'wireguard' | 'tailscale' | 'openvpn';
  credentials: {
    tunnelId?: string;
    cloudflareToken?: string;
    privateKey?: string;
    publicKey?: string;
    endpoint?: string;
    tailscaleKey?: string;
    openvpnConfig?: string;
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

// Mock storage for site network configurations
const mockNetworkConfigs = new Map<string, SiteNetworkConfig>();

export const getSiteNetworkConfig = (siteId: string): SiteNetworkConfig | null => {
  return mockNetworkConfigs.get(siteId) || null;
};

export const saveSiteNetworkConfig = (config: SiteNetworkConfig): void => {
  mockNetworkConfigs.set(config.siteId, config);
  console.log(`Network configuration saved for site ${config.siteName}:`, config);
};

export const getAllSiteNetworkConfigs = (): SiteNetworkConfig[] => {
  return Array.from(mockNetworkConfigs.values());
};

export const deleteSiteNetworkConfig = (siteId: string): boolean => {
  return mockNetworkConfigs.delete(siteId);
};

export const getNetworkStatusSummary = () => {
  const configs = Array.from(mockNetworkConfigs.values());
  return {
    total: configs.length,
    connected: configs.filter(c => c.status === 'connected' && c.isActive).length,
    disconnected: configs.filter(c => c.status !== 'connected' || !c.isActive).length,
    errors: configs.filter(c => c.status === 'error').length
  };
};
