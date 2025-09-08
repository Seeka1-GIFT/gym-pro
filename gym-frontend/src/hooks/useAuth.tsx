import { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'admin' | 'coach' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthCtx = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
  hasPermission: () => false
});

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@gym.com',
    role: 'admin',
    avatar: 'A'
  },
  {
    id: '2',
    name: 'Coach John',
    email: 'coach@gym.com',
    role: 'coach',
    avatar: 'C'
  },
  {
    id: '3',
    name: 'Member Jane',
    email: 'member@gym.com',
    role: 'member',
    avatar: 'M'
  }
];

// Permission mapping
const rolePermissions: Record<UserRole, string[]> = {
  admin: [
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
  coach: [
    'view_dashboard',
    'view_members',
    'manage_attendance',
    'manage_classes',
    'view_reports'
  ],
  member: [
    'view_dashboard',
    'view_own_profile',
    'view_own_attendance',
    'view_own_payments'
  ]
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gym_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('gym_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gym_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && password === 'password');
    
    if (foundUser) {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
