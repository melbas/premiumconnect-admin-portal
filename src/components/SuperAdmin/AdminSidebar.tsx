
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Settings, 
  Server, 
  Megaphone, 
  Ticket, 
  Users, 
  Building, 
  Users2, 
  Globe, 
  BarChart3, 
  Brain, 
  Shield, 
  Zap,
  Palette
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { AdminTab } from './AdminLayout';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: 'overview' as AdminTab, label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'sites' as AdminTab, label: 'Sites', icon: Building },
    { id: 'wholesalers' as AdminTab, label: 'Grossistes', icon: Users2 },
    { id: 'users' as AdminTab, label: 'Utilisateurs', icon: Users },
    { id: 'portals' as AdminTab, label: 'Portails Captifs', icon: Palette, badge: 'Nouveau' },
    { id: 'technical' as AdminTab, label: 'Technique', icon: Server },
    { id: 'marketing' as AdminTab, label: 'Marketing', icon: Megaphone },
    { id: 'vouchers' as AdminTab, label: 'Vouchers', icon: Ticket },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    { id: 'ai' as AdminTab, label: 'IA', icon: Brain },
    { id: 'ai-opt' as AdminTab, label: 'IA Optimisation', icon: Zap },
    { id: 'audit' as AdminTab, label: 'Audit', icon: Shield },
    { id: 'settings' as AdminTab, label: 'Paramètres', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2">
          <h2 className="text-xl font-bold text-primary">Super Admin</h2>
          <p className="text-sm text-muted-foreground">Tableau de bord</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
