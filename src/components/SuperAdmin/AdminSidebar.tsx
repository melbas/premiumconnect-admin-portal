
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  ShoppingBag, 
  Wifi, 
  Settings, 
  BarChart3, 
  Brain,
  Zap,
  Shield,
  FileText
} from 'lucide-react';
import { AdminTab } from './AdminLayout';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'sites', label: 'Sites', icon: Building },
    { id: 'wholesalers', label: 'Grossistes', icon: ShoppingBag },
    { id: 'captive-portal', label: 'Portail Captif', icon: Wifi },
    { id: 'technical', label: 'Technique', icon: Settings },
    { id: 'marketing', label: 'Marketing', icon: BarChart3 },
    { id: 'vouchers', label: 'Codes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'IA Assistant', icon: Brain },
    { id: 'ai-opt', label: 'Optimisation IA', icon: Zap, badge: 'Nouveau' },
    { id: 'audit', label: 'Audit & Sécurité', icon: Shield },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <h2 className="text-xl font-bold">SuperAdmin</h2>
        <p className="text-sm text-muted-foreground">Portail d'administration</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeTab === item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
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
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          Version 2.0 - IA Contextuelle
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
