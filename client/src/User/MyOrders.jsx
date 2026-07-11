import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, ShoppingBag, Home as HomeIcon, ChevronDown, ChevronUp, Check, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Footer from '../Components/Footer';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const fetchOrdersAndCart = async () => {
    try {
      const res = await API.get('/orders/mine');
      if (res.data.success) {
        setOrders(res.data.data);
      }

      const cartRes = await API.get('/cart');
      if (cartRes.data.success) {
        const totalCartQty = cartRes.data.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalCartQty);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndCart();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const timelineSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

  const getStepIndex = (status) => {
    return timelineSteps.indexOf(status);
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
          <Link to="/user/books"><ShoppingBag className="nav-btn-icon" /> Books</Link>
          <Link to="/user/orders" className="active-nav"><ShoppingBag className="nav-btn-icon" /> My Orders</Link>
          <Link to="/user/cart" style={{ fontWeight: 600 }}>🛒 Cart ({cartCount})</Link>
          <button onClick={handleLogout} className="logout-btn"><LogOut className="nav-btn-icon" /> Logout</button>
        </div>
      </header>

      <main className="user-main-content" style={{ paddingBottom: '80px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>Your Orders</h1>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              return (
                <div 
                  key={order._id}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Order Accordion Header */}
                  <div 
                    onClick={() => toggleExpandOrder(order._id)}
                    style={{
                      padding: '24px 32px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', flexGrow: 1 }} className="order-header-responsive-grid">
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Order ID</span>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>#{order._id.substring(order._id.length - 8).toUpperCase()}</h4>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Date Placed</span>
                        <p style={{ fontSize: '14px', color: '#334155', marginTop: '4px', fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Price</span>
                        <p style={{ fontSize: '15px', color: '#2563eb', fontWeight: 800, marginTop: '4px' }}>₹{order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Items Count</span>
                        <p style={{ fontSize: '14px', color: '#334155', marginTop: '4px', fontWeight: 500 }}>{order.items?.length || 0} {order.items?.length === 1 ? 'Book' : 'Books'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '24px' }}>
                      <span 
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: order.orderStatus === 'Delivered' ? '#dcfce7' : '#fee2e2',
                          color: order.orderStatus === 'Delivered' ? '#16a34a' : '#ef4444',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          textTransform: 'uppercase'
                        }}
                      >
                        {order.orderStatus}
                      </span>
                      {isExpanded ? <ChevronUp style={{ color: '#64748b' }} /> : <ChevronDown style={{ color: '#64748b' }} />}
                    </div>
                  </div>

                  {/* Order Accordion Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div style={{ padding: '32px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Delivery Address: <span style={{ fontWeight: 500, color: '#64748b' }}>{order.shippingAddress}</span></h4>

                          {/* List of items with independent tracking */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {order.items?.map((item) => {
                              const activeIndex = getStepIndex(item.status);
                              const isCancelled = item.status === 'Cancelled';
                              
                              return (
                                <div key={item._id} style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
                                  
                                  {/* Item Details */}
                                  <div style={{ display: 'flex', gap: '20px' }}>
                                    <img 
                                      src={getBookCover(item.book)} 
                                      alt={item.book?.title} 
                                      style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                                    />
                                    <div>
                                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{item.book?.title}</h4>
                                      <p style={{ fontSize: '13px', color: '#64748b' }}>by {item.book?.author}</p>
                                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', flexWrap: 'wrap', color: '#475569' }}>
                                        <span>Seller: <strong>{item.seller?.fullName || 'Partner Seller'} ({item.seller?.shopName || 'BookVerse Store'})</strong></span>
                                        {item.seller?.rating !== undefined && (
                                          <span>Rating: <strong style={{ color: '#eab308' }}>★ {Number(item.seller.rating).toFixed(1)}</strong></span>
                                        )}
                                        <span>Qty: <strong>{item.quantity}</strong></span>
                                        <span>Price: <strong>₹{item.price.toFixed(2)}</strong></span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Item Timeline Tracker */}
                                  <div style={{ padding: '12px 24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    
                                    {/* Estimated delivery banner */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
                                      <span style={{ color: '#475569', fontWeight: 500 }}>
                                        🚚 Tracking status: <strong style={{ color: isCancelled ? '#ef4444' : '#2563eb' }}>{item.status}</strong>
                                      </span>
                                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar style={{ width: '14px', height: '14px' }} /> Est. Delivery: <strong>{item.estimatedDelivery ? new Date(item.estimatedDelivery).toLocaleDateString('en-GB') : 'Waiting for Seller Acceptance'}</strong>
                                      </span>
                                    </div>

                                    {!isCancelled ? (
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '10px 0' }} className="timeline-dots-container-responsive">
                                        
                                        {/* Connector Line */}
                                        <div style={{ position: 'absolute', left: '4%', right: '4%', top: '50%', transform: 'translateY(-50%)', height: '4px', backgroundColor: '#e2e8f0', zIndex: 1 }} />
                                        
                                        {/* Active Connector Progress */}
                                        {activeIndex > 0 && (
                                          <div 
                                            style={{ 
                                              position: 'absolute', 
                                              left: '4%', 
                                              width: `${(activeIndex / (timelineSteps.length - 1)) * 92}%`, 
                                              top: '50%', 
                                              transform: 'translateY(-50%)', 
                                              height: '4px', 
                                              backgroundColor: '#16a34a', 
                                              zIndex: 2 
                                            }} 
                                          />
                                        )}

                                        {/* Timeline steps */}
                                        {timelineSteps.map((step, idx) => {
                                          const isCompleted = idx <= activeIndex;
                                          const isActive = idx === activeIndex;

                                          return (
                                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative', width: '60px' }}>
                                              <div 
                                                style={{
                                                  width: '24px',
                                                  height: '24px',
                                                  borderRadius: '50%',
                                                  backgroundColor: isActive ? '#2563eb' : isCompleted ? '#16a34a' : '#fff',
                                                  border: isCompleted ? 'none' : '2px solid #cbd5e1',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  color: '#fff',
                                                  boxShadow: isActive ? '0 0 0 4px rgba(37,99,235,0.2)' : 'none'
                                                }}
                                              >
                                                {isCompleted ? <Check style={{ width: '12px', height: '12px' }} /> : <Clock style={{ width: '12px', height: '12px', color: '#cbd5e1' }} />}
                                              </div>
                                              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, color: isActive ? '#2563eb' : isCompleted ? '#16a34a' : '#64748b', marginTop: '6px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                {step}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        ⚠️ This shipment has been Cancelled.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            style={{
              backgroundColor: '#fff',
              border: '1px dashed #cbd5e1',
              borderRadius: '24px',
              padding: '60px 40px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '40px auto'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>No Orders Found</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>You haven't placed any orders yet. Once you make purchases from the catalog, they will appear here with active tracking timelines.</p>
            <button className="btn btn-primary" onClick={() => navigate('/user/books')} style={{ padding: '10px 24px' }}>
              Shop Now
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
