import React from 'react';
import AdminSidebar from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export type AdminTab = 
  | 'overview' 
  | 'technical' 
  | 'marketing' 
  | 'vouchers' 
  | 'users' 
  | 'sites' 
  | 'wholesalers' 
  | 'captive-portal'
  | 'portals'
  | 'analytics' 
  | 'ai' 
  | 'ai-opt' 
  | 'audit' 
  | 'settings';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
