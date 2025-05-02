
import { UnifiDevice } from '@/services/unifiService';

// Helper functions for site data calculations and formatting

// Get devices count for a site
export const getDeviceCountForSite = (siteName: string, devices: UnifiDevice[]): number => {
  // In a real app, we would match by siteId, but for demo we'll match by name
  return devices.filter(device => {
    // Map the device to a site based on name prefix (this is just for demo)
    const devicePrefix = device.name?.split('-')[0];
    if (devicePrefix === 'AP' && siteName.includes('Dakar')) return true;
    if (devicePrefix === 'SW' && siteName.includes('Dakar')) return true;
    if (siteName.includes('Thiès') && device.name?.includes('Thies')) return true;
    if (siteName.includes('Saint-Louis') && device.name?.includes('StLouis')) return true;
    if (siteName.includes('Touba') && device.name?.includes('Touba')) return true;
    if (siteName.includes('Ziguinchor') && device.name?.includes('Ziguinchor')) return true;
    return false;
  }).length;
};

// Get uptime percentage for a site
export const getUptimeForSite = (siteName: string): number => {
  // For demo purposes, generate a realistic uptime value
  const base = siteName.includes('Thiès') ? 92 : 98; // Thiès site has issues
  return base + (Math.random() * 2);
};

// Get issues count for a site
export const getIssuesForSite = (siteName: string): number => {
  // For demo purposes
  if (siteName.includes('Thiès')) return 2;
  if (siteName.includes('Ziguinchor')) return 1;
  return 0;
};

// Get users count for a site
export const getUsersForSite = (siteName: string): number => {
  // For demo purposes, generate user counts
  if (siteName.includes('Dakar')) return 450 + Math.floor(Math.random() * 50);
  if (siteName.includes('Thiès')) return 280 + Math.floor(Math.random() * 30);
  if (siteName.includes('Saint-Louis')) return 175 + Math.floor(Math.random() * 25);
  if (siteName.includes('Touba')) return 320 + Math.floor(Math.random() * 40);
  if (siteName.includes('Ziguinchor')) return 140 + Math.floor(Math.random() * 20);
  return 100 + Math.floor(Math.random() * 50);
};

// Get revenue for a site
export const getRevenueForSite = (siteName: string): number => {
  // For demo purposes, generate revenue based on user count
  const users = getUsersForSite(siteName);
  // Average revenue per user: 2000-4000 FCFA
  const avgRevenuePerUser = 2000 + Math.floor(Math.random() * 2000);
  return users * avgRevenuePerUser;
};

// Get status for a site
export const getStatusForSite = (siteName: string): string => {
  // For demo purposes, Thiès site is offline
  return siteName.includes('Thiès') ? 'offline' : 'active';
};

// Helper function to determine color class based on uptime percentage
export const getUptimeColorClass = (uptime: number): string => {
  if (uptime >= 99) return 'bg-success';
  if (uptime >= 95) return 'bg-warning';
  return 'bg-danger';
};
