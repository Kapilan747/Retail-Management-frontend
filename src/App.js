import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import './styles/main.css';
import './styles/spinner.css';
import UserLogin from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import Marketplace from './pages/Marketplace';
import AdminPanel from './pages/AdminPanel';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { updateUserActivity } from './services/api';
import Navbar from './components/Navbar';
import { AnimatePresence } from 'framer-motion';

function ProtectedRoute({ children }) {
  if (localStorage.getItem('isAdmin') === 'true') return children;
  return <Navigate to="/admin-login" replace />;
}

function UserProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user && user.role === 'user') return children;
  return <Navigate to="/user-login" replace />;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', color: undefined });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location]);

  const clearUserActivity = async (userId) => {
    try {
      await updateUserActivity(userId, true);
    } catch (err) {
      console.error('Error clearing user activity:', err);
    }
  };

  const handleLogout = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.id) {
      await clearUserActivity(user.id);
    }
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    navigate('/admin-login');
    setToast({ open: true, message: 'Logged out', color: '#1976d2' });
  };

  const showToast = useCallback((message, color) => {
    setToast({ open: true, message, color });
  }, []);

  const hideToast = useCallback(() => setToast(t => ({ ...t, open: false })), []);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isUser = user && user.role === 'user';
  const handleUserLogout = async () => {
    if (user && user.id) {
      await clearUserActivity(user.id);
    }
    localStorage.removeItem('user');
    navigate('/user-login');
    setToast({ open: true, message: 'Logged out', color: '#1976d2' });
  };

  const hideNav = ['/sign-in', '/sign-up'].includes(location.pathname);

  useEffect(() => {
    if (!user) return;
    let lastUpdate = 0;
    let sessionTimer;
    
    const resetSessionTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(async () => {
        try {
          await updateUserActivity(user.id, true);
        } catch (err) {
          console.error('Error clearing activity on session timeout:', err);
        }
        localStorage.removeItem('user');
        navigate('/user-login');
      }, 4 * 60 * 1000);
    };
    
    const updateActivity = () => {
      const now = Date.now();
      if (now - lastUpdate > 30000) {
        updateUserActivity(user.id).catch(() => {
          setToast({ open: true, message: 'Failed to update activity', color: '#d32f2f' });
        });
        lastUpdate = now;
      }
    };
    const updateOnLoad = () => {
      updateUserActivity(user.id).catch(() => {
        setToast({ open: true, message: 'Failed to update activity', color: '#d32f2f' });
      });
    };
    
    window.addEventListener('mousemove', () => {
      updateActivity();
      resetSessionTimer();
    });
    window.addEventListener('keydown', () => {
      updateActivity();
      resetSessionTimer();
    });
    window.addEventListener('focus', updateOnLoad);
    window.addEventListener('beforeunload', updateOnLoad);
    
    updateOnLoad();
    resetSessionTimer();
    
    return () => {
      clearTimeout(sessionTimer);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('focus', updateOnLoad);
      window.removeEventListener('beforeunload', updateOnLoad);
    };
  }, [user]);

  return (
    <>
      <CustomCursor />
      <Toast open={toast.open} message={toast.message} color={toast.color} onClose={hideToast} />
      {!hideNav && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 200 }}>
          <Navbar onLogout={isUser ? handleUserLogout : handleLogout} />
        </div>
      )}
      <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', paddingTop: !hideNav ? 60 : 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: 0 }}>
          <main className="main-content">
            {loading ? <LoadingSpinner /> : (
              <Routes location={location} key={location.pathname}>
                <Route path="/sign-in" element={<SignIn onToast={showToast} />} />
                <Route path="/sign-up" element={<SignUp onToast={showToast} />} />
                <Route path="/user-dashboard" element={<UserProtectedRoute><UserDashboard onToast={showToast} /></UserProtectedRoute>} />
                <Route path="/marketplace" element={<UserProtectedRoute><Marketplace onToast={showToast} /></UserProtectedRoute>} />
                <Route path="/" element={<Home onToast={showToast} />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard onToast={showToast} /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory onToast={showToast} /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><Customers onToast={showToast} /></ProtectedRoute>} />
                <Route path="/sales" element={<ProtectedRoute><Sales onToast={showToast} /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile onToast={showToast} /></ProtectedRoute>} />
                <Route path="/admin-panel" element={<ProtectedRoute><AdminPanel onToast={showToast} /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default App; 