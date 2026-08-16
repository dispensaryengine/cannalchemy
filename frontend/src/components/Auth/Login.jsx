
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Login = ({ onSwitchToSignup, onClose }) => {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success } = await login(username, password);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="auth-field">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          placeholder="Enter username"
        />
      </div>
      <div className="auth-field">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Enter password"
        />
      </div>
      {error && <div className="auth-error">{error}</div>}
      <button type="submit" className="auth-submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : '🔑 Log In'}
      </button>
      <p className="auth-switch">
        Don't have an account?{' '}
        <button type="button" className="auth-switch-btn" onClick={onSwitchToSignup}>
          Sign Up
        </button>
      </p>
    </form>
  );
};

export default Login;
