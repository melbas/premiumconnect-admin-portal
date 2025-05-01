
import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SuperAdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      {/* Left side - Menu toggle */}
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle */}
        <button 
          onClick={toggleDarkMode} 
          className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
          <Bell size={20} />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2 rounded-md p-2 text-foreground hover:bg-secondary"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-secondary">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-full w-full p-1" />
              )}
            </div>
            <span className="hidden text-sm font-medium md:block">{user?.name}</span>
            <ChevronDown size={16} />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-background py-1 shadow-lg">
              <div className="border-b border-border px-4 py-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="mt-1 text-xs font-medium text-primary capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-secondary"
              >
                <LogOut size={16} className="mr-2" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
