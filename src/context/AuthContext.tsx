
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the user roles
export type UserRole = 'superadmin' | 'admin' | 'marketing' | 'technical' | 'voucher_manager';

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
  session: Session | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setCurrentUser: (user: User) => void;
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration (with passwords for test mode)
export interface MockUser extends User {
  password: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    email: 'admin@wifisenegal.com',
    password: 'admin123',
    role: 'superadmin',
    avatar: '/assets/profiles/amadou.jpg'
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'marketing@wifisenegal.com',
    password: 'marketing123',
    role: 'marketing',
    avatar: '/assets/profiles/fatou.jpg'
  },
  {
    id: '3',
    name: 'Omar Sow',
    email: 'tech@wifisenegal.com',
    password: 'tech123',
    role: 'technical',
    avatar: '/assets/profiles/omar.jpg'
  },
  {
    id: '4',
    name: 'Mariama Bâ',
    email: 'vouchers@wifisenegal.com',
    password: 'voucher123',
    role: 'voucher_manager',
    avatar: '/assets/profiles/mariama.jpg'
  }
];

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our User interface
  const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Admin',
      email: supabaseUser.email || '',
      role: (supabaseUser.user_metadata?.role as UserRole) || 'admin',
      avatar: supabaseUser.user_metadata?.avatar_url
    };
  };

  // Initialize auth state - Mock mode only (no Supabase interference)
  useEffect(() => {
    // Check localStorage for existing mock session
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('🔐 Mock session restored:', parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login handler (for mock mode)
  const login = (userData: User) => {
    console.log('🔐 Manual login called:', userData);
    setUser(userData);
    // Persist to localStorage for mock sessions
    localStorage.setItem('mockUser', JSON.stringify(userData));
  };

  // Logout handler
  const logout = async () => {
    console.log('🔐 Logging out user');
    setUser(null);
    setSession(null);
    localStorage.removeItem('mockUser');
  };

  // Update current user (for compatibility)
  const setCurrentUser = (userData: User) => {
    console.log('🔐 Updating current user:', userData);
    setUser(userData);
    localStorage.setItem('mockUser', JSON.stringify(userData));
  };

  // Context value
  const value = {
    user,
    session,
    isAuthenticated: !!user, // Mock mode: only check user, not session
    login,
    logout,
    setCurrentUser,
    isLoading
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
