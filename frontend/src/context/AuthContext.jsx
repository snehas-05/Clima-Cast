import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('climacast_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res.data.user);
            setIsAuthenticated(true);
          } else {
            // Token invalid or expired
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to restore session:", error);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const handleLogin = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      localStorage.setItem('climacast_token', res.data.access_token);
      setToken(res.data.access_token);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const handleSignup = async (userData) => {
    const res = await authService.signup(userData);
    if (res.success) {
      localStorage.setItem('climacast_token', res.data.access_token);
      setToken(res.data.access_token);
      setUser(res.data.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (e) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('climacast_token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
