
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout, { AdminTab } from './AdminLayout';
import BusinessDashboard from './BusinessDashboard';
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
import SuperAdminAIOpt from './Tabs/SuperAdminAIOpt';
import SuperAdminPortals from './Tabs/SuperAdminPortals';

interface SuperAdminDashboardProps {
  initialTab?: AdminTab;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ initialTab = 'dashboard' }) => {
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
    const validTabs = ['dashboard', 'sites-infrastructure', 'clients-engagement', 'finance-ventes', 'intelligence', 'administration', 'overview', 'technical', 'marketing', 'vouchers', 'users', 'sites', 'wholesalers', 'captive-portal', 'portals', 'analytics', 'ai', 'ai-opt', 'audit', 'settings'];
    if (tab && validTabs.includes(tab)) {
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
    // New business sections
    switch (activeTab) {
      case 'dashboard':
        return <BusinessDashboard userRole="manager" onSectionChange={handleTabChange} />;
      case 'sites-infrastructure':
        return <SuperAdminSites />;
      case 'clients-engagement':
        return <SuperAdminPortals />;
      case 'finance-ventes':
        return <SuperAdminAnalytics />;
      case 'intelligence':
        return <SuperAdminAI />;
      case 'administration':
        return <SuperAdminSettings />;
      
      // Legacy tabs (backward compatibility)
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
      case 'portals':
        return <SuperAdminPortals />;
      case 'analytics':
        return <SuperAdminAnalytics />;
      case 'ai':
        return <SuperAdminAI />;
      case 'ai-opt':
        return <SuperAdminAIOpt />;
      case 'audit':
        return <SuperAdminAudit />;
      case 'settings':
        return <SuperAdminSettings />;
      default:
        return <BusinessDashboard userRole="manager" onSectionChange={handleTabChange} />;
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
