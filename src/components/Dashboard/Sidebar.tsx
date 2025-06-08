
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
}

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab, isMobile = false }: SidebarProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "clients", label: "Clients", icon: <Users size={20} /> },
    { id: "sales", label: "Sales", icon: <BarChart3 size={20} /> },
    { id: "statistics", label: "Statistics", icon: <TrendingUp size={20} /> },
    { id: "discussions", label: "Discussions", icon: <MessageSquare size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div 
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 h-full flex flex-col ${
        isOpen ? "w-64" : "w-20"
      } ${isMobile ? "w-full border-none" : ""}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {isOpen || isMobile ? (
          <div className="flex items-center animate-fade-in">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold">PC</span>
            </div>
            <span className="ml-2 font-bold text-sidebar-foreground">PremiumConnect</span>
          </div>
        ) : (
          <div className="h-8 w-8 mx-auto rounded-md bg-primary flex items-center justify-center hover:scale-110 transition-transform duration-200">
            <span className="text-white font-bold">PC</span>
          </div>
        )}
        
        {!isMobile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-sidebar-foreground p-1 rounded-full hover:bg-sidebar-accent focus:outline-none transition-all duration-200 hover:scale-110"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-5 pb-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 group ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-105"
                } ${!isOpen && !isMobile ? "justify-center" : ""}`}
              >
                <span className={`flex-shrink-0 transition-transform duration-200 ${
                  activeTab === item.id ? "" : "group-hover:scale-110"
                }`}>
                  {item.icon}
                </span>
                {(isOpen || isMobile) && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <AnimatedButton 
          variant="ghost"
          className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
            !isOpen && !isMobile ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {(isOpen || isMobile) && <span className="ml-3">Logout</span>}
        </AnimatedButton>
      </div>
    </div>
  );
};

export default Sidebar;
