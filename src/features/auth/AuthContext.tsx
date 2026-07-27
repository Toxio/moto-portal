import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@/lib/types';
import { getFromStorage, setToStorage } from '@/lib/utils';
import { mockUser } from '@/mocks/users';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (provider: User['provider']) => void;
  logout: () => void;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_KEY = 'la-moto-user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setUser(getFromStorage<User | null>(AUTH_KEY, null));
  }, []);

  const login = useCallback((provider: User['provider']) => {
    const loggedIn = { ...mockUser, provider };
    setUser(loggedIn);
    setToStorage(AUTH_KEY, loggedIn);
    setShowAuthModal(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        showAuthModal,
        openAuthModal: () => setShowAuthModal(true),
        closeAuthModal: () => setShowAuthModal(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
