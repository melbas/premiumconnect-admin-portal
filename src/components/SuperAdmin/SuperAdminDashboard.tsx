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

interface SuperAdminDashboardProps {
  initialTab?: AdminTab | 'captive-portal';
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<AdminTab | 'captive-portal'>(initialTab);
  
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
