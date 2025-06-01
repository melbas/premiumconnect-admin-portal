
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'sites' 
  | 'wholesalers' 
  | 'captive-portal' 
  | 'technical' 
  | 'marketing' 
  | 'vouchers' 
  | 'analytics' 
  | 'ai'
  | 'audit'
  | 'settings';

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <SidebarProvider defaultOpen={true} collapsedSize="4rem">
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
