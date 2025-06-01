import React, { useState } from 'react';
import SuperAdminHeader from './SuperAdminHeader';
import SuperAdminSidebar from './SuperAdminSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

export type AdminTab = 
  | 'overview' 
  | 'technical' 
  | 'marketing' 
  | 'vouchers' 
  | 'users' 
  | 'sites' 
  | 'wholesalers' 
  | 'captive-portal' 
  | 'analytics'
  | 'ai'
  | 'settings';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children,
  activeTab,
  setActiveTab
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SuperAdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex">
        <SuperAdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-6 py-6">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            {children}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
