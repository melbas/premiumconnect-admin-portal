import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth, mockUsers } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Lock, LogIn, Users } from 'lucide-react';

const Auth = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Recherche de l'utilisateur dans les mockUsers
      const user = mockUsers.find(
        (u) => u.email === loginEmail && u.password === loginPassword
      );

      if (!user) {
        setError('Email ou mot de passe incorrect');
        setIsLoading(false);
        return;
      }

      // Connexion via le contexte
      login(user);

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${user.name} - ${user.role}`,
      });

      // Redirection
      navigate('/super-admin');
    } catch (err: any) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (user: typeof mockUsers[0]) => {
    setIsLoading(true);
    login(user);
    toast({
      title: "Connexion rapide",
      description: `Connecté en tant que ${user.name}`,
    });
    setTimeout(() => {
      navigate('/super-admin');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* Quick Login Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockUsers.map((user) => (
            <Card 
              key={user.id} 
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => handleQuickLogin(user)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-primary font-medium mt-1">{user.role}</p>
                  </div>
                  <Button size="sm" className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion rapide
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Standard Login Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Administration WiFi Sénégal</CardTitle>
            <CardDescription>
              Mode test - Connexion simplifiée
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@wifisenegal.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold mb-2">Comptes de test disponibles :</p>
              {mockUsers.map((user) => (
                <div key={user.id} className="text-xs text-muted-foreground mb-1">
                  <span className="font-mono">{user.email}</span> - 
                  <span className="ml-1">Pass: {user.password}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;