
import React, { useState } from 'react';
import { useAuth, mockUsers, User } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, LogIn, User as UserIcon, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  
  const getRedirectPath = () => {
    const from = location.state?.from;
    if (from && from !== '/login') return from;
    return '/super-admin';
  };
  
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      });
      
      navigate(redirectPath, { replace: true });
      setIsLoading(false);
    }, 500);
  };
  
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Super Admin';
      case 'marketing': return 'Marketing';
      case 'technical': return 'Technique';
      case 'voucher_manager': return 'Gestionnaire Vouchers';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-red-500 hover:bg-red-600';
      case 'marketing': return 'bg-blue-500 hover:bg-blue-600';
      case 'technical': return 'bg-green-500 hover:bg-green-600';
      case 'voucher_manager': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Wifi className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">WiFi Sénégal</CardTitle>
            <CardDescription className="text-center">
              Accédez au tableau de bord administrateur
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'quick' | 'credentials')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick">Connexion Rapide</TabsTrigger>
                <TabsTrigger value="credentials">Email & Mot de passe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="quick" className="space-y-3 mt-4">
                <div className="space-y-2">
                  {mockUsers.map(user => (
                    <Button
                      key={user.id}
                      onClick={() => handleQuickLogin(user)}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 hover:bg-accent"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-muted flex-shrink-0">
                          {user.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-medium">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <Badge 
                            className={`text-xs mt-1 text-white ${getRoleColor(user.role)}`}
                            variant="secondary"
                          >
                            {getRoleDisplay(user.role)}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="credentials" className="space-y-4 mt-4">
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="nom@wifisenegal.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10"
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
                        className="h-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 
                          <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        }
                        <span className="sr-only">
                          {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-10"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connexion...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Se connecter
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 pt-2">
            <div className="text-xs text-center text-muted-foreground">
              Powered by WiFi Sénégal &copy; {new Date().getFullYear()}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
