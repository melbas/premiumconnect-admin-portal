
import React, { useState } from 'react';
import { Menu, Bell, User, Edit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfileImageUploader from '@/components/ui/profile-image-uploader';

interface SuperAdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout, setCurrentUser } = useAuth();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleProfileImageUpdate = (avatarUrl: string) => {
    if (user) {
      setCurrentUser({
        ...user,
        avatar: avatarUrl
      });
    }
  };

  return (
    <header className="bg-background z-20 border-b border-border flex items-center h-16 px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-md text-muted-foreground hover:bg-secondary mr-4 lg:hidden"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle sidebar</span>
      </button>

      <h1 className="font-semibold text-lg mr-auto">WiFi Sénégal Admin</h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-md text-muted-foreground hover:bg-secondary">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="p-3 text-sm border-b last:border-0">
                <div className="font-medium">Nouvelle demande d'accès</div>
                <div className="text-muted-foreground">Une demande d'accès a été soumise par un nouveau grossiste.</div>
                <div className="text-xs text-muted-foreground mt-1">Il y a 5 minutes</div>
              </div>
              <div className="p-3 text-sm border-b last:border-0">
                <div className="font-medium">Panne signalée - Site Thiès Ouest</div>
                <div className="text-muted-foreground">Plusieurs appareils sont hors ligne.</div>
                <div className="text-xs text-muted-foreground mt-1">Il y a 30 minutes</div>
              </div>
              <div className="p-3 text-sm border-b last:border-0">
                <div className="font-medium">Maintenance système planifiée</div>
                <div className="text-muted-foreground">Une maintenance est prévue demain à 02h00.</div>
                <div className="text-xs text-muted-foreground mt-1">Il y a 2 heures</div>
              </div>
            </div>
            <DropdownMenuItem className="cursor-pointer w-full text-center flex justify-center py-2 mt-1">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md p-2 hover:bg-secondary">
              <div className="relative">
                <Avatar>
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <span className="hidden md:inline text-sm font-medium">{user?.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => setProfileDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Changer la photo de profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile Image Uploader Dialog */}
      <ProfileImageUploader
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        currentAvatar={user?.avatar}
        userName={user?.name || ''}
        onSave={handleProfileImageUpdate}
      />
    </header>
  );
};

export default SuperAdminHeader;
