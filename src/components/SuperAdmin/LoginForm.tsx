
import React, { useState } from 'react';
import { useAuth, mockUsers, User } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, LogIn, User as UserIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  
  // Get redirect path from location state or default to super admin
  const getRedirectPath = () => {
    const from = location.state?.from;
    if (from && from !== '/login') return from;
    return '/super-admin'; // Tous les utilisateurs vont au super admin
  };
  
  // Handle login with credentials
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Find user with matching email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    setTimeout(() => {
      if (user && password) {
        console.log('🔐 Login successful for user:', user);
        login(user);
        
        const redirectPath = getRedirectPath();
        console.log('🔐 Redirecting to:', redirectPath);
        
        toast({
          title: `Bienvenue ${user.name}`,
          description: `Connexion réussie en tant que ${getRoleDisplay(user.role)}`,
          variant: "default",
        });
        
        navigate(redirectPath, { replace: true });
      } else {
        console.log('🔐 Login failed - invalid credentials');
        toast({
          title: "Échec de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };
  
  // Handle quick login with a user
  const handleQuickLogin = (user: User) => {
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('🔐 Quick login successful for user:', user);
      login(user);
      
      const redirectPath = getRedirectPath();
      console.log('🔐 Redirecting to:', redirectPath);
      
      toast({
        title: `Bienvenue ${user.name}`,
        description: `Connexion réussie en tant que ${getRoleDisplay(user.role)}`,
        variant: "default",
      });
      
      navigate(redirectPath, { replace: true });
      setIsLoading(false);
    }, 500);
  };
  
  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'marketing': return 'Marketing';
      case 'technical': return 'Technique';
      case 'voucher_manager': return 'Gestionnaire Vouchers';
      default: return role;
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center">
              <UserIcon size={24} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Wifi Sénégal</CardTitle>
          <CardDescription className="text-center">Connectez-vous au tableau de bord administrateur</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="quick" value={activeTab} onValueChange={(v) => setActiveTab(v as 'quick' | 'credentials')}>
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value="quick">Connexion Rapide</TabsTrigger>
            <TabsTrigger value="credentials">Email & Mot de passe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="space-y-4 p-6 pt-2">
            <div className="flex flex-col space-y-3">
              {mockUsers.map(user => (
                <Button
                  key={user.id}
                  onClick={() => handleQuickLogin(user)}
                  variant="outline"
                  className="flex justify-start items-center space-x-3 h-auto py-3 px-4"
                  disabled={isLoading}
                >
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-muted flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center">
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md mt-1 inline-block">
                      {getRoleDisplay(user.role)}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="credentials">
            <form onSubmit={handleCredentialsLogin} className="space-y-4 p-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nom@wifisenegal.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </span>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex flex-col space-y-2 pt-0">
          <div className="text-xs text-center text-muted-foreground w-full">
            Powered by WifiSénégal.com &copy; {new Date().getFullYear()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
