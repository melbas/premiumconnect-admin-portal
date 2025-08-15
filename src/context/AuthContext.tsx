
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

// Mock users for demonstration
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Amadou Diallo',
    email: 'admin@wifisenegal.com',
    role: 'superadmin',
    avatar: '/assets/profiles/amadou.jpg'
  },
  {
    id: '2',
    name: 'Fatou Ndiaye',
    email: 'marketing@wifisenegal.com',
    role: 'marketing',
    avatar: '/assets/profiles/fatou.jpg'
  },
  {
    id: '3',
    name: 'Omar Sow',
    email: 'tech@wifisenegal.com',
    role: 'technical',
    avatar: '/assets/profiles/omar.jpg'
  },
  {
    id: '4',
    name: 'Mariama Bâ',
    email: 'vouchers@wifisenegal.com',
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

  // Initialize auth state and set up listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          const mappedUser = mapSupabaseUser(session.user);
          setUser(mappedUser);
          console.log('🔐 User authenticated:', mappedUser);
        } else {
          setUser(null);
          console.log('🔐 User logged out');
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
        console.log('🔐 Existing session found:', mappedUser);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login handler (for compatibility with existing code)
  const login = (userData: User) => {
    console.log('🔐 Manual login called:', userData);
    setUser(userData);
  };

  // Logout handler
  const logout = async () => {
    console.log('🔐 Logging out user');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Update current user (for compatibility)
  const setCurrentUser = (userData: User) => {
    console.log('🔐 Updating current user:', userData);
    setUser(userData);
  };

  // Context value
  const value = {
    user,
    session,
    isAuthenticated: !!user && !!session,
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
