
import React from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, Layout, BarChart3, Settings, MonitorSmartphone, Wifi } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AdminTab, rolePermissions } from './AdminLayout';

interface SuperAdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Array of navigation items
const navItems = [
  { id: 'overview' as AdminTab, label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
  { id: 'wholesalers' as AdminTab, label: 'Grossistes', icon: <Users size={20} /> },
  { id: 'sites' as AdminTab, label: 'Sites', icon: <Layout size={20} /> },
  { id: 'marketing' as AdminTab, label: 'Marketing', icon: <BarChart3 size={20} /> },
  { id: 'technical' as AdminTab, label: 'Technique', icon: <MonitorSmartphone size={20} /> },
  { id: 'settings' as AdminTab, label: 'Paramètres', icon: <Settings size={20} /> },
];

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<AdminTab>('overview');

  // Filter navigation items based on user role
  const filteredNavItems = user ? navItems.filter(item => 
    rolePermissions[user.role].includes(item.id)
  ) : [];

  return (
    <div 
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 h-full flex flex-col ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {isOpen ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Wifi size={18} className="text-white" />
            </div>
            <span className="ml-2 font-bold text-sidebar-foreground">Wifi Sénégal</span>
          </div>
        ) : (
          <div className="h-8 w-8 mx-auto rounded-md bg-primary flex items-center justify-center">
            <Wifi size={18} className="text-white" />
          </div>
        )}
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sidebar-foreground p-1 rounded-full hover:bg-sidebar-accent focus:outline-none"
          aria-label={isOpen ? "Réduire le menu" : "Élargir le menu"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-5 pb-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${!isOpen ? "justify-center" : ""}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with domain info */}
      <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground text-center">
        {isOpen ? "WifiSénégal.com v1.0" : "v1.0"}
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
