import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser } from '../types';
import { authApi, clearStoredToken } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (googleCredential: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any legacy localStorage token from before cookie migration
    clearStoredToken();
    // Restore session via httpOnly cookie (sent automatically by browser)
    authApi.getMe()
      .then(u => setUser(u))
      .catch(() => {}) // 401 = not logged in, that's fine
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (googleCredential: string) => {
    const { user: u } = await authApi.googleLogin(googleCredential);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout(); // server blacklists jti + clears cookie
    } catch {}
    setUser(null);
    if (window.google) window.google.accounts.id.disableAutoSelect();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Google Identity Services global type declaration
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            context?: string;
          }) => void;
          prompt: (notification?: (n: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (element: HTMLElement, config: {
            theme?: string;
            size?: string;
            text?: string;
            locale?: string;
            shape?: string;
            width?: number;
          }) => void;
          disableAutoSelect: () => void;
          cancel: () => void;
        };
      };
    };
  }
}
