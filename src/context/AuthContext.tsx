
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user roles
export type UserRole = 'superadmin' | 'marketing' | 'technical' | 'voucher_manager';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    email: 'admin@wifisenegal.com',
    role: 'superadmin',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'marketing@wifisenegal.com',
    role: 'marketing',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Omar Sow',
    email: 'tech@wifisenegal.com',
    role: 'technical',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Mariama Bâ',
    email: 'vouchers@wifisenegal.com',
    role: 'voucher_manager',
    avatar: 'https://i.pravatar.cc/150?img=4'
  }
];

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Login handler
  const login = (userData: User) => {
    setUser(userData);
  };

  // Logout handler
  const logout = () => {
    setUser(null);
  };

  // Update current user
  const setCurrentUser = (userData: User) => {
    setUser(userData);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
