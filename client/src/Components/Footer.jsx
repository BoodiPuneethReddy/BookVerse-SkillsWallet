import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="main-footer font-poppins">
      <div className="footer-container">
        <div className="footer-section brand-info">
          <div className="footer-logo">
            <BookOpen className="logo-icon" />
            <span className="logo-text">BookVerse</span>
          </div>
          <p className="footer-desc">
            Discover captivating books, connect with passionate sellers, and fuel your love for reading — only at BookVerse.
          </p>
        </div>

        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/user/login">User Portal</Link></li>
            <li><Link to="/seller/login">Seller Portal</Link></li>
            <li><Link to="/admin/login">Admin Portal</Link></li>
          </ul>
        </div>

        <div className="footer-section footer-links">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/user/login?redirect=books&category=Fiction">Fiction</Link></li>
            <li><Link to="/user/login?redirect=books&category=Science">Science</Link></li>
            <li><Link to="/user/login?redirect=books&category=Biographies">Biographies</Link></li>
            <li><Link to="/user/login?redirect=books&category=Children">Children's Books</Link></li>
            <li><Link to="/user/login?redirect=books&category=Romance">Romance</Link></li>
            <li><Link to="/user/login?redirect=books&category=Horror">Horror</Link></li>
          </ul>
        </div>

        <div className="footer-section contact-info">
          <h4>Contact Us</h4>
          <p className="footer-email-block">
            <Mail className="footer-mail-icon" />
            <a href="mailto:punithreddy084@gmail.com" className="footer-email-link">punithreddy084@gmail.com</a>
          </p>
          <p className="footer-contact-query">For any queries, please contact us via email.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BookVerse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
