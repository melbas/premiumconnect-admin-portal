
import React from 'react';
import {
  MetricsOverview,
  RecentActivity,
  QuickActions,
  UserGrowthChart,
  TopWholesalers,
  RevenueChart,
  CampaignChart,
  SiteStatus
} from './OverviewComponents';

// Main Overview component
const SuperAdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Tableau de Bord Wifi Sénégal</h1>
      
      {/* Metrics section */}
      <MetricsOverview />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue chart */}
        <RevenueChart />
        
        {/* User growth chart */}
        <UserGrowthChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Campaign performance chart */}
        <CampaignChart />
        
        {/* Top wholesalers */}
        <TopWholesalers />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activities */}
        <RecentActivity />
        
        {/* Quick actions */}
        <QuickActions />
      </div>
      
      {/* Site status */}
      <SiteStatus />
    </div>
  );
};

export default SuperAdminOverview;
