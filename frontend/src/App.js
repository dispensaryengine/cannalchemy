
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './components/Auth/AuthContext';
import Header from './components/Shared/Header';
import CollectionPanel from './components/Collection/CollectionPanel';
import CraftArea from './components/CraftArea/CraftArea';
import Encyclopedia from './components/Encyclopedia/Encyclopedia';
import StrainMap from './components/StrainMap/StrainMap';
import Notification from './components/Shared/Notification';
import LoadingSpinner from './components/Shared/LoadingSpinner';
import './App.css';

function App() {
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isStrainMapOpen, setIsStrainMapOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading (replace with actual data fetching)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openEncyclopedia = () => setIsEncyclopediaOpen(true);
  const closeEncyclopedia = () => setIsEncyclopediaOpen(false);

  const openStrainMap = () => setIsStrainMapOpen(true);
  const closeStrainMap = () => setIsStrainMapOpen(false);

  return (
    <AuthProvider>
      <div className="app">
        {isLoading ? (
          <LoadingSpinner isLoading={isLoading} />
        ) : (
          <>
            <Header
              onOpenEncyclopedia={openEncyclopedia}
              onOpenStrainMap={openStrainMap}
            />
            <div className="main">
              <CollectionPanel />
              <CraftArea
                onNotify={showNotification}
              />
              {isEncyclopediaOpen && (
                <Encyclopedia
                  isOpen={isEncyclopediaOpen}
                  onClose={closeEncyclopedia}
                />
              )}
              {isStrainMapOpen && (
                <StrainMap
                  isOpen={isStrainMapOpen}
                  onClose={closeStrainMap}
                />
              )}
            </div>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            )}
          </>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
