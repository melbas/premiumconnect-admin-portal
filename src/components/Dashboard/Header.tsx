
import React, { useState, useEffect } from "react";
import { Bell, MessageSquare, Moon, Search, Sun } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileNav?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, mobileNav }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <header className="bg-background border-b border-border h-16 transition-all duration-200">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile Navigation */}
          {mobileNav}
          
          {/* Search */}
          <div className="relative flex-1 max-w-md ml-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="w-full p-2 pl-10 text-sm rounded-md bg-muted/40 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 focus:bg-background"
            />
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-muted/40 relative transition-all duration-200 hover:scale-110">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full animate-pulse"></span>
          </button>
          
          {/* Messages */}
          <button className="p-2 rounded-full hover:bg-muted/40 relative transition-all duration-200 hover:scale-110">
            <MessageSquare size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
          </button>
          
          {/* Theme Toggle */}
          <button 
            className="p-2 rounded-full hover:bg-muted/40 transition-all duration-200 hover:scale-110"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-3 hover:bg-muted/40 rounded-lg p-2 transition-all duration-200 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium hover:scale-110 transition-transform duration-200">
              JD
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
