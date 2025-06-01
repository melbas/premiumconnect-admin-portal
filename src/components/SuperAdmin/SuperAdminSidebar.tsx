
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminTab } from './AdminLayout';
import {
  LayoutDashboard,
  Settings,
  Users,
  MapPin,
  Activity,
  Store,
  Ticket,
  LineChart,
  ShoppingBag,
  BadgePercent,
  UserSquare,
  X
} from "lucide-react";

interface SuperAdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  value: AdminTab;
  roles?: string[];
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  user
}) => {
  // Define navigation items with optional role restrictions
  const items: SidebarItem[] = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Vue générale",
      value: "overview"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Technique",
      value: "technical",
      roles: ["superadmin", "technical"]
    },
    {
      icon: <BadgePercent className="w-5 h-5" />,
      label: "Marketing",
      value: "marketing",
      roles: ["superadmin", "marketing"]
    },
    {
      icon: <LineChart className="w-5 h-5" />,
      label: "Analytique",
      value: "analytics",
      roles: ["superadmin", "marketing", "technical"]
    },
    {
      icon: <Ticket className="w-5 h-5" />,
      label: "Vouchers",
      value: "vouchers",
      roles: ["superadmin", "voucher_manager", "technical"]
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Utilisateurs",
      value: "users"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Sites",
      value: "sites"
    },
    {
      icon: <Store className="w-5 h-5" />,
      label: "Grossistes",
      value: "wholesalers"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Paramètres",
      value: "settings"
    }
  ];

  // Filter items based on user role if needed
  const filteredItems = user?.role 
    ? items.filter(item => !item.roles || item.roles.includes(user.role))
    : items;

  // Close sidebar when clicking outside on mobile
  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-72 border-r border-border bg-card transition-transform lg:translate-x-0 lg:border-r lg:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">WiFi Sénégal Admin</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {filteredItems.map((item) => (
              <Button
                key={item.value}
                variant={activeTab === item.value ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => {
                  setActiveTab(item.value);
                  handleCloseSidebar();
                }}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user?.name?.charAt(0) || <UserSquare className="h-5 w-5" />}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-muted-foreground">{user?.role || 'Admin'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
