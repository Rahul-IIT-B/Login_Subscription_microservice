// frontend\src\context\AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, signup as apiSignup } from '@/services/api';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('token');
      
      if (token) {
        try {
          const response = await axios.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
          Cookies.set('token', token, { expires: 0.2 });
        } catch (err) {
          console.error('Token verification failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password });
      Cookies.set('token', response.data.token, { expires: 0.2 });
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors && error.response.data.errors.join(', ')) ||
        'Login failed. Please try again.';
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await apiSignup({ email, password });
      Cookies.set('token', response.data.token, { expires: 0.2 });
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.response?.data?.errors && error.response.data.errors.join(', ')) ||
        'Signup failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
export type { AuthContextType };