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
import { Sidebar } from 'flowbite-react';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    router.push(`/super-admin?tab=${tab}`);
  };

  const menuItems = [
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
      <Sidebar className="w-64 h-screen sticky top-0">
        <Sidebar.Items>
          {menuItems.map((item) => (
            <Sidebar.Item
              key={item.id}
              icon={item.icon}
              active={activeTab === item.id}
              onClick={() => handleTabChange(item.id)}
            >
              {item.label}
            </Sidebar.Item>
          ))}
        </Sidebar.Items>
      </Sidebar>

      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
