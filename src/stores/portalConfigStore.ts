
import { create } from 'zustand';

export interface AuthMethod {
  id: string;
  name: string;
  enabled: boolean;
  settings?: any;
}

export interface EngagementModule {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  settings?: any;
}

export interface PaymentModule {
  id: string;
  name: string;
  enabled: boolean;
  settings?: any;
}

export interface BrandingSettings {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  customCSS?: string;
}

export interface PortalConfiguration {
  id: string;
  name: string;
  template: string;
  authMethods: AuthMethod[];
  engagementModules: EngagementModule[];
  paymentModules: PaymentModule[];
  branding: BrandingSettings;
  language: 'fr' | 'wo' | 'en';
  isActive: boolean;
  lastModified: Date;
}

interface PortalConfigState {
  currentConfig: PortalConfiguration;
  previewDevice: 'mobile' | 'desktop' | 'tablet';
  isPreviewMode: boolean;
  unsavedChanges: boolean;
  
  // Actions
  updateAuthMethod: (methodId: string, updates: Partial<AuthMethod>) => void;
  updateEngagementModule: (moduleId: string, updates: Partial<EngagementModule>) => void;
  updatePaymentModule: (moduleId: string, updates: Partial<PaymentModule>) => void;
  updateBranding: (updates: Partial<BrandingSettings>) => void;
  setPreviewDevice: (device: 'mobile' | 'desktop' | 'tablet') => void;
  togglePreviewMode: () => void;
  saveConfiguration: () => void;
  loadConfiguration: (config: PortalConfiguration) => void;
  resetConfiguration: () => void;
}

const defaultConfiguration: PortalConfiguration = {
  id: 'default',
  name: 'Portail Par Défaut',
  template: 'business',
  authMethods: [
    { id: 'facebook', name: 'Facebook Login', enabled: true },
    { id: 'google', name: 'Google Login', enabled: true },
    { id: 'linkedin', name: 'LinkedIn Login', enabled: false },
    { id: 'twitter', name: 'Twitter/X Login', enabled: false },
    { id: 'email', name: 'Email/Password', enabled: true },
    { id: 'sms', name: 'SMS/Phone', enabled: true },
    { id: 'radius', name: 'RADIUS', enabled: false },
  ],
  engagementModules: [
    { id: 'welcome', name: 'Welcome Screen', enabled: true, order: 1 },
    { id: 'ads', name: 'Video Ads', enabled: false, order: 2 },
    { id: 'games', name: 'Interactive Games', enabled: false, order: 3 },
    { id: 'surveys', name: 'User Surveys', enabled: false, order: 4 },
    { id: 'mobile_money', name: 'Mobile Money Assistant', enabled: true, order: 5 },
    { id: 'ai_chat', name: 'AI Chat Support', enabled: true, order: 6 },
  ],
  paymentModules: [
    { id: 'vouchers', name: 'Voucher System', enabled: true },
    { id: 'payment_gateway', name: 'Payment Gateway', enabled: false },
    { id: 'orange_money', name: 'Orange Money', enabled: true },
    { id: 'wave', name: 'Wave', enabled: true },
    { id: 'free_money', name: 'Free Money', enabled: false },
  ],
  branding: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Inter',
  },
  language: 'fr',
  isActive: false,
  lastModified: new Date(),
};

export const usePortalConfigStore = create<PortalConfigState>((set, get) => ({
  currentConfig: defaultConfiguration,
  previewDevice: 'mobile',
  isPreviewMode: true,
  unsavedChanges: false,

  updateAuthMethod: (methodId, updates) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        authMethods: state.currentConfig.authMethods.map(method =>
          method.id === methodId ? { ...method, ...updates } : method
        ),
        lastModified: new Date(),
      },
      unsavedChanges: true,
    }));
  },

  updateEngagementModule: (moduleId, updates) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        engagementModules: state.currentConfig.engagementModules.map(module =>
          module.id === moduleId ? { ...module, ...updates } : module
        ),
        lastModified: new Date(),
      },
      unsavedChanges: true,
    }));
  },

  updatePaymentModule: (moduleId, updates) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        paymentModules: state.currentConfig.paymentModules.map(module =>
          module.id === moduleId ? { ...module, ...updates } : module
        ),
        lastModified: new Date(),
      },
      unsavedChanges: true,
    }));
  },

  updateBranding: (updates) => {
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        branding: { ...state.currentConfig.branding, ...updates },
        lastModified: new Date(),
      },
      unsavedChanges: true,
    }));
  },

  setPreviewDevice: (device) => {
    set({ previewDevice: device });
  },

  togglePreviewMode: () => {
    set((state) => ({ isPreviewMode: !state.isPreviewMode }));
  },

  saveConfiguration: () => {
    // TODO: Implement save to backend
    console.log('💾 Configuration saved:', get().currentConfig);
    set({ unsavedChanges: false });
  },

  loadConfiguration: (config) => {
    set({ currentConfig: config, unsavedChanges: false });
  },

  resetConfiguration: () => {
    set({ currentConfig: defaultConfiguration, unsavedChanges: false });
  },
}));
