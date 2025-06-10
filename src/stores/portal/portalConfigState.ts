
import { 
  PortalConfig, 
  Site, 
  Wholesaler, 
  PortalConfiguration 
} from './types';

export interface PortalConfigState {
  currentConfig: PortalConfig;
  previewDevice: 'mobile' | 'tablet' | 'desktop';
  sites: Site[];
  wholesalers: Wholesaler[];
  selectedSite: string | null;
  selectedWholesaler: string | null;
  availableConfigs: PortalConfiguration[];
  unsavedChanges: boolean;
}
