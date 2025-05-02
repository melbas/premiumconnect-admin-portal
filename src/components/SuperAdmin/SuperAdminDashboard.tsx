
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '@/context/AuthContext';
import SuperAdminOverview from './Tabs/SuperAdminOverview';
import SuperAdminWholesalers from './Tabs/SuperAdminWholesalers';
import SuperAdminSites from './Tabs/SuperAdminSites';
import SuperAdminMarketing from './Tabs/SuperAdminMarketing';
import SuperAdminTechnical from './Tabs/SuperAdminTechnical';
import SuperAdminVouchers from './Tabs/SuperAdminVouchers';
import SuperAdminSettings from './Tabs/SuperAdminSettings';
import { AdminTab, rolePermissions } from './AdminLayout';
import { useToast } from '@/hooks/use-toast';
import LoginForm from './LoginForm';

const SuperAdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { toast } = useToast();
  
  useEffect(() => {
    // Notify user when tab changes
    if (isAuthenticated) {
      toast({
        title: `Onglet ${activeTab}`,
        description: `Vous avez accédé à l'onglet ${activeTab}`,
      });
    }
  }, [activeTab, isAuthenticated, toast]);
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  // Verify current user has access to this tab
  if (user && !rolePermissions[user.role].includes(activeTab)) {
    // Automatically switch to first allowed tab
    setActiveTab(rolePermissions[user.role][0]);
  }

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminOverview />;
      case 'wholesalers':
        return <SuperAdminWholesalers />;
      case 'sites':
        return <SuperAdminSites />;
      case 'marketing':
        return <SuperAdminMarketing />;
      case 'technical':
        return <SuperAdminTechnical />;
      case 'vouchers':
        return <SuperAdminVouchers />;
      case 'settings':
        return <SuperAdminSettings />;
      default:
        return <SuperAdminOverview />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-fade-in">
        {renderTabContent()}
      </div>
    </AdminLayout>
  );
};

export default SuperAdminDashboard;
