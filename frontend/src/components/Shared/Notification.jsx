
import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={"notification " + (type || "info")}>
      {message}
      <button className="notification-close" onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default Notification;
