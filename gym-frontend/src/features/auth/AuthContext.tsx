import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService, User, ApiError, login, me, logout as authLogout } from './authService';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  ready: boolean;
  status: Status;
  user: User | null;
  role: User['role'] | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean; // legacy, mapped from status
  error: string | null;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  ready: false,
  status: 'loading',
  user: null,
  role: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
  error: null,
  hasPermission: () => false,
});

// Normalize backend roles (ADMIN/TRAINER/RECEPTION/MEMBER) to our permission set
const rolePermissions: Record<string, string[]> = {
  ADMIN: [
    'view_dashboard',
    'manage_members',
    'manage_plans',
    'manage_payments',
    'manage_attendance',
    'manage_classes',
    'manage_assets',
    'view_reports',
    'manage_settings',
    'view_finance',
    'manage_all'
  ],
  TRAINER: [
    'view_dashboard',
    'manage_attendance',
    'manage_attendance',
    'manage_classes',
    'view_reports'
  ],
  RECEPTION: [
    'view_dashboard',
    'manage_members',
    'manage_attendance',
    'manage_payments'
  ],
  MEMBER: [
    'view_dashboard',
    'view_own_profile',
    'view_own_attendance',
    'view_own_payments'
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  // Bootstrap auth state on mount
  useEffect(() => {
    const bootstrap = async () => {
      if (!authService.isAuthenticated()) {
        setUser(null);
        setStatus('unauthenticated');
        return;
      }
      try {
        const userData = await me();
        if (userData.role) {
          userData.role = String(userData.role).toUpperCase() as User['role'];
        }
        setUser(userData);
        setStatus('authenticated');
      } catch (err) {
        console.error('Failed to get user info:', err);
        authLogout();
        setUser(null);
        setStatus('unauthenticated');
      }
    };
    bootstrap();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setStatus('loading');
    try {
      const userData = await login(email, password);
      if (userData.role) {
        userData.role = String(userData.role).toUpperCase() as User['role'];
      }
      setUser(userData);
      setStatus('authenticated');
      return true;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Login failed');
      setUser(null);
      setStatus('unauthenticated');
      return false;
    }
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setError(null);
    setStatus('unauthenticated');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // user.role comes from backend in uppercase enum
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const value = useMemo<AuthContextType>(() => ({
    ready: status !== 'loading',
    status,
    user,
    role: user?.role ?? null,
    login: handleLogin,
    logout: handleLogout,
    isLoading: status === 'loading',
    error,
    hasPermission
  }), [status, user, error]);

  return (
    <AuthContext.Provider value={value}>
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
