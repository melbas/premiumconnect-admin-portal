
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
  Palette,
  MapPin,
  TrendingUp,
  ChevronDown,
  ChevronRight
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
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['dashboard']));

  const businessSections = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: LayoutDashboard,
      tab: 'dashboard' as AdminTab,
      description: 'Vue d\'ensemble personnalisée'
    },
    {
      id: 'sites-infrastructure',
      label: 'Sites & Infrastructure',
      icon: MapPin,
      tab: 'sites-infrastructure' as AdminTab,
      description: 'Gestion réseau et équipements',
      subsections: [
        { label: 'Vue d\'ensemble', tab: 'sites' as AdminTab },
        { label: 'Technique', tab: 'technical' as AdminTab }
      ]
    },
    {
      id: 'clients-engagement',
      label: 'Clients & Engagement',
      icon: Users,
      tab: 'clients-engagement' as AdminTab,
      description: 'Portails, CRM et campagnes',
      subsections: [
        { label: 'Portails', tab: 'portals' as AdminTab },
        { label: 'Marketing', tab: 'marketing' as AdminTab },
        { label: 'Utilisateurs', tab: 'users' as AdminTab }
      ]
    },
    {
      id: 'finance-ventes',
      label: 'Finance & Ventes',
      icon: TrendingUp,
      tab: 'finance-ventes' as AdminTab,
      description: 'Revenus et analytics',
      subsections: [
        { label: 'Analytics', tab: 'analytics' as AdminTab },
        { label: 'Vouchers', tab: 'vouchers' as AdminTab },
        { label: 'Grossistes', tab: 'wholesalers' as AdminTab }
      ]
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      icon: Brain,
      tab: 'intelligence' as AdminTab,
      description: 'IA et optimisation',
      subsections: [
        { label: 'IA Dashboard', tab: 'ai' as AdminTab },
        { label: 'Optimisation', tab: 'ai-opt' as AdminTab }
      ]
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: Shield,
      tab: 'administration' as AdminTab,
      description: 'Sécurité et paramètres',
      subsections: [
        { label: 'Audit', tab: 'audit' as AdminTab },
        { label: 'Paramètres', tab: 'settings' as AdminTab }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

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
          <SidebarGroupLabel>Navigation Métier</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessSections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.has(section.id);
                const isActive = activeTab === section.tab || 
                  (section.subsections?.some(sub => sub.tab === activeTab));

                return (
                  <div key={section.id}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => {
                          if (section.subsections && section.subsections.length > 0) {
                            toggleSection(section.id);
                          } else {
                            setActiveTab(section.tab);
                          }
                        }}
                        className="w-full flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Icon className="h-4 w-4" />
                          <span>{section.label}</span>
                        </div>
                        {section.subsections && section.subsections.length > 0 && (
                          <div className="ml-auto">
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    {/* Subsections */}
                    {section.subsections && isExpanded && (
                      <div className="ml-6 space-y-1">
                        {section.subsections.map((subsection) => (
                          <SidebarMenuItem key={subsection.tab}>
                            <SidebarMenuButton
                              isActive={activeTab === subsection.tab}
                              onClick={() => setActiveTab(subsection.tab)}
                              className="text-sm"
                            >
                              <span>{subsection.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    )}
                  </div>
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
