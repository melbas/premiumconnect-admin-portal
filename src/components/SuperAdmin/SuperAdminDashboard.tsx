
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useAuth, mockUsers } from '@/context/AuthContext';
import SuperAdminOverview from './Tabs/SuperAdminOverview';
import SuperAdminWholesalers from './Tabs/SuperAdminWholesalers';
import SuperAdminSites from './Tabs/SuperAdminSites';
import SuperAdminMarketing from './Tabs/SuperAdminMarketing';
import SuperAdminTechnical from './Tabs/SuperAdminTechnical';
import SuperAdminVouchers from './Tabs/SuperAdminVouchers';
import SuperAdminSettings from './Tabs/SuperAdminSettings';
import { AdminTab, rolePermissions } from './AdminLayout';
import { useToast } from '@/hooks/use-toast';

// Login form for demonstration
const LoginForm = () => {
  const { login } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Wifi Sénégal</h1>
          <p className="text-sm text-muted-foreground">Super Admin Dashboard</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Choisissez un utilisateur</h2>
          <div className="flex flex-col space-y-3">
            {mockUsers.map(user => (
              <button
                key={user.id}
                onClick={() => login(user)}
                className="flex items-center space-x-3 rounded-md border border-border p-3 hover:bg-secondary"
              >
                <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs font-semibold uppercase text-primary">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SuperAdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { toast } = useToast();
  
  React.useEffect(() => {
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
  
  // RBAC check - redirect to first allowed tab if current tab is not accessible
  if (user && !rolePermissions[user.role].includes(activeTab)) {
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
