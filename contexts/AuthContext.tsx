
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';
import { loginUser } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('synergy-crm-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect is mainly to handle the initial load.
    // In a real app, you'd validate the token here.
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    const loggedInUser = await loginUser(email);
    if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('synergy-crm-user', JSON.stringify(loggedInUser));
    } else {
        // Handle login failure
        console.error("Login failed");
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('synergy-crm-user');
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};