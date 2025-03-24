import React, { createContext, useState, useEffect } from 'react';
import { Account } from '../types';

interface AuthContextType {
  user: Account | null;
  setUser: (user: Account | null) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Account | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgilerini al
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSetUser = (newUser: Account | null) => {
    console.log('Setting user in AuthContext:', newUser);
    setUser(newUser);
    setIsAuthenticated(!!newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        setUser: handleSetUser,
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 