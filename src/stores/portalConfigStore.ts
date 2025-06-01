
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

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
  siteId?: string;
  wholesalerId?: string;
}

export interface SiteOption {
  id: string;
  name: string;
  location?: string;
}

export interface WholesalerOption {
  id: string;
  name: string;
  sites: SiteOption[];
}

interface PortalConfigState {
  currentConfig: PortalConfiguration;
  availableConfigs: PortalConfiguration[];
  sites: SiteOption[];
  wholesalers: WholesalerOption[];
  selectedSite?: string;
  selectedWholesaler?: string;
  previewDevice: 'mobile' | 'desktop' | 'tablet';
  isPreviewMode: boolean;
  unsavedChanges: boolean;
  isLoading: boolean;
  
  // Actions
  loadConfigurations: () => Promise<void>;
  loadConfiguration: (configId: string) => Promise<void>;
  loadSitesAndWholesalers: () => Promise<void>;
  createConfigurationForSite: (siteId: string, name: string) => Promise<void>;
  updateAuthMethod: (methodId: string, updates: Partial<AuthMethod>) => void;
  updateEngagementModule: (moduleId: string, updates: Partial<EngagementModule>) => void;
  updatePaymentModule: (moduleId: string, updates: Partial<PaymentModule>) => void;
  updateBranding: (updates: Partial<BrandingSettings>) => void;
  setPreviewDevice: (device: 'mobile' | 'desktop' | 'tablet') => void;
  togglePreviewMode: () => void;
  saveConfiguration: () => Promise<void>;
  resetConfiguration: () => void;
  createNewConfiguration: (name: string, template: string) => Promise<void>;
  setSelectedSite: (siteId: string) => void;
  setSelectedWholesaler: (wholesalerId: string) => void;
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
    { id: 'ai_onboarding', name: 'AI Onboarding Assistant', enabled: true, order: 0 },
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
  availableConfigs: [],
  sites: [],
  wholesalers: [],
  selectedSite: undefined,
  selectedWholesaler: undefined,
  previewDevice: 'mobile',
  isPreviewMode: true,
  unsavedChanges: false,
  isLoading: false,

  loadSitesAndWholesalers: async () => {
    try {
      // Mock data - replace with actual Supabase queries when tables are ready
      const mockWholesalers: WholesalerOption[] = [
        {
          id: 'w1',
          name: 'Grossiste Dakar',
          sites: [
            { id: 's1', name: 'Site Plateau', location: 'Plateau, Dakar' },
            { id: 's2', name: 'Site Almadies', location: 'Almadies, Dakar' }
          ]
        },
        {
          id: 'w2',
          name: 'Grossiste Thiès',
          sites: [
            { id: 's3', name: 'Site Centre Thiès', location: 'Centre-ville, Thiès' }
          ]
        }
      ];

      const allSites = mockWholesalers.flatMap(w => w.sites);
      
      set({ 
        wholesalers: mockWholesalers,
        sites: allSites 
      });
    } catch (error) {
      console.error('Failed to load sites and wholesalers:', error);
    }
  },

  loadConfigurations: async () => {
    set({ isLoading: true });
    try {
      const { data: configs, error } = await supabase
        .from('portal_config')
        .select(`
          *,
          portal_enabled_modules(
            id,
            module_id,
            module_config,
            is_enabled,
            portal_modules(
              module_name,
              display_name,
              module_type,
              category
            )
          )
        `);

      if (error) {
        console.error('Error loading configurations:', error);
        return;
      }

      const transformedConfigs = configs?.map(config => transformDbConfigToStore(config)) || [];
      set({ availableConfigs: transformedConfigs, isLoading: false });
    } catch (error) {
      console.error('Failed to load configurations:', error);
      set({ isLoading: false });
    }
  },

  loadConfiguration: async (configId: string) => {
    set({ isLoading: true });
    try {
      const { data: config, error } = await supabase
        .from('portal_config')
        .select(`
          *,
          portal_enabled_modules(
            id,
            module_id,
            module_config,
            is_enabled,
            portal_modules(
              module_name,
              display_name,
              module_type,
              category
            )
          )
        `)
        .eq('id', configId)
        .single();

      if (error) {
        console.error('Error loading configuration:', error);
        return;
      }

      const transformedConfig = transformDbConfigToStore(config);
      set({ currentConfig: transformedConfig, unsavedChanges: false, isLoading: false });
    } catch (error) {
      console.error('Failed to load configuration:', error);
      set({ isLoading: false });
    }
  },

  createConfigurationForSite: async (siteId: string, name: string) => {
    try {
      const newConfig = {
        ...defaultConfiguration,
        id: crypto.randomUUID(),
        name,
        siteId,
        lastModified: new Date(),
        isActive: true,
      };

      const configData = transformStoreConfigToDb(newConfig);
      
      const { error } = await supabase
        .from('portal_config')
        .insert([configData]);

      if (error) {
        console.error('Error creating configuration:', error);
        return;
      }

      set({ currentConfig: newConfig, unsavedChanges: false, selectedSite: siteId });
      console.log('✅ Configuration created for site successfully');
    } catch (error) {
      console.error('Failed to create configuration:', error);
    }
  },

  setSelectedSite: (siteId: string) => {
    set({ selectedSite: siteId });
    // Load configuration for this site
    get().loadConfigurations();
  },

  setSelectedWholesaler: (wholesalerId: string) => {
    set({ selectedWholesaler: wholesalerId });
  },

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

  saveConfiguration: async () => {
    const state = get();
    set({ isLoading: true });
    try {
      const configData = transformStoreConfigToDb(state.currentConfig);
      
      const { error } = await supabase
        .from('portal_config')
        .upsert([configData]);

      if (error) {
        console.error('Error saving configuration:', error);
        return;
      }

      console.log('💾 Configuration saved successfully');
      set({ unsavedChanges: false, isLoading: false });
    } catch (error) {
      console.error('Failed to save configuration:', error);
      set({ isLoading: false });
    }
  },

  resetConfiguration: () => {
    set({ currentConfig: defaultConfiguration, unsavedChanges: false });
  },

  createNewConfiguration: async (name: string, template: string) => {
    try {
      const newConfig = {
        ...defaultConfiguration,
        id: crypto.randomUUID(),
        name,
        template,
        lastModified: new Date(),
      };

      const configData = transformStoreConfigToDb(newConfig);
      
      const { error } = await supabase
        .from('portal_config')
        .insert([configData]);

      if (error) {
        console.error('Error creating configuration:', error);
        return;
      }

      set({ currentConfig: newConfig, unsavedChanges: false });
      console.log('✅ New configuration created successfully');
    } catch (error) {
      console.error('Failed to create configuration:', error);
    }
  },
}));

// Helper functions to transform between store format and database format
function transformDbConfigToStore(dbConfig: any): PortalConfiguration {
  return {
    id: dbConfig.id,
    name: dbConfig.portal_name || 'Configuration',
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
    engagementModules: dbConfig.portal_enabled_modules?.map((module: any) => ({
      id: module.portal_modules?.module_name || 'unknown',
      name: module.portal_modules?.display_name || 'Module',
      enabled: module.is_enabled,
      order: 1,
      settings: module.module_config,
    })) || [
      { id: 'welcome', name: 'Welcome Screen', enabled: true, order: 1 },
      { id: 'mobile_money', name: 'Mobile Money Assistant', enabled: true, order: 5 },
      { id: 'ai_chat', name: 'AI Chat Support', enabled: true, order: 6 },
      { id: 'ai_onboarding', name: 'AI Onboarding Assistant', enabled: true, order: 0 },
    ],
    paymentModules: [
      { id: 'vouchers', name: 'Voucher System', enabled: true },
      { id: 'payment_gateway', name: 'Payment Gateway', enabled: false },
      { id: 'orange_money', name: 'Orange Money', enabled: true },
      { id: 'wave', name: 'Wave', enabled: true },
      { id: 'free_money', name: 'Free Money', enabled: false },
    ],
    branding: {
      primaryColor: dbConfig.theme_color || '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      fontFamily: 'Inter',
      customCSS: dbConfig.custom_css,
      logo: dbConfig.logo_url,
    },
    language: (dbConfig.default_language as 'fr' | 'wo' | 'en') || 'fr',
    isActive: dbConfig.portal_status === 'active',
    lastModified: new Date(dbConfig.updated_at || dbConfig.created_at),
    siteId: dbConfig.site_id,
    wholesalerId: dbConfig.wholesaler_id,
  };
}

function transformStoreConfigToDb(config: PortalConfiguration) {
  return {
    id: config.id,
    portal_name: config.name,
    theme_color: config.branding.primaryColor,
    custom_css: config.branding.customCSS,
    logo_url: config.branding.logo,
    default_language: config.language,
    portal_status: config.isActive ? 'active' : 'inactive',
    site_id: config.siteId,
    wholesaler_id: config.wholesalerId,
    updated_at: config.lastModified.toISOString(),
  };
}
