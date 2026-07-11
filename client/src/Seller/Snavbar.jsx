import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, PlusCircle, Package, ShoppingBag, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Snavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const sellerName = JSON.parse(localStorage.getItem('user'))?.fullName || 'Seller';

  return (
    <nav className="role-navbar seller-navbar font-poppins">
      <div className="nav-brand">
        <BookOpen className="brand-logo" />
        <div className="brand-details">
          <span>BookVerse</span>
          <span className="user-role-label">Seller Portal</span>
        </div>
      </div>
      
      <div className="nav-profile-snippet">
        <div className="snippet-avatar">{sellerName[0].toUpperCase()}</div>
        <div className="snippet-info">
          <h4>{sellerName}</h4>
          <p>Partner Shop</p>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink 
            to="/seller/home" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <LayoutDashboard className="nav-icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/seller/add-book" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <PlusCircle className="nav-icon" /> Add Book
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/seller/products" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <Package className="nav-icon" /> My Products
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/seller/orders" 
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            <ShoppingBag className="nav-icon" /> Orders
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

export default Snavbar;
