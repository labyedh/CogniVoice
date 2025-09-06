// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData, LoginData } from '../types/auth';
import { login as apiLogin, register as apiRegister } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuthData = localStorage.getItem('authData');
      if (storedAuthData) {
        const { user: storedUser } = JSON.parse(storedAuthData);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user: userData, token } = await apiLogin({ email, password });
    setUser(userData);
    localStorage.setItem('authData', JSON.stringify({ user: userData, token }));
    return userData; 
  };

  const register = async (userData: RegisterData) => {
    const { user: loggedInUser, token } = await apiRegister(userData);
    setUser(loggedInUser);
    localStorage.setItem('authData', JSON.stringify({ user: loggedInUser, token }));
    return loggedInUser;

  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authData');
  };

  const updateUserContext = (updatedUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedUserData };
      
      try {
        const authData = JSON.parse(localStorage.getItem('authData') || '{}');
        localStorage.setItem('authData', JSON.stringify({ ...authData, user: newUser }));
      } catch (e) { console.error("Failed to update user in localStorage", e); }

      return newUser;
    });
  };

  const value: AuthContextType = { user, login, register, logout, isLoading, updateUserContext };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};