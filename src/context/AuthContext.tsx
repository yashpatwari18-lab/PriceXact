import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storage } from '../services/storageService';
import { Language, translations, Translations } from '../services/i18n';

interface AuthContextType {
  currentUser: User;
  users: User[];
  currentRole: UserRole;
  language: Language;
  t: Translations;
  isDarkMode: boolean;
  unreadNotificationsCount: number;
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  switchRole: (role: UserRole) => void;
  login: (emailOrMobile: string) => boolean;
  register: (userData: any) => User;
  logout: () => void;
  refreshUserState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(storage.getCurrentUser());
  const [users, setUsers] = useState<User[]>(storage.getState().users);
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('pricexact_lang') as Language) || 'en';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('pricexact_theme') === 'dark';
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pricexact_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pricexact_theme', 'light');
    }
  }, [isDarkMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pricexact_lang', lang);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const refreshUserState = () => {
    const updated = storage.getCurrentUser();
    setCurrentUser({ ...updated });
    setUsers([...storage.getState().users]);
    setTick((t) => t + 1);
  };

  const switchRole = (role: UserRole) => {
    // Find a preset user for this role or create if not present
    const stateUsers = storage.getState().users;
    const targetUser = stateUsers.find((u) => u.role === role);
    if (targetUser) {
      storage.setCurrentUser(targetUser.id);
      setCurrentUser(targetUser);
    } else {
      // Fallback
      const fallback = stateUsers[0];
      storage.setCurrentUser(fallback.id);
      setCurrentUser(fallback);
    }
    refreshUserState();
  };

  const login = (emailOrMobile: string): boolean => {
    const clean = emailOrMobile.trim().toLowerCase();
    const found = storage
      .getState()
      .users.find(
        (u) =>
          u.email.toLowerCase() === clean ||
          u.mobile.replace(/\s+/g, '').includes(clean.replace(/\s+/g, ''))
      );

    if (found) {
      storage.setCurrentUser(found.id);
      setCurrentUser(found);
      refreshUserState();
      return true;
    }
    return false;
  };

  const register = (userData: any): User => {
    const created = storage.registerUser(userData);
    setCurrentUser(created);
    refreshUserState();
    return created;
  };

  const logout = () => {
    // For demo continuity, fallback to the consumer or farmer
    const defaultUser = storage.getState().users[0];
    storage.setCurrentUser(defaultUser.id);
    setCurrentUser(defaultUser);
    refreshUserState();
  };

  const unreadNotifications = storage
    .getState()
    .notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length;

  const t = translations[language] || translations.en;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        currentRole: currentUser.role,
        language,
        t,
        isDarkMode,
        unreadNotificationsCount: unreadNotifications,
        setLanguage,
        toggleDarkMode,
        switchRole,
        login,
        register,
        logout,
        refreshUserState,
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
