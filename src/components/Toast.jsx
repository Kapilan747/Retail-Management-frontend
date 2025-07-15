import React, { useEffect } from 'react';

function Toast({ open, message, color = '#1976d2', onClose }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: 40,
      transform: 'translateX(-50%)',
      background: color,
      color: '#fff',
      padding: '14px 32px',
      borderRadius: 12,
      fontWeight: 600,
      fontSize: 17,
      boxShadow: '0 4px 24px rgba(25,118,210,0.10)',
      zIndex: 9999,
      transition: 'opacity 0.2s',
      opacity: open ? 1 : 0
    }}>
      {message}
    </div>
  );
}

export default Toast; 