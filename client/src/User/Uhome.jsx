import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Search, 
  Home as HomeIcon,
  Book,
  User,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  Star,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Inbox
} from 'lucide-react';
import API from '../api/axios';
import Footer from '../Components/Footer';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';

const Uhome = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [purchasedBooksCount, setPurchasedBooksCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const booksRes = await API.get('/books');
        if (booksRes.data.success) {
          setBooks(booksRes.data.books || []);
        }

        const profileRes = await API.get('/users/profile');
        if (profileRes.data.success) {
          setWishlistCount(profileRes.data.data.wishlist?.length || 0);
        }

        const ordersRes = await API.get('/orders/mine');
        if (ordersRes.data.success) {
          const ordersList = ordersRes.data.data || [];
          setOrdersCount(ordersList.length);
          setRecentOrders(ordersList.slice(0, 3));
          
          // Sum up quantities of all items across user's orders
          const totalQty = ordersList.reduce((acc, order) => {
            return acc + (order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0);
          }, 0);
          setPurchasedBooksCount(totalQty);
        }

        const cartRes = await API.get('/cart');
        if (cartRes.data.success) {
          const totalCartQty = cartRes.data.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartCount(totalCartQty);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Update search suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = books
        .filter(b => 
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, books]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/books?search=${searchQuery.trim()}`);
    }
  };

  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userName = userData.fullName || 'Reader';
  const userInitial = userName.trim().charAt(0).toUpperCase();

  const bestSellers = books.slice(0, 6);
  const recommendations = books.slice(6, 12);

  return (
    <div className="user-layout font-poppins">
      {/* Top Sticky Navbar */}
      <header className="landing-header">
        <div className="brand" onClick={() => navigate('/user/home')} style={{ cursor: 'pointer' }}>
          <BookOpen className="brand-logo" />
          <span className="brand-name">BookStore</span>
        </div>
        <div className="role-nav">
          <Link to="/user/home" className="active-nav"><HomeIcon className="nav-btn-icon" /> Home</Link>
          <Link to="/user/books"><Book className="nav-btn-icon" /> Books</Link>
          <Link to="/user/orders"><ShoppingBag className="nav-btn-icon" /> My Orders</Link>
          <Link to="/user/cart" style={{ fontWeight: 600 }}>🛒 Cart ({cartCount})</Link>
          <button onClick={handleLogout} className="logout-btn"><LogOut className="nav-btn-icon" /> Logout</button>
        </div>
      </header>

      <main className="user-main-content" style={{ paddingBottom: '80px' }}>
        {/* Welcome Section / Premium Welcome Card */}
        <section className="welcome-card-premium" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: '#fff',
          borderRadius: '24px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px',
          boxShadow: '0 20px 25px -5px rgba(30, 58, 138, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div className="welcome-card-art-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 5 }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles style={{ width: '16px', height: '16px' }} /> Premium Reader Account
            </span>
            <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px', color: '#fff', letterSpacing: '-0.02em' }}>
              Good Day, {userName}!
            </h1>
            <p style={{ color: '#bfdbfe', fontSize: '15px', maxWidth: '520px', marginBottom: '24px', lineHeight: 1.6 }}>
              Your bookstore account is active. Explore our newly arrived titles, track pending shipments, or view customized suggestions.
            </p>
            <div className="welcome-quick-actions" style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/user/books')} style={{ backgroundColor: '#fff', color: '#1e3a8a', padding: '10px 20px', fontSize: '14px' }}>
                Browse Catalog
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/user/orders')} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff', padding: '10px 20px', fontSize: '14px' }}>
                View Orders
              </button>
            </div>
          </div>

          <div className="welcome-avatar-wrapper" style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 800,
            color: '#fff',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {userInitial}
          </div>
        </section>

        {/* Statistics Cards Section */}
        <section className="stats-grid-new" style={{ marginBottom: '40px' }}>
          <div className="metric-card-modern" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div className="card-top-icon bg-blue-soft"><ShoppingBag className="text-blue" /></div>
            <div className="card-body-meta">
              <p>Active Orders</p>
              <h2>{ordersCount}</h2>
            </div>
          </div>

          <div className="metric-card-modern" style={{ borderLeft: '4px solid #ec4899' }}>
            <div className="card-top-icon style-wishlist-icon" style={{ backgroundColor: '#fce7f3', color: '#db2777' }}>
              <Heart style={{ width: '22px', height: '22px' }} />
            </div>
            <div className="card-body-meta">
              <p>My Wishlist</p>
              <h2>{wishlistCount}</h2>
            </div>
          </div>

          <div className="metric-card-modern" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="card-top-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <Book style={{ width: '22px', height: '22px' }} />
            </div>
            <div className="card-body-meta">
              <p>Purchased Books</p>
              <h2>{purchasedBooksCount}</h2>
            </div>
          </div>


        </section>

        {/* Large Styled Search Box with suggestions */}
        <section className="search-banner-improved" style={{ marginBottom: '48px', position: 'relative' }}>
          <form onSubmit={handleSearch} className="search-box-form-large">
            <input
              type="text"
              placeholder="Search library catalog by title, author name, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '8px' }}
            />
            <button type="submit" className="btn btn-primary btn-search-large">
              <Search className="search-icon-btn" /> Search Catalog
            </button>
          </form>

          {/* Autocomplete Suggestions Box */}
          {searchSuggestions.length > 0 && (
            <div className="search-suggestions-dropdown" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: '#fff',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              marginTop: '8px',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              {searchSuggestions.map((s) => (
                <div 
                  key={s._id}
                  onClick={() => navigate(`/user/book/${s._id}`)}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                  className="suggestion-item-hover"
                >
                  <img src={getBookCover(s)} alt={s.title} style={{ width: '30px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{s.title}</h4>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>by {s.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <>
            {/* Shelf 1: Best Sellers Horizontal Carousel */}
            <section className="dashboard-shelves-new" style={{ marginBottom: '56px' }}>
              <div className="shelf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Best Sellers</h2>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Highly recommended reads from this week</p>
                </div>
                <Link to="/user/books" className="shelf-link" style={{ fontSize: '14px', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <ChevronRight style={{ width: '16px', height: '16px' }} />
                </Link>
              </div>

              {bestSellers.length > 0 ? (
                <div className="books-grid-shelf" style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '24px',
                  paddingBottom: '16px',
                  scrollBehavior: 'smooth'
                }}>
                  {bestSellers.map((book) => (
                    <div 
                      key={book._id} 
                      className="book-card-premium"
                      style={{
                        flex: '0 0 260px',
                        width: '260px'
                      }}
                    >
                      <div className="book-card-image-box">
                        <img src={getBookCover(book)} alt={book.title} className="book-card-cover-img" />
                      </div>
                      <div className="book-card-details">
                        <div className="category-badge"><Tag className="pill-icon" /> {book.category}</div>
                        <h3 className="book-title" title={book.title}>{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        
                        <div className="book-footer-info">
                          <span className="book-price">₹{book.price.toFixed(2)}</span>
                          <span className="rating-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>
                            <Star style={{ width: '14px', height: '14px', fill: '#f59e0b' }} /> {book.averageRating?.toFixed(1) || '0.0'}
                          </span>
                        </div>

                        <button
                          className="btn-view-pill btn-block"
                          onClick={() => navigate(`/user/book/${book._id}`)}
                          style={{ marginTop: '8px' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card-new">
                  <Inbox className="empty-state-icon" />
                  <h3>No Books Available</h3>
                  <p>Our library catalog is currently being updated. Please check back later.</p>
                </div>
              )}
            </section>

            {/* Shelf 2: Recommended Books Horizontal Carousel */}
            <section className="dashboard-shelves-new" style={{ marginBottom: '56px' }}>
              <div className="shelf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Recommended for You</h2>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Curated list matched with your catalog reading history</p>
                </div>
                <Link to="/user/books" className="shelf-link" style={{ fontSize: '14px', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Explore Genres <ChevronRight style={{ width: '16px', height: '16px' }} />
                </Link>
              </div>

              {recommendations.length > 0 ? (
                <div className="books-grid-shelf" style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '24px',
                  paddingBottom: '16px',
                  scrollBehavior: 'smooth'
                }}>
                  {recommendations.map((book) => (
                    <div 
                      key={book._id} 
                      className="book-card-premium"
                      style={{
                        flex: '0 0 260px',
                        width: '260px'
                      }}
                    >
                      <div className="book-card-image-box">
                        <img src={getBookCover(book)} alt={book.title} className="book-card-cover-img" />
                      </div>
                      <div className="book-card-details">
                        <div className="category-badge"><Tag className="pill-icon" /> {book.category}</div>
                        <h3 className="book-title" title={book.title}>{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        
                        <div className="book-footer-info">
                          <span className="book-price">₹{book.price.toFixed(2)}</span>
                          <span className="rating-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>
                            <Star style={{ width: '14px', height: '14px', fill: '#f59e0b' }} /> {book.averageRating?.toFixed(1) || '0.0'}
                          </span>
                        </div>

                        <button
                          className="btn-view-pill btn-block"
                          onClick={() => navigate(`/user/book/${book._id}`)}
                          style={{ marginTop: '8px' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                books.slice(0, 3).length > 0 ? (
                  <div className="books-grid-shelf" style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '24px',
                    paddingBottom: '16px',
                    scrollBehavior: 'smooth'
                  }}>
                    {books.slice(0, 3).map((book) => (
                      <div 
                        key={book._id} 
                        className="book-card-premium"
                        style={{
                          flex: '0 0 260px',
                          width: '260px'
                        }}
                      >
                        <div className="book-card-image-box">
                          <img src={getBookCover(book)} alt={book.title} className="book-card-cover-img" />
                        </div>
                        <div className="book-card-details">
                          <div className="category-badge"><Tag className="pill-icon" /> {book.category}</div>
                          <h3 className="book-title" title={book.title}>{book.title}</h3>
                          <p className="book-author">by {book.author}</p>
                          
                          <div className="book-footer-info">
                            <span className="book-price">₹{book.price.toFixed(2)}</span>
                            <span className="rating-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>
                              <Star style={{ width: '14px', height: '14px', fill: '#f59e0b' }} /> {book.averageRating?.toFixed(1) || '0.0'}
                            </span>
                          </div>

                          <button
                            className="btn-view-pill btn-block"
                            onClick={() => navigate(`/user/book/${book._id}`)}
                            style={{ marginTop: '8px' }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-card-new">
                    <Inbox className="empty-state-icon" />
                    <h3>No Recommendations Yet</h3>
                    <p>Start browsing our bookstore catalog and we will suggest custom reads for you.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/user/books')} style={{ marginTop: '12px' }}>
                      Browse Books
                    </button>
                  </div>
                )
              )}
            </section>

            {/* Shelf 3: Recent Orders */}
            <section className="dashboard-shelves-new" style={{ marginBottom: '56px' }}>
              <div className="shelf-header" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Recent Orders</h2>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Track shipment updates for your latest purchases</p>
              </div>

              {recentOrders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentOrders.map((order) => (
                    <div 
                      key={order._id}
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid var(--border-color)',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                          backgroundColor: '#f8fafc',
                          width: '48px',
                          height: '64px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img 
                            src={getBookCover(order.items?.[0]?.book)} 
                            alt="Book cover" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                            {order.items?.[0]?.book?.title || 'Atomic Habits'} 
                            {order.items?.length > 1 && ` (+${order.items.length - 1} more items)`}
                          </h4>
                          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            Ordered on {new Date(order.createdAt).toLocaleDateString()} • Order ID: {order._id}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                          ₹{order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                        </span>
                        <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card-new">
                  <ShoppingBag className="empty-state-icon" />
                  <h3>No Orders Placed Yet</h3>
                  <p>You haven't placed any orders in our store. Find your next book today!</p>
                  <button className="btn btn-primary" onClick={() => navigate('/user/books')} style={{ marginTop: '12px' }}>
                    Browse Books
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Uhome;
