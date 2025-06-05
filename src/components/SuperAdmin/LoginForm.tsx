
import React, { useState } from 'react';
import { useAuth, mockUsers, User } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginHeader from './LoginForm/LoginHeader';
import QuickLoginCard from './LoginForm/QuickLoginCard';
import CredentialsForm from './LoginForm/CredentialsForm';
import { LoginFormData } from './LoginForm/types';

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    showPassword: false,
    isLoading: false,
    activeTab: 'quick'
  });
  
  const getRedirectPath = () => {
    const from = location.state?.from;
    if (from && from !== '/login') return from;
    return '/super-admin';
  };

  const updateFormData = (updates: Partial<LoginFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
  
  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({ isLoading: true });
    
    const user = mockUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
    
    setTimeout(() => {
      if (user && formData.password) {
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
      updateFormData({ isLoading: false });
    }, 800);
  };
  
  const handleQuickLogin = (user: User) => {
    updateFormData({ isLoading: true });
    
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
      updateFormData({ isLoading: false });
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
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <LoginHeader />
          
          <CardContent className="space-y-4">
            <Tabs value={formData.activeTab} onValueChange={(v) => updateFormData({ activeTab: v as 'quick' | 'credentials' })}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick">Connexion Rapide</TabsTrigger>
                <TabsTrigger value="credentials">Email & Mot de passe</TabsTrigger>
              </TabsList>
              
              <TabsContent value="quick" className="space-y-3 mt-4">
                <div className="space-y-2">
                  {mockUsers.map(user => (
                    <QuickLoginCard
                      key={user.id}
                      user={user}
                      onLogin={handleQuickLogin}
                      isLoading={formData.isLoading}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="credentials" className="space-y-4 mt-4">
                <CredentialsForm
                  formData={formData}
                  onFormDataChange={updateFormData}
                  onSubmit={handleCredentialsLogin}
                />
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
