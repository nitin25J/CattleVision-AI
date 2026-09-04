import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pashu_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_demo_1',
      name: 'Dr. Ankit Patel',
      role: 'Veterinary Officer / Dairy Specialist',
      email: 'ankit.patel@pashuai.org',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  });

  const login = async (email, password) => {
    // Simulated authentication
    const demoUser = {
      id: 'usr_demo_1',
      name: email.split('@')[0] || 'Veterinary Officer',
      role: 'Veterinary Officer',
      email: email,
    };
    setUser(demoUser);
    localStorage.setItem('pashu_user', JSON.stringify(demoUser));
    localStorage.setItem('pashu_auth_token', 'demo_token_' + Date.now());
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pashu_user');
    localStorage.removeItem('pashu_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
