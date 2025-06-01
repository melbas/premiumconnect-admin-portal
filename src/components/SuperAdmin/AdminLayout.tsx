
import React, { useState } from 'react';
import {
  Home,
  Users,
  MapPin,
  Building2,
  Wifi,
  Settings,
  TrendingUp,
  Ticket,
  BarChart3,
  Bot,
  FileText,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    // Simple navigation without router dependency for now
    console.log(`Switching to tab: ${tab}`);
  };

  const menuItems: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'sites', label: 'Sites', icon: MapPin },
    { id: 'wholesalers', label: 'Grossistes', icon: Building2 },
    { id: 'captive-portal', label: 'Portails Captifs', icon: Wifi },
    { id: 'technical', label: 'Technique', icon: Settings },
    { id: 'marketing', label: 'Marketing', icon: TrendingUp },
    { id: 'vouchers', label: 'Vouchers', icon: Ticket },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'IA & Automation', icon: Bot },
    { id: 'audit', label: 'Audit & Logs', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings2 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-64 h-screen sticky top-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Super Admin
          </h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className={cn(
                    "w-full justify-start",
                    activeTab === item.id 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  onClick={() => handleTabChange(item.id)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
