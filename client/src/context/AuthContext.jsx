import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('borrowbuddy_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('borrowbuddy_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('borrowbuddy_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('borrowbuddy_token', token);
        localStorage.setItem('borrowbuddy_user', JSON.stringify(user));
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
        return { success: true, user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('borrowbuddy_token', token);
        localStorage.setItem('borrowbuddy_user', JSON.stringify(user));
        toast.success(`Welcome to BorrowBuddy, ${user.name.split(' ')[0]}!`);
        return { success: true, user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('borrowbuddy_token');
    localStorage.removeItem('borrowbuddy_user');
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('borrowbuddy_user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('borrowbuddy_user', JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
