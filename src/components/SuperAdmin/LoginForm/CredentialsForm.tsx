
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { LoginFormData } from './types';

interface CredentialsFormProps {
  formData: LoginFormData;
  onFormDataChange: (updates: Partial<LoginFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CredentialsForm: React.FC<CredentialsFormProps> = ({ 
  formData, 
  onFormDataChange, 
  onSubmit 
}) => {
  const { email, password, showPassword, isLoading } = formData;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="nom@wifisenegal.com"
          value={email}
          onChange={(e) => onFormDataChange({ email: e.target.value })}
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
            onChange={(e) => onFormDataChange({ password: e.target.value })}
            required
            className="h-10 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => onFormDataChange({ showPassword: !showPassword })}
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
  );
};

export default CredentialsForm;
