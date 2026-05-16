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
          const response = await authService.getProfile();
          const payload = response.data;
          if (payload.success) {
            setUser(payload.data.user);
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
    const response = await authService.login(credentials);
    const payload = response.data;
    if (payload.success) {
      const { access_token, user } = payload.data;
      localStorage.setItem('climacast_token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
    }
    return payload;
  };

  const handleSignup = async (userData) => {
    const response = await authService.signup(userData);
    const payload = response.data;
    if (payload.success) {
      const { access_token, user } = payload.data;
      localStorage.setItem('climacast_token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
    }
    return payload;
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
        forgotPassword: authService.forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
