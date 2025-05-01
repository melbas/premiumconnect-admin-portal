
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define user roles
export type UserRole = 'superadmin' | 'marketing' | 'technical';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Context interface
interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  setCurrentUser: () => {},
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Mock login function
  const login = (userData: User) => {
    setUser(userData);
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
  };
  
  // Update current user
  const setCurrentUser = (userData: User) => {
    setUser(userData);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Default mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "admin@premiumconnect.sn",
    role: "superadmin",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "Marketing User",
    email: "marketing@premiumconnect.sn",
    role: "marketing",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "Technical User",
    email: "tech@premiumconnect.sn",
    role: "technical",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];
