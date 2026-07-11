import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Home as HomeIcon, LogOut, ChevronLeft } from 'lucide-react';
import API from '../api/axios';
import Footer from '../Components/Footer';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQtyChange = async (bookId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      const res = await API.put('/cart/update', { bookId, quantity: newQty });
      if (res.data.success) {
        setCart(res.data.data);
        toast.success('Cart updated');
      }
    } catch (err) {
      console.error('Error updating cart qty:', err);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      const res = await API.delete(`/cart/remove/${bookId}`);
      if (res.data.success) {
        setCart(res.data.data);
        toast.success('Item removed from cart');
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const platformFee = subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shipping + platformFee;

  return (
    <div className="user-layout font-poppins">
      {/* Top Navbar */}
      <header className="landing-header">
        <div className="brand" onClick={() => navigate('/user/home')} style={{ cursor: 'pointer' }}>
          <BookOpen className="brand-logo" />
          <span className="brand-name">BookStore</span>
        </div>
        <div className="role-nav">
          <Link to="/user/home"><HomeIcon className="nav-btn-icon" /> Home</Link>
          <Link to="/user/books"><ShoppingBag className="nav-btn-icon" /> Books</Link>
          <Link to="/user/orders"><ShoppingBag className="nav-btn-icon" /> My Orders</Link>
          <Link to="/user/cart" className="active-nav" style={{ fontWeight: 700 }}>
            🛒 Cart ({totalItems})
          </Link>
          <button onClick={handleLogout} className="logout-btn"><LogOut className="nav-btn-icon" /> Logout</button>
        </div>
      </header>

      <main className="user-main-content" style={{ paddingBottom: '80px' }}>
        <div className="back-nav-box" style={{ marginBottom: '24px' }}>
          <button onClick={() => navigate('/user/books')} className="back-text-btn">
            <ChevronLeft /> Continue Shopping
          </button>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>Shopping Cart</h1>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : cart && cart.items.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="cart-grid-layout-responsive">
            {/* Cart Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.items.map((item) => (
                <div 
                  key={item._id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    gap: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    position: 'relative'
                  }}
                >
                  <div style={{ width: '100px', height: '140px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                    <img 
                      src={getBookCover(item.book)} 
                      alt={item.book?.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{item.book?.title}</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>by {item.book?.author}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', color: '#475569' }}>
                          🏪 {item.book?.seller?.shopName || 'BookVerse Store'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => handleQtyChange(item.book?._id, item.quantity, -1)}
                          style={{ padding: '8px 12px', border: 'none', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Minus style={{ width: '14px', height: '14px' }} />
                        </button>
                        <span style={{ padding: '0 16px', fontSize: '14px', fontWeight: 600 }}>{item.quantity}</span>
                        <button 
                          onClick={() => handleQtyChange(item.book?._id, item.quantity, 1)}
                          style={{ padding: '8px 12px', border: 'none', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Plus style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => handleRemove(item.book?._id)}
                          style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}
                          title="Remove item"
                        >
                          <Trash2 style={{ width: '18px', height: '18px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div>
              <div 
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                  position: 'sticky',
                  top: '24px'
                }}
              >
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Order Summary</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                    <span>Subtotal ({totalItems} items)</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                    <span>Shipping Delivery</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                    <span>Platform Fee</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>₹{platformFee.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#2563eb' }}>₹{grandTotal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={() => navigate('/user/checkout?source=cart')}
                  className="btn btn-primary btn-block"
                  style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Proceed to Buy Cart <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            style={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '60px 40px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '40px auto',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Your Cart is Empty</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>Looks like you haven't added any books to your cart yet. Explore our curated collections to find your next great read.</p>
            <button className="btn btn-primary" onClick={() => navigate('/user/books')} style={{ padding: '12px 32px' }}>
              Explore Books Catalog
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
