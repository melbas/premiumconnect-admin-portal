import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
import SuperAdminAI from './Tabs/SuperAdminAI';
import SuperAdminAudit from './Tabs/SuperAdminAudit';

interface SuperAdminDashboardProps {
  initialTab?: AdminTab;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ initialTab = 'overview' }) => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: window.location.pathname },
        replace: true 
      });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Determine initial active tab from URL or props
  const getInitialTab = (): AdminTab => {
    if (tab && ['overview', 'technical', 'marketing', 'vouchers', 'users', 'sites', 'wholesalers', 'captive-portal', 'analytics', 'ai', 'audit', 'settings'].includes(tab)) {
      return tab as AdminTab;
    }
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getInitialTab());

  // Update URL when tab changes
  const handleTabChange = (newTab: AdminTab) => {
    setActiveTab(newTab);
    // Update URL without causing a full page reload
    window.history.pushState({}, '', `/super-admin/${newTab}`);
  };
  
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
      case 'ai':
        return <SuperAdminAI />;
      case 'audit':
        return <SuperAdminAudit />;
      case 'settings':
        return <SuperAdminSettings />;
      default:
        return <SuperAdminOverview />;
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default SuperAdminDashboard;
