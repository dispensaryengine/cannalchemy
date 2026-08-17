
import React from 'react';
import { useAuth } from './AuthContext';

const GuestLogin = ({ onClose }) => {
  const { guestLogin, isLoading } = useAuth();

  const handleClick = async () => {
    const { success } = await guestLogin();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="auth-guest">
      <p>or</p>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : '🌱 Play as Guest'}
      </button>
    </div>
  );
};

export default GuestLogin;
