
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Signup = ({ onSwitchToLogin, onClose }) => {
  const { signup, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success } = await signup(username, email, password);
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
        <label>Email (optional)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="your@email.com"
        />
      </div>
      <div className="auth-field">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Enter password"
        />
      </div>
      {error && <div className="auth-error">{error}</div>}
      <button type="submit" className="auth-submit" disabled={isLoading}>
        {isLoading ? 'Signing up...' : '🔑 Sign Up'}
      </button>
      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="auth-switch-btn" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </form>
  );
};

export default Signup;
