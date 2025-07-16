import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import './styles/main.css';
import './styles/spinner.css';
import UserDashboard from './pages/UserDashboard';
import Marketplace from './pages/Marketplace';
import AdminPanel from './pages/AdminPanel';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { updateUserActivity } from './services/api';
import Navbar from './components/Navbar';

function ProtectedRoute({ children, user }) {
  if (user && user.role === 'admin') return children;
  return <Navigate to="/sign-in" replace />;
}

function UserProtectedRoute({ children, user }) {
  if (user && user.role === 'user') return children;
  return <Navigate to="/sign-in" replace />;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', color: undefined });
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [location]);

  // Session Timeout and Activity Tracking
  useEffect(() => {
    if (!user) return;

    let activityTimer;

    const resetTimer = () => {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        handleLogout();
        // The original code had onToast here, but onToast is not defined in the provided context.
        // Assuming it should be passed as a prop or handled differently if needed.
        // For now, commenting out to avoid errors.
        // onToast && onToast('You have been logged out due to inactivity.', '#f44336');
      }, 15 * 60 * 1000); // 15 minutes
    };

    const handleActivity = () => {
      resetTimer();
      updateUserActivity(user.id).catch(err => console.error("Failed to update user activity", err));
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    
    resetTimer(); // Initial call

    return () => {
      clearTimeout(activityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [user]);

  const clearUserActivity = async (userId) => {
    try {
      await updateUserActivity(userId, true);
    } catch (err) {
      console.error('Error clearing user activity:', err);
    }
  };

  const handleLogout = async () => {
    if (user && user.id) {
      await clearUserActivity(user.id);
    }
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setToast({ open: true, message: 'Logged out', color: '#1976d2' });
  };

  const showToast = useCallback((message, color) => {
    setToast({ open: true, message, color });
  }, []);

  const hideToast = useCallback(() => setToast(t => ({ ...t, open: false })), []);

  const hideNav = ['/sign-in', '/sign-up'].includes(location.pathname);

  return (
    <>
      <CustomCursor />
      <Toast open={toast.open} message={toast.message} color={toast.color} onClose={hideToast} />
      {!hideNav && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 200 }}>
          <Navbar user={user} onLogout={handleLogout} />
        </div>
      )}
      <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', paddingTop: !hideNav ? 60 : 0 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: 0 }}>
          <main className="main-content">
            {loading ? <LoadingSpinner /> : (
              <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<Home onToast={showToast} />} />
                <Route path="/sign-in" element={<SignIn onToast={showToast} onLoginSuccess={() => setUser(JSON.parse(localStorage.getItem('user')))} />} />
                <Route path="/sign-up" element={<SignUp onToast={showToast} />} />

                {/* Admin Routes */}
                <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard onToast={showToast} /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute user={user}><Inventory onToast={showToast} /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute user={user}><Customers onToast={showToast} /></ProtectedRoute>} />
                <Route path="/sales" element={<ProtectedRoute user={user}><Sales onToast={showToast} /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute user={user}><Profile onToast={showToast} /></ProtectedRoute>} />
                <Route path="/admin-panel" element={<ProtectedRoute user={user}><AdminPanel onToast={showToast} /></ProtectedRoute>} />

                {/* User Routes */}
                <Route path="/user-dashboard" element={<UserProtectedRoute user={user}><UserDashboard onToast={showToast} /></UserProtectedRoute>} />
                <Route path="/marketplace" element={<UserProtectedRoute user={user}><Marketplace onToast={showToast} /></UserProtectedRoute>} />

                {/* Fallback Route */}
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