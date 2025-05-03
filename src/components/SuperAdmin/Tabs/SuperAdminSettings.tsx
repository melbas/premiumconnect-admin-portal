
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Bell, BellOff, Upload, Edit, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfileImageUploader from '@/components/ui/profile-image-uploader';

const SuperAdminSettings: React.FC = () => {
  const { user, setCurrentUser } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [notifications, setNotifications] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  // Dialog state for profile image uploader
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      setCurrentUser({
        ...user,
        name: formData.name,
        email: formData.email,
      });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations de profil ont été mises à jour avec succès.",
      });
    }
  };
  
  // Handle profile image update
  const handleProfileImageUpdate = (avatarUrl: string) => {
    if (user) {
      setCurrentUser({
        ...user,
        avatar: avatarUrl
      });
    }
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setNotifications(!notifications);
    
    toast({
      title: notifications ? "Notifications désactivées" : "Notifications activées",
      description: notifications 
        ? "Vous ne recevrez plus de notifications." 
        : "Vous recevrez maintenant des notifications.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="dashboard-title">Paramètres</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Gérez les informations de votre profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <button 
                    type="button" 
                    className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm"
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    <Edit size={14} />
                  </button>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'superadmin' ? 'Super Admin' : 
                     user?.role === 'marketing' ? 'Marketing' : 
                     user?.role === 'technical' ? 'Technique' : 'Gestionnaire de Vouchers'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  value={user?.role === 'superadmin' ? 'Super Admin' : 
                         user?.role === 'marketing' ? 'Marketing' : 
                         user?.role === 'technical' ? 'Technique' : 'Gestionnaire de Vouchers'}
                  disabled
                />
              </div>
              
              <Button type="submit">
                Mettre à jour le profil
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
            <CardDescription>
              Personnalisez votre expérience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">Thème</h3>
                <p className="text-sm text-muted-foreground">
                  Basculer entre les thèmes clair et sombre
                </p>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleDarkMode}
                className="h-10 w-10"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            </div>
            
            {/* Notifications toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Activer ou désactiver les notifications
                </p>
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={toggleNotifications}
                className="h-10 w-10"
              >
                {notifications ? <Bell size={18} /> : <BellOff size={18} />}
              </Button>
            </div>
            
            {/* Language selection - simplified version */}
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <select
                id="language"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="wo">Wolof</option>
              </select>
            </div>
            
            <Button variant="secondary">
              Enregistrer les préférences
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>À propos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>PremiumConnect Super Admin Dashboard</strong></p>
            <p className="text-sm text-muted-foreground">
              Version 1.0.0 | © 2025 PremiumConnect
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Profile Image Uploader Dialog */}
      <ProfileImageUploader
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        currentAvatar={user?.avatar}
        userName={user?.name || ''}
        onSave={handleProfileImageUpdate}
      />
    </div>
  );
};

export default SuperAdminSettings;
