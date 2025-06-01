import React from 'react';
import { Home, Settings, TrendingUp, Ticket, Users, MapPin, Building, BarChart3, Cog, Brain } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SuperAdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'technical', label: 'Technique', icon: Settings },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'vouchers', label: 'Vouchers', icon: Ticket },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'sites', label: 'Sites', icon: MapPin },
    { id: 'wholesalers', label: 'Grossistes', icon: Building },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'Intelligence IA', icon: Brain },
    { id: 'settings', label: 'Paramètres', icon: Cog }
  ];

  return (
    <div className="w-64 flex-shrink-0 border-r bg-secondary">
      <div className="h-full p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center space-x-2 w-full p-2 rounded-md hover:bg-muted",
              activeTab === item.id ? "bg-muted font-medium" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
