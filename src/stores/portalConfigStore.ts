
import { create } from 'zustand';

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

interface PortalConfigState {
  currentConfig: PortalConfig;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  sites: Site[];
  wholesalers: Wholesaler[];
  selectedSite: string | null;
  selectedWholesaler: string | null;
  availableConfigs: PortalConfiguration[];
  unsavedChanges: boolean;
  
  // Methods
  updateBranding: (branding: Partial<PortalBranding>) => void;
  updateConfig: (config: Partial<PortalConfig>) => void;
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

const defaultConfig: PortalConfig = {
  id: 'default',
  name: 'Portail par défaut',
  branding: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Inter',
  },
  modules: ['auth_sms', 'ai_chat', 'mobile_money'],
  isActive: true,
  authMethods: [
    { id: 'facebook', name: 'Facebook Login', enabled: true },
    { id: 'google', name: 'Google Login', enabled: true },
    { id: 'email', name: 'Email', enabled: true },
    { id: 'sms', name: 'SMS', enabled: true },
  ],
  engagementModules: [
    { id: 'welcome', name: 'Message de Bienvenue', enabled: true, order: 1 },
    { id: 'mobile_money', name: 'Mobile Money', enabled: true, order: 2 },
    { id: 'ai_chat', name: 'Chat IA', enabled: true, order: 3 },
    { id: 'ads', name: 'Publicités', enabled: false, order: 4 },
    { id: 'games', name: 'Jeux', enabled: false, order: 5 },
  ],
  paymentModules: [
    { id: 'orange_money', name: 'Orange Money', enabled: true },
    { id: 'free_money', name: 'Free Money', enabled: false },
    { id: 'wave', name: 'Wave', enabled: false },
  ],
};

const mockWholesalers: Wholesaler[] = [
  {
    id: '1',
    name: 'Grossiste Dakar',
    sites: [
      { id: '1', name: 'Site Coumba Lamb', location: 'Guédiawaye, Dakar' },
      { id: '2', name: 'Site Liberté 6', location: 'Liberté 6, Dakar' },
    ]
  },
  {
    id: '2',
    name: 'Grossiste Thiès',
    sites: [
      { id: '3', name: 'Site Centre Ville', location: 'Centre Ville, Thiès' },
    ]
  }
];

export const usePortalConfigStore = create<PortalConfigState>((set, get) => ({
  currentConfig: defaultConfig,
  previewDevice: 'mobile',
  sites: mockWholesalers.flatMap(w => w.sites),
  wholesalers: mockWholesalers,
  selectedSite: null,
  selectedWholesaler: null,
  availableConfigs: [],
  unsavedChanges: false,
  
  updateBranding: (branding) =>
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        branding: { ...state.currentConfig.branding, ...branding },
      },
      unsavedChanges: true,
    })),
    
  updateConfig: (config) =>
    set((state) => ({
      currentConfig: { ...state.currentConfig, ...config },
      unsavedChanges: true,
    })),

  updateAuthMethod: (methodId, updates) =>
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        authMethods: state.currentConfig.authMethods.map(method =>
          method.id === methodId ? { ...method, ...updates } : method
        ),
      },
      unsavedChanges: true,
    })),

  updateEngagementModule: (moduleId, updates) =>
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        engagementModules: state.currentConfig.engagementModules.map(module =>
          module.id === moduleId ? { ...module, ...updates } : module
        ),
      },
      unsavedChanges: true,
    })),

  updatePaymentModule: (moduleId, updates) =>
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        paymentModules: state.currentConfig.paymentModules.map(module =>
          module.id === moduleId ? { ...module, ...updates } : module
        ),
      },
      unsavedChanges: true,
    })),

  setPreviewDevice: (device) => set({ previewDevice: device }),
  
  setSelectedSite: (siteId) => set({ selectedSite: siteId }),
  
  setSelectedWholesaler: (wholesalerId) => set({ selectedWholesaler: wholesalerId }),

  createConfigurationForSite: (siteId, name) => {
    const newConfig: PortalConfiguration = {
      id: `config-${Date.now()}`,
      name,
      siteId,
      isActive: false,
      lastModified: new Date(),
    };
    
    set((state) => ({
      availableConfigs: [...state.availableConfigs, newConfig],
    }));
  },

  loadConfiguration: async (configId) => {
    // Simulate loading configuration
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Loading configuration: ${configId}`);
  },

  saveConfiguration: () => {
    console.log('Saving configuration...');
    set({ unsavedChanges: false });
  },

  resetConfig: () => set({ currentConfig: defaultConfig, unsavedChanges: false }),
  
  resetConfiguration: () => set({ currentConfig: defaultConfig, unsavedChanges: false }),
}));
