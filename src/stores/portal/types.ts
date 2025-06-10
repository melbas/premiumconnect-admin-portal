
export interface PortalBranding {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface AuthMethod {
  id: string;
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface EngagementModule {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface PaymentModule {
  id: string;
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface Site {
  id: string;
  name: string;
  location?: string;
}

export interface Wholesaler {
  id: string;
  name: string;
  sites: Site[];
}

export interface PortalConfiguration {
  id: string;
  name: string;
  siteId: string;
  isActive: boolean;
  lastModified: Date;
}

export interface PortalConfig {
  id: string;
  name: string;
  branding: PortalBranding;
  modules: string[];
  isActive: boolean;
  authMethods: AuthMethod[];
  engagementModules: EngagementModule[];
  paymentModules: PaymentModule[];
}
