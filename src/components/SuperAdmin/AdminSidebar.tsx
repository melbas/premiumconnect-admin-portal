
import React from 'react';
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
  Settings2 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { AdminTab } from './AdminLayout';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const menuGroups = [
  {
    label: "Tableau de Bord",
    items: [
      { id: 'overview' as AdminTab, label: 'Vue d\'ensemble', icon: Home },
      { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
    ]
  },
  {
    label: "Gestion",
    items: [
      { id: 'users' as AdminTab, label: 'Utilisateurs', icon: Users },
      { id: 'sites' as AdminTab, label: 'Sites', icon: MapPin },
      { id: 'wholesalers' as AdminTab, label: 'Grossistes', icon: Building2 },
      { id: 'vouchers' as AdminTab, label: 'Vouchers', icon: Ticket },
    ]
  },
  {
    label: "Portails & Tech",
    items: [
      { id: 'captive-portal' as AdminTab, label: 'Studio Portail', icon: Wifi },
      { id: 'technical' as AdminTab, label: 'Technique', icon: Settings },
    ]
  },
  {
    label: "Marketing & IA",
    items: [
      { id: 'marketing' as AdminTab, label: 'Marketing', icon: TrendingUp },
      { id: 'ai' as AdminTab, label: 'Intelligence IA', icon: Bot },
    ]
  },
  {
    label: "Administration",
    items: [
      { id: 'audit' as AdminTab, label: 'Audit & Logs', icon: FileText },
      { id: 'settings' as AdminTab, label: 'Paramètres', icon: Settings2 },
    ]
  }
];

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wifi className="w-5 h-5 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <div>
              <h2 className="font-semibold text-sm">WiFi Sénégal</h2>
              <p className="text-xs text-muted-foreground">Back-Office</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full justify-start",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                        tooltip={state === "collapsed" ? item.label : undefined}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          © 2024 WiFi Sénégal
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
