
import React, { useState, useEffect } from 'react';
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
  
  // Close sidebar on small screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state and add listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
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
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - positioned fixed on small screens */}
      <div 
        className={`fixed z-40 lg:relative transition-transform duration-300 h-full ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <SuperAdminSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            // Close sidebar on mobile when navigating
            if (window.innerWidth < 1024) {
              setSidebarOpen(false);
            }
          }}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <SuperAdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
        <footer className="text-center py-3 text-xs text-muted-foreground border-t border-border">
          Powered by WifiSénégal.com &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
