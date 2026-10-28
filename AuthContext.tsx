import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { User } from './types.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    password: string,
    confirmPassword: string,
    displayName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
  celebrate: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('granaxp_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  const celebrate = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#38bdf8'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  };

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token inválido ou expirado
        localStorage.removeItem('granaxp_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.warn('Erro ao verificar sessão do usuário:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro ao realizar login.' };
      }

      localStorage.setItem('granaxp_token', data.token);
      setToken(data.token);
      setUser(data.user);
      celebrate();
      return { success: true };
    } catch {
      return { success: false, error: 'Erro de conexão com o servidor.' };
    }
  };

  const register = async (
    username: string,
    password: string,
    confirmPassword: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirmPassword, displayName }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Erro ao criar conta.' };
      }

      localStorage.setItem('granaxp_token', data.token);
      setToken(data.token);
      setUser(data.user);
      celebrate();
      return { success: true };
    } catch {
      return { success: false, error: 'Erro de conexão com o servidor.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Ignora erro no logout
    } finally {
      localStorage.removeItem('granaxp_token');
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const body = await res.json();
        setUser(body.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        localStorage.removeItem('granaxp_token');
        setToken(null);
        setUser(null);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        refreshUser,
        celebrate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
