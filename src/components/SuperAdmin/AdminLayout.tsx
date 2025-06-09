
import React from 'react';
import AdminSidebar from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

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
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset>
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
