import { api } from '../../lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'TRAINER' | 'RECEPTION' | 'MEMBER';
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TRAINER' | 'RECEPTION' | 'MEMBER';
  avatar?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const { data } = await api.post('/api/auth/login', { email, password });
    const { accessToken, refreshToken, user } = data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return user;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || 'Login failed',
      status: error.response?.status || 500,
    } as ApiError;
  }
}

export async function me(): Promise<User> {
  try {
    const { data } = await api.get('/api/auth/me');
    return data;
  } catch (error: any) {
    throw {
      message: error.response?.data?.message || 'Failed to get user info',
      status: error.response?.status || 500,
    } as ApiError;
  }
}

export function logout(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

// Legacy class for backward compatibility
class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await login(email, password);
    return {
      accessToken: getAccessToken()!,
      refreshToken: getRefreshToken()!,
      user
    };
  }

  async me(): Promise<User> {
    return me();
  }

  async logout(): Promise<void> {
    logout();
  }

  isAuthenticated(): boolean {
    return isAuthenticated();
  }

  getAccessToken(): string | null {
    return getAccessToken();
  }

  getRefreshToken(): string | null {
    return getRefreshToken();
  }
}

export const authService = new AuthService();
export default authService;
