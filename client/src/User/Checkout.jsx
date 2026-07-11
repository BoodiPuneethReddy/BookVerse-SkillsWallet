import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, MapPin, CreditCard, ChevronLeft } from 'lucide-react';
import API from '../api/axios';
import Footer from '../Components/Footer';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [subtotal, setSubtotal] = useState(0);

  const source = searchParams.get('source');
  const bookId = searchParams.get('bookId');
  const qty = Number(searchParams.get('qty')) || 1;

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        // Load User saved address
        const profileRes = await API.get('/users/profile');
        if (profileRes.data.success) {
          setShippingAddress(profileRes.data.data.address || '');
        }

        if (source === 'cart') {
          // Fetch from cart endpoint
          const cartRes = await API.get('/cart');
          if (cartRes.data.success) {
            const cartItems = cartRes.data.data.items || [];
            setItems(cartItems);
            setSubtotal(cartRes.data.data.subtotal || 0);
          }
        } else if (source === 'buyNow' && bookId) {
          // Fetch book details
          const bookRes = await API.get(`/books/${bookId}`);
          if (bookRes.data.success) {
            const book = bookRes.data.data;
            setItems([{
              book: book,
              quantity: qty,
              price: book.price,
              seller: book.seller
            }]);
            setSubtotal(book.price * qty);
          }
        } else {
          toast.error('Invalid checkout request');
          navigate('/user/books');
        }
      } catch (err) {
        console.error('Error loading checkout page:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [source, bookId, qty, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      toast.error('Please enter a valid shipping address');
      return;
    }

    try {
      const orderItems = items.map(item => ({
        book: item.book._id || item.book,
        quantity: item.quantity,
        price: item.price,
        seller: item.seller?._id || item.seller
      }));

      const res = await API.post('/orders', {
        items: orderItems,
        shippingAddress,
        paymentMethod
      });

      if (res.data.success) {
        toast.success('Order placed successfully!');
        navigate('/user/orders');
      }
    } catch (err) {
      console.error('Order placement failed:', err);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const platformFee = subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shipping + platformFee;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="user-layout font-poppins">
      {/* Navbar */}
      <header className="landing-header">
        <div className="brand" onClick={() => navigate('/user/home')} style={{ cursor: 'pointer' }}>
          <BookOpen className="brand-logo" />
          <span className="brand-name">BookStore</span>
        </div>
        <div className="role-nav">
          <Link to="/user/home"><BookOpen className="nav-btn-icon" /> Home</Link>
          <Link to="/user/books"><ShoppingBag className="nav-btn-icon" /> Books</Link>
          <Link to="/user/orders"><ShoppingBag className="nav-btn-icon" /> My Orders</Link>
          <Link to="/user/cart">🛒 Cart</Link>
          <button onClick={handleLogout} className="logout-btn"><BookOpen className="nav-btn-icon" /> Logout</button>
        </div>
      </header>

      <main className="user-main-content" style={{ paddingBottom: '80px' }}>
        <div className="back-nav-box" style={{ marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} className="back-text-btn">
            <ChevronLeft /> Back
          </button>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>Checkout</h1>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : items.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="checkout-grid-layout-responsive">
            {/* Left: Addresses & Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Address section */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ color: '#2563eb' }} /> Delivery Address
                </h3>
                <textarea 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter full shipping address with pincode..."
                  rows="3"
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>

              {/* Payment selector */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard style={{ color: '#2563eb' }} /> Payment Option
                </h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['COD', 'UPI', 'Card'].map(method => (
                    <label 
                      key={method}
                      style={{
                        flex: 1,
                        padding: '16px',
                        border: paymentMethod === method ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        backgroundColor: paymentMethod === method ? '#f0f7ff' : '#fff',
                        fontWeight: 600
                      }}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method} 
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      {method === 'COD' ? '💵 Cash on Delivery (COD)' : method === 'UPI' ? '📱 UPI Payment' : '💳 Credit/Debit Card'}
                    </label>
                  ))}
                </div>
              </div>

              {/* Items List card */}
              <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Review Book Items</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', borderBottom: idx < items.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: idx < items.length - 1 ? '20px' : '0' }}>
                      <img 
                        src={getBookCover(item.book)} 
                        alt={item.book.title} 
                        style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{item.book.title}</h4>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>by {item.book.author}</p>
                        <p style={{ fontSize: '13px', color: '#334155', marginTop: '6px' }}>
                          Price: <strong>₹{item.price.toFixed(2)}</strong> | Qty: <strong>{item.quantity}</strong>
                        </p>
                        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          Seller: <strong>{item.book.seller?.shopName || 'BookVerse Store'}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Checkout summary */}
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
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Order Total Summary</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                    <span>Items Subtotal ({totalItems})</span>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
                  <span>Grand Total</span>
                  <span style={{ color: '#2563eb' }}>₹{grandTotal.toFixed(2)}</span>
                </div>

                <div 
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '32px',
                    fontSize: '13px',
                    color: '#475569',
                    lineHeight: 1.5
                  }}
                >
                  🚚 <strong>Estimated Delivery:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>Waiting for Seller Confirmation</span>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Fulfillment schedules will be updated once each seller confirms stock.</p>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  className="btn btn-primary btn-block btn-place-order-large"
                  style={{ padding: '14px 28px', fontSize: '16px', fontWeight: 700 }}
                >
                  Place Your Order
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
