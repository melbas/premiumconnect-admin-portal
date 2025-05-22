
import React, { useState } from 'react';
import AdminLayout, { AdminTab } from './AdminLayout';
import SuperAdminOverview from './Tabs/SuperAdminOverview';
import SuperAdminTechnical from './Tabs/SuperAdminTechnical';
import SuperAdminMarketing from './Tabs/SuperAdminMarketing';
import SuperAdminVouchers from './Tabs/SuperAdminVouchers';
import SuperAdminUsers from './Tabs/SuperAdminUsers';
import SuperAdminWholesalers from './Tabs/SuperAdminWholesalers';
import SuperAdminSettings from './Tabs/SuperAdminSettings';
import SuperAdminSites from './Tabs/SuperAdminSites';
import SuperAdminAnalytics from './Tabs/SuperAdminAnalytics';

interface SuperAdminDashboardProps {
  initialTab?: AdminTab | 'captive-portal' | 'analytics';
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<AdminTab | 'captive-portal' | 'analytics'>(initialTab);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminOverview />;
      case 'technical':
        return <SuperAdminTechnical />;
      case 'marketing':
        return <SuperAdminMarketing />;
      case 'vouchers':
        return <SuperAdminVouchers />;
      case 'users':
        return <SuperAdminUsers />;
      case 'sites':
        return <SuperAdminSites />;
      case 'wholesalers':
        return <SuperAdminWholesalers />;
      case 'captive-portal':
        return <SuperAdminTechnical initialView="captive-portal" />;
      case 'analytics':
        return <SuperAdminAnalytics />;
      case 'settings':
        return <SuperAdminSettings />;
      default:
        return <SuperAdminOverview />;
    }
  };
  
  return (
    <AdminLayout activeTab={activeTab as AdminTab} setActiveTab={setActiveTab as (tab: AdminTab) => void}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default SuperAdminDashboard;
