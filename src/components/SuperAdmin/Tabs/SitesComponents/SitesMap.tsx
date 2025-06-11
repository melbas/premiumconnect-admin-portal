
import React from 'react';
import { MapProvider, EnhancedSitesMap } from '@/components/Maps';
import { UnifiSite } from '@/services/unifiService';

interface SitesMapProps {
  sites: UnifiSite[];
  getStatusForSite: (siteName: string) => string;
  getUptimeForSite: (siteName: string) => number;
  getIssuesForSite: (siteName: string) => number;
  getUsersForSite: (siteName: string) => number;
  getDeviceCountForSite: (siteName: string) => number;
}

const SitesMap: React.FC<SitesMapProps> = (props) => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <MapProvider isDarkMode={isDarkMode}>
      <EnhancedSitesMap {...props} />
    </MapProvider>
  );
};

export default SitesMap;
