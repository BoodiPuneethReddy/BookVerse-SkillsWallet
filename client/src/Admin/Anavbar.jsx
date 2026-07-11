import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Store, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const Anavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="role-navbar admin-navbar font-poppins">
      <div className="nav-brand">
        <BookOpen className="brand-logo" />
        <div className="brand-details">
          <span>BookVerse</span>
          <span className="user-role-label admin-role">Admin Control</span>
        </div>
      </div>
      
      <div className="nav-profile-snippet">
        <div className="snippet-avatar bg-red-avatar"><ShieldCheck className="avatar-shield" /></div>
        <div className="snippet-info">
          <h4>Admin Portal</h4>
          <p>Super Administrator</p>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink 
            to="/admin/home" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <LayoutDashboard className="nav-icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <Users className="nav-icon" /> Users
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/sellers" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <Store className="nav-icon" /> Sellers
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/items" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <BookOpen className="nav-icon" /> Books
          </NavLink>
        </li>
        <li className="logout-li">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut className="nav-icon" /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Anavbar;
