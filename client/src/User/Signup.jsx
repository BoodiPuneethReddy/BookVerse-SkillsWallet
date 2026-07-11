import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, BookOpen, ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
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
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      toast.error(emailError);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/users/signup', formData);
      if (res.data.success) {
        toast.success(res.data.message || 'Account created successfully!');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', 'user');
        localStorage.setItem('user', JSON.stringify(res.data.data));
        navigate('/user/home');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-full-screen font-poppins">
      <Link to="/" className="back-to-home-btn">
        <ArrowLeft className="arrow-back-icon" /> Back to Home
      </Link>
      
      <div className="auth-split-wrapper">
        {/* Left Visual Illustration Block */}
        <div className="auth-art-column user-art-bg">
          <div className="art-overlay-grid"></div>
          <div className="art-text-block">
            <BookOpen className="art-brand-logo" />
            <h2>Start Your Journey</h2>
            <p>Join our reading community. Discover thousands of volumes, save your favorite titles to your wishlist, and buy directly from independent bookstore owners.</p>
          </div>
        </div>

        {/* Right Form Card Block */}
        <div className="auth-form-column">
          <motion.div 
            className="auth-form-card-glass signup-card-padding"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="form-card-header">
              <h2>User Signup</h2>
              <p>Create your personal account to start exploring.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group-icon-input">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-icon-group-wrapper">
                  <User className="input-field-icon" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="form-group-icon-input">
                <label htmlFor="email">Email Address</label>
                <div className="input-icon-group-wrapper">
                  <Mail className="input-field-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-nested-two">
                <div className="form-group-icon-input">
                  <label htmlFor="phone">Phone (Optional)</label>
                  <div className="input-icon-group-wrapper">
                    <Phone className="input-field-icon" />
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="form-group-icon-input">
                  <label htmlFor="address">Address (Optional)</label>
                  <div className="input-icon-group-wrapper">
                    <MapPin className="input-field-icon" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="City, State"
                    />
                  </div>
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
                    placeholder="Min 6 characters"
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

              <motion.button 
                type="submit" 
                className="btn btn-primary btn-block btn-auth-submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? <div className="btn-spinner"></div> : 'Sign Up'}
              </motion.button>
            </form>

            <p className="auth-card-footer-text">
              Already have an account? <Link to="/user/login">Log in instead</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
