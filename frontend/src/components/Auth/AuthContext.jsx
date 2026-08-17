
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, signup as apiSignup, guestLogin as apiGuestLogin, logout as apiLogout, getMe as apiGetMe } from '../../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const userData = await apiGetMe(storedToken);
          if (userData) {
            setUser(userData);
            setToken(storedToken);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token: newToken } = await apiLogin(username, password);
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token: newToken } = await apiSignup(username, email, password);
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token: newToken } = await apiGuestLogin();
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    guestLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
