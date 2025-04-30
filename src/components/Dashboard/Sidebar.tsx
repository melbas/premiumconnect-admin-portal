
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

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }: SidebarProps) => {
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
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {isOpen ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold">PC</span>
            </div>
            <span className="ml-2 font-bold text-sidebar-foreground">PremiumConnect</span>
          </div>
        ) : (
          <div className="h-8 w-8 mx-auto rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold">PC</span>
          </div>
        )}
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sidebar-foreground p-1 rounded-full hover:bg-sidebar-accent focus:outline-none"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-5 pb-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } ${!isOpen ? "justify-center" : ""}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <button 
          className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
