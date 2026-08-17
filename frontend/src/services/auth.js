
import api from './api';

export const signup = async (username, email, password) => {
  const response = await api.post('/auth/signup', { username, email, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const guestLogin = async () => {
  const response = await api.post('/auth/guest');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async (token) => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user;
  } catch (error) {
    return null;
  }
};
