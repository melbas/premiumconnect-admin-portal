
import { create } from 'zustand';
import { PortalConfigState } from './portalConfigState';
import { PortalConfigActions } from './portalConfigActions';
import { mockWholesalers, defaultConfig } from './mockData';
import { PortalConfiguration } from './types';

interface PortalConfigStore extends PortalConfigState, PortalConfigActions {}

export const usePortalConfigStore = create<PortalConfigStore>((set, get) => ({
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
