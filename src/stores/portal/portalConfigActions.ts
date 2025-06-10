
import { PortalBranding, AuthMethod, EngagementModule, PaymentModule, PortalConfiguration } from './types';

export interface PortalConfigActions {
  updateBranding: (branding: Partial<PortalBranding>) => void;
  updateConfig: (config: any) => void;
  updateAuthMethod: (methodId: string, updates: Partial<AuthMethod>) => void;
  updateEngagementModule: (moduleId: string, updates: Partial<EngagementModule>) => void;
  updatePaymentModule: (moduleId: string, updates: Partial<PaymentModule>) => void;
  setPreviewDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;
  setSelectedSite: (siteId: string) => void;
  setSelectedWholesaler: (wholesalerId: string) => void;
  createConfigurationForSite: (siteId: string, name: string) => void;
  loadConfiguration: (configId: string) => Promise<void>;
  saveConfiguration: () => void;
  resetConfig: () => void;
  resetConfiguration: () => void;
}
