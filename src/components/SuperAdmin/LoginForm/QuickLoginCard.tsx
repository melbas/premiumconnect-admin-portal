
import React from 'react';
import { User } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuickLoginCardProps {
  user: User;
  onLogin: (user: User) => void;
  isLoading: boolean;
}

const QuickLoginCard: React.FC<QuickLoginCardProps> = ({ user, onLogin, isLoading }) => {
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
    <Button
      onClick={() => onLogin(user)}
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
  );
};

export default QuickLoginCard;
