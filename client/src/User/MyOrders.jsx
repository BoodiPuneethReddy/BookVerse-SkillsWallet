import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, ShoppingBag, Home as HomeIcon, Mail, X, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import OrderItem from './OrderItem';
import Footer from '../Components/Footer';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Order Tracking Modal State
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/mine');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getTimelineStages = (status) => {
    const stages = [
      { label: 'Order Placed', completed: true, active: false },
      { label: 'Awaiting Seller Confirmation', completed: false, active: false },
      { label: 'Packed', completed: false, active: false },
      { label: 'Shipped', completed: false, active: false },
      { label: 'Delivered', completed: false, active: false }
    ];

    const statusLower = status.toLowerCase();

    if (statusLower === 'pending') {
      stages[1].active = true;
    } else if (statusLower === 'confirmed') {
      stages[1].completed = true;
      stages[2].active = true;
    } else if (statusLower === 'packed') {
      stages[1].completed = true;
      stages[2].completed = true;
      stages[3].active = true;
    } else if (statusLower === 'shipped') {
      stages[1].completed = true;
      stages[2].completed = true;
      stages[3].completed = true;
      stages[4].active = true;
    } else if (statusLower === 'delivered') {
      stages[1].completed = true;
      stages[2].completed = true;
      stages[3].completed = true;
      stages[4].completed = true;
    } else if (statusLower === 'cancelled') {
      return [
        { label: 'Order Placed', completed: true, active: false },
        { label: 'Order Cancelled', completed: true, active: false, isCancelled: true }
      ];
    }

    return stages;
  };

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
          <Link to="/user/books"><BookOpen className="nav-btn-icon" /> Books</Link>
          <Link to="/user/orders" className="active-nav"><ShoppingBag className="nav-btn-icon" /> My Orders</Link>
          <button onClick={handleLogout} className="logout-btn"><LogOut className="nav-btn-icon" /> Logout</button>
        </div>
      </header>

      <main className="user-main-content">
        <div className="orders-page-card">
          <h2>My Orders</h2>

          {loading ? (
            <div className="spinner-container"><div className="spinner"></div></div>
          ) : orders.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table orders-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Order ID</th>
                    <th>Address</th>
                    <th>Seller</th>
                    <th>Booking Date</th>
                    <th>Delivery By</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <OrderItem 
                      key={order._id} 
                      order={order} 
                      onTrackClick={setSelectedTrackingOrder}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-card-new">
              <ShoppingBag className="empty-state-icon" />
              <h3>No Orders Placed Yet</h3>
              <p>You haven't placed any orders in our bookstore. Browse our catalog and find your next read!</p>
              <Link to="/user/books" className="btn btn-primary">Browse Books</Link>
            </div>
          )}
        </div>

        {/* Contact Banner matching email-only guidelines */}
        <section className="contact-banner user-contact-banner">
          <h3>Contact Us</h3>
          <div className="contact-email-box-centered">
            <Mail className="contact-mail-icon-banner" />
            <p className="contact-email-para">
              Email Us: <a href="mailto:punithreddy084@gmail.com" className="contact-email-link">punithreddy084@gmail.com</a>
            </p>
          </div>
          <p className="contact-subtext">We currently provide support through email only.</p>
        </section>
      </main>

      {/* Order Tracking Timeline Modal Overlay */}
      <AnimatePresence>
        {selectedTrackingOrder && (
          <div 
            className="modal-overlay" 
            onClick={() => setSelectedTrackingOrder(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999
            }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                padding: '32px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setSelectedTrackingOrder(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>

              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px', color: '#0f172a' }}>
                Order Tracker
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>
                Order ID: <span className="code-font" style={{ fontWeight: 600 }}>{selectedTrackingOrder._id}</span>
              </p>

              {/* Status Tracker List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                {/* Connecting Line */}
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  backgroundColor: '#e2e8f0',
                  zIndex: 1
                }}></div>

                {getTimelineStages(selectedTrackingOrder.orderStatus).map((stage, idx) => {
                  let bubbleBg = '#f1f5f9';
                  let bubbleBorder = '#cbd5e1';
                  let iconColor = '#94a3b8';
                  let textColor = '#64748b';
                  let fontWeight = '500';

                  if (stage.completed) {
                    bubbleBg = stage.isCancelled ? '#fee2e2' : '#dcfce7';
                    bubbleBorder = stage.isCancelled ? '#fca5a5' : '#86efac';
                    iconColor = stage.isCancelled ? '#dc2626' : '#16a34a';
                    textColor = '#0f172a';
                    fontWeight = '600';
                  } else if (stage.active) {
                    bubbleBg = '#dbeafe';
                    bubbleBorder = '#93c5fd';
                    iconColor = '#2563eb';
                    textColor = '#2563eb';
                    fontWeight = '700';
                  }

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 5 }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: bubbleBg,
                        border: `2px solid ${bubbleBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {stage.completed ? (
                          <Check style={{ width: '12px', height: '12px', color: iconColor }} />
                        ) : (
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: iconColor }} />
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: textColor, fontWeight }}>
                        {stage.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Info */}
              {selectedTrackingOrder.orderStatus.toLowerCase() !== 'cancelled' && selectedTrackingOrder.orderStatus.toLowerCase() !== 'delivered' && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  <Clock style={{ width: '18px', height: '18px', color: '#2563eb' }} />
                  <div style={{ fontSize: '13px', color: '#334155' }}>
                    <strong>Expected Delivery:</strong> {(() => {
                      const d = new Date(selectedTrackingOrder.createdAt);
                      d.setDate(d.getDate() + 5);
                      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    })()}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MyOrders;
