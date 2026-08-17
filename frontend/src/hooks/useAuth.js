
import { useContext } from 'react';
import { AuthContext } from '../components/Auth/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
