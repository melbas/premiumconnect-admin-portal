
import { Wholesaler, PortalConfig, AuthMethod, EngagementModule, PaymentModule } from './types';

export const mockWholesalers: Wholesaler[] = [
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

export const defaultAuthMethods: AuthMethod[] = [
  { id: 'facebook', name: 'Facebook Login', enabled: true },
  { id: 'google', name: 'Google Login', enabled: true },
  { id: 'email', name: 'Email', enabled: true },
  { id: 'sms', name: 'SMS', enabled: true },
];

export const defaultEngagementModules: EngagementModule[] = [
  { id: 'welcome', name: 'Message de Bienvenue', enabled: true, order: 1 },
  { id: 'mobile_money', name: 'Mobile Money', enabled: true, order: 2 },
  { id: 'ai_chat', name: 'Chat IA', enabled: true, order: 3 },
  { id: 'ads', name: 'Publicités', enabled: false, order: 4 },
  { id: 'games', name: 'Jeux', enabled: false, order: 5 },
];

export const defaultPaymentModules: PaymentModule[] = [
  { id: 'orange_money', name: 'Orange Money', enabled: true },
  { id: 'free_money', name: 'Free Money', enabled: false },
  { id: 'wave', name: 'Wave', enabled: false },
];

export const defaultConfig: PortalConfig = {
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
  authMethods: defaultAuthMethods,
  engagementModules: defaultEngagementModules,
  paymentModules: defaultPaymentModules,
};
