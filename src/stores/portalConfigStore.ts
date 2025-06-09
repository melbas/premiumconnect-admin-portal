
import { create } from 'zustand';

export interface PortalBranding {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface PortalConfig {
  id: string;
  name: string;
  branding: PortalBranding;
  modules: string[];
  isActive: boolean;
}

interface PortalConfigState {
  currentConfig: PortalConfig;
  updateBranding: (branding: PortalBranding) => void;
  updateConfig: (config: Partial<PortalConfig>) => void;
  resetConfig: () => void;
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
};

export const usePortalConfigStore = create<PortalConfigState>((set) => ({
  currentConfig: defaultConfig,
  
  updateBranding: (branding) =>
    set((state) => ({
      currentConfig: {
        ...state.currentConfig,
        branding: { ...state.currentConfig.branding, ...branding },
      },
    })),
    
  updateConfig: (config) =>
    set((state) => ({
      currentConfig: { ...state.currentConfig, ...config },
    })),
    
  resetConfig: () => set({ currentConfig: defaultConfig }),
}));
