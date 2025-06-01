
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('wifisenegal_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('🔐 Restored user from localStorage:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('🔐 No stored user found');
        }
      } catch (error) {
        console.error('🔐 Error parsing stored user:', error);
        localStorage.removeItem('wifisenegal_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler with persistence
  const login = (userData: User) => {
    console.log('🔐 Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('wifisenegal_user', JSON.stringify(userData));
  };

  // Logout handler with cleanup
  const logout = () => {
    console.log('🔐 Logging out user');
    setUser(null);
    localStorage.removeItem('wifisenegal_user');
  };

  // Update current user with persistence
  const setCurrentUser = (userData: User) => {
    console.log('🔐 Updating current user:', userData);
    setUser(userData);
    localStorage.setItem('wifisenegal_user', JSON.stringify(userData));
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
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
