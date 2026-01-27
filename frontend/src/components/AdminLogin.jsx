import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = ({ onLogin, onClose }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication - in production, this should be done via backend API
    // For now, using environment variable or hardcoded credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'allure2025'; // You can change this

    if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
      // Store login status in localStorage
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_login_time', new Date().getTime());
      toast.success('Login successful!');
      onLogin();
    } else {
      toast.error('Invalid username or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-panel-overlay">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock size={24} />
            <h2 className="hero-medium">Admin Login</h2>
          </div>
          <button onClick={onClose} className="admin-close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="body-small">
            Login to access product management, categories, and contact inquiries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
