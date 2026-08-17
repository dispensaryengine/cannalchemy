
import React from 'react';
import { useAuth } from '../Auth/AuthContext';

const Header = ({ onOpenEncyclopedia, onOpenStrainMap }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">🌿 CHRON<span>ALCHEMY</span></div>
      <div className="header-actions">
        <button className="strainmap-btn" onClick={onOpenStrainMap}>
          Strain Map
        </button>
        <button className="encyclopedia-btn" onClick={onOpenEncyclopedia}>
          Encyclopedia
        </button>
        <div className="stats">
          <div className="stat">
            <div className="stat-val" id="discovered-count">0</div>
            <div className="stat-lbl">Discovered</div>
          </div>
          <div className="stat">
            <div className="stat-val" id="total-count">0</div>
            <div className="stat-lbl">Total</div>
          </div>
          <div className="stat">
            <div className="stat-val" id="combos-count">0</div>
            <div className="stat-lbl">Combos</div>
          </div>
        </div>
        <div className="auth-bar">
          {user && (
            <>
              <div className="user-badge">
                <span className="avatar">{user.username.charAt(0).toUpperCase()}</span>
                <span>{user.username}</span>
              </div>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
