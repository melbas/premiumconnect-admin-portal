
import React, { useState } from 'react';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';
import { useAuth, UserRole } from '@/context/AuthContext';

// Define tab types for navigation
export type AdminTab = 'overview' | 'wholesalers' | 'sites' | 'marketing' | 'technical' | 'vouchers' | 'settings';

// Define which roles can access which tabs
export const rolePermissions: Record<UserRole, AdminTab[]> = {
  superadmin: ['overview', 'wholesalers', 'sites', 'marketing', 'technical', 'vouchers', 'settings'],
  marketing: ['marketing', 'overview'],
  technical: ['technical', 'sites', 'overview'],
  voucher_manager: ['vouchers', 'overview']
};

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  
  // If no user is logged in, show a message
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-xl">Veuillez vous connecter pour accéder au tableau de bord administrateur.</p>
      </div>
    );
  }

  // Get allowed tabs for the current user role
  const allowedTabs = rolePermissions[user.role] || [];
  
  // If current active tab is not allowed, redirect to first allowed tab
  if (!allowedTabs.includes(activeTab) && allowedTabs.length > 0) {
    setActiveTab(allowedTabs[0]);
    return null; // Return null to prevent flash of content
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <SuperAdminSidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <SuperAdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
        <footer className="text-center py-3 text-xs text-muted-foreground border-t border-border">
          Powered by WifiSénégal.com &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
