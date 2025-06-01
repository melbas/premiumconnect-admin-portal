
import React from 'react';
import { Home, Settings, TrendingUp, Ticket, Users, MapPin, Building, BarChart3, Cog, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AdminTab } from './AdminLayout';

interface SuperAdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  user 
}) => {
  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Vue d\'ensemble', icon: Home },
    { id: 'technical' as AdminTab, label: 'Technique', icon: Settings },
    { id: 'marketing' as AdminTab, label: 'Marketing', icon: TrendingUp },
    { id: 'vouchers' as AdminTab, label: 'Vouchers', icon: Ticket },
    { id: 'users' as AdminTab, label: 'Utilisateurs', icon: Users },
    { id: 'sites' as AdminTab, label: 'Sites', icon: MapPin },
    { id: 'wholesalers' as AdminTab, label: 'Grossistes', icon: Building },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'ai' as AdminTab, label: 'Intelligence IA', icon: Brain },
    { id: 'settings' as AdminTab, label: 'Paramètres', icon: Cog }
  ];

  return (
    <div className={cn(
      "flex-shrink-0 border-r bg-secondary transition-all duration-300",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      <div className="h-full p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center space-x-2 w-full p-2 rounded-md hover:bg-muted transition-colors",
              activeTab === item.id ? "bg-muted font-medium" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab(item.id)}
            title={!sidebarOpen ? item.label : undefined}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
