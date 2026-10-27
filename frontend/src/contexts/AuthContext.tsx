import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser } from '../types';
import { authApi, setStoredToken, clearStoredToken, getStoredToken } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (googleCredential: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) { setLoading(false); return; }
    authApi.getMe()
      .then(u => setUser(u))
      .catch(() => clearStoredToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (googleCredential: string) => {
    const { access_token, user: u } = await authApi.googleLogin(googleCredential);
    setStoredToken(access_token);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
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
