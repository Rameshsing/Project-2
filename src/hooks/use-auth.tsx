"use client"
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// This is a mock user. In a real app, this would come from Firebase Auth.
const mockUser = {
  uid: '12345',
  displayName: 'Current User',
  email: 'user@example.com',
};

type User = typeof mockUser | null;

type AuthContextType = {
  user: User;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd have a listener here for Firebase Auth state changes.
    // e.g., onAuthStateChanged(auth, (user) => { ... });
    const timer = setTimeout(() => {
        setUser(mockUser);
        setLoading(false);
    }, 500); // Simulate auth check delay
    
    return () => clearTimeout(timer);
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
