import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Alogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return 'Please enter a valid email address (e.g. name@example.com)';
    }
    const parts = email.split('@');
    if (parts.length === 2) {
      const domain = parts[1];
      if (!domain.includes('.')) {
        return 'Email domain must have a valid suffix (e.g. yahoo.com)';
      }
      const domainParts = domain.split('.');
      const suffix = domainParts[domainParts.length - 1];
      if (suffix.length < 2) {
        return 'Email suffix is too short (must be at least 2 characters)';
      }
      if (domain === 'gmil.com') {
        return 'Did you mean gmail.com instead of gmil.com?';
      }
      if (domain === 'yahoo' || domain === 'gmail') {
        return 'Email domain is incomplete (e.g. gmail.com)';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/admin/login', formData);
      if (res.data.success) {
        toast.success(res.data.message || 'Logged in successfully as Admin');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'admin');
        localStorage.setItem('user', JSON.stringify(res.data.data));
        navigate('/admin/home');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.error('Password reset is not configured on the backend yet.');
  };

  return (
    <div className="auth-full-screen font-poppins">
      <Link to="/" className="back-to-home-btn">
        <ArrowLeft className="arrow-back-icon" /> Back to Home
      </Link>
      
      <div className="auth-split-wrapper">
        {/* Left Visual Illustration Block */}
        <div className="auth-art-column admin-art-bg">
          <div className="art-overlay-grid"></div>
          <div className="art-text-block">
            <ShieldAlert className="art-brand-logo" />
            <h2>Administrator Portal</h2>
            <p>Control center for catalog moderation, vendor registration audits, user permission management, and platform analytics.</p>
          </div>
        </div>

        {/* Right Form Card Block */}
        <div className="auth-form-column">
          <motion.div 
            className="auth-form-card-glass"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="form-card-header">
              <h2>Admin Login</h2>
              <p>Security clearance required. Enter admin credentials to log in.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group-icon-input">
                <label htmlFor="email">Admin Email Address</label>
                <div className="input-icon-group-wrapper">
                  <Mail className="input-field-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group-icon-input">
                <label htmlFor="password">Password</label>
                <div className="input-icon-group-wrapper">
                  <Lock className="input-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="auth-options-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '13px', color: '#475569' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  Remember me
                </label>
              </div>

              <motion.button 
                type="submit" 
                className="btn btn-primary btn-block btn-auth-submit btn-admin-theme"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <div className="btn-spinner"></div> : 'Log In to Console'}
              </motion.button>
            </form>

            <p className="auth-card-footer-text">
              Authorized personnel only. Need registration? <Link to="/admin/signup">Request admin access</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Alogin;
