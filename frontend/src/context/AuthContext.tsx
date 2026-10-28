import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_EMAILS: Record<Role, { email: string; pass: string }> = {
  student: { email: 'student.aarav@apex.edu', pass: 'Student@123' },
  institution_admin: { email: 'placement@apex.edu', pass: 'Placement@123' },
  faculty: { email: 'faculty.cs@apex.edu', pass: 'Faculty@123' },
  super_admin: { email: 'superadmin@samarthya.ai', pass: 'Admin@123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('samarthya_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('samarthya_token');
      if (token) {
        try {
          const profile = await api.getCurrentUser();
          setUser(profile);
          localStorage.setItem('samarthya_user', JSON.stringify(profile));
        } catch {
          // If token expired, clear
          localStorage.removeItem('samarthya_token');
          localStorage.removeItem('samarthya_user');
          setUser(null);
        }
      } else {
        // Default to demo student on fresh development session
        try {
          const resp = await api.login(DEMO_EMAILS.student.email, DEMO_EMAILS.student.pass);
          localStorage.setItem('samarthya_token', resp.access_token);
          localStorage.setItem('samarthya_user', JSON.stringify(resp.user));
          setUser(resp.user);
        } catch {
          // Keep unauthenticated
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string = 'Password@123') => {
    setIsLoading(true);
    try {
      const resp = await api.login(email, password);
      localStorage.setItem('samarthya_token', resp.access_token);
      localStorage.setItem('samarthya_user', JSON.stringify(resp.user));
      setUser(resp.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const switchDemoRole = async (targetRole: Role) => {
    const creds = DEMO_EMAILS[targetRole];
    await login(creds.email, creds.pass);
  };

  const role: Role = user?.role || 'student';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
