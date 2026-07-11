import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowRight, 
  User, 
  Store, 
  Shield, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Mail,
  Sparkles,
  ChevronRight,
  BookMarked,
  Heart,
  Star,
  CheckCircle,
  MapPin,
  Lock,
  ShoppingBag
} from 'lucide-react';
import API from '../api/axios';
import { getBookCover } from '../api/bookCovers';
import QuickView from './QuickView';
import Footer from './Footer';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dynamic stats fetched from DB api
  const [stats, setStats] = useState({
    booksCount: 0,
    sellersCount: 0,
    usersCount: 0
  });

  // Newsletter state
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Quick View state
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const response = await API.get('/books');
        if (response.data && response.data.books) {
          setBooks(response.data.books || []);
        }

        // Fetch real-time platform statistics from MongoDB Atlas
        const statsResponse = await API.get('/stats');
        if (statsResponse.data && statsResponse.data.success) {
          setStats({
            booksCount: statsResponse.data.books || 0,
            sellersCount: statsResponse.data.sellers || 0,
            usersCount: statsResponse.data.users || 0
          });
        }
      } catch (err) {
        console.error('Error fetching landing page books and stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailInput)) {
      toast.error('Please enter a valid email address (e.g. name@example.com)');
      return;
    }
    setNewsletterSubscribed(true);
    toast.success('Thank you for subscribing to our newsletter!');
    setEmailInput('');
  };

  const handleQuickViewWishlist = (bookId) => {
    toast.error('Please log in as a User to manage your wishlist.');
    setSelectedBook(null);
    navigate('/user/login');
  };

  const handleQuickViewBuy = (book) => {
    toast.error('Please log in to purchase books.');
    setSelectedBook(null);
    navigate('/user/login');
  };

  const handleQuickViewFullDetails = (bookId) => {
    setSelectedBook(null);
    navigate(`/user/login?redirect=book&id=${bookId}`);
  };

  // Framer Motion presets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="landing-page font-poppins" style={{ backgroundColor: '#f8fafc' }}>
      {/* Modern Sticky Navbar */}
      <header className="landing-header">
        <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <BookOpen className="brand-logo" />
          <span className="brand-name">BookVerse</span>
        </div>
        <div className="role-nav">
          <Link to="/user/login" className="role-btn user-btn"><User className="nav-btn-icon" /> User Portal</Link>
          <Link to="/seller/login" className="role-btn seller-btn"><Store className="nav-btn-icon" /> Seller Portal</Link>
          <Link to="/admin/login" className="role-btn admin-btn"><Shield className="nav-btn-icon" /> Admin Portal</Link>
        </div>
      </header>

      {/* Stunning Hero Section */}
      <section className="hero-banner-new" style={{
        background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
        padding: '120px 40px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '85vh'
      }}>
        {/* Animated Background Grids */}
        <div className="hero-grid-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(245,158,11,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div className="hero-content-new" style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '20px' }}
          >
            <span className="hero-badge" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#bfdbfe', fontSize: '13px', fontWeight: 600, padding: '6px 16px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles className="badge-spark" style={{ width: '14px', height: '14px', color: '#f59e0b' }} /> Every Great Story Begins Here
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: '54px', fontWeight: 800, lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.03em', color: '#fff' }}
          >
            Your Story Starts <br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Between the Pages
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 1.6, maxWidth: '620px', margin: '0 auto 40px auto' }}
          >
            Discover thousands of handpicked volumes, support local independent booksellers, and connect directly with shop owners globally.
          </motion.p>

          <motion.div 
            className="hero-ctas"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
          >
            <button className="btn btn-primary" onClick={() => navigate('/user/login')} style={{ padding: '14px 32px', fontSize: '16px' }}>
              Explore Books <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/seller/signup')} style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff', padding: '14px 32px', fontSize: '16px' }}>
              Become a Seller
            </button>
          </motion.div>
        </div>

        {/* Floating Book Animations */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '15%', left: '8%', opacity: 0.15, pointerEvents: 'none' }}
        >
          <BookMarked style={{ width: '120px', height: '120px' }} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut', delay: 1 }}
          style={{ position: 'absolute', top: '15%', right: '10%', opacity: 0.12, pointerEvents: 'none' }}
        >
          <BookOpen style={{ width: '140px', height: '140px' }} />
        </motion.div>
      </section>

      {/* Dynamic Statistics Section (Only shows real numbers from database) */}
      {stats.booksCount > 0 && (
        <section className="stats-real-section" style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid var(--border-color)',
          padding: '40px 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'flex', justifyContent: 'center', gap: '80px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>{stats.booksCount}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Books Available</p>
            </div>
            <div style={{ width: '1px', backgroundColor: '#e2e8f0' }}></div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>{stats.sellersCount}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Registered Sellers</p>
            </div>
            <div style={{ width: '1px', backgroundColor: '#e2e8f0' }}></div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a' }}>{stats.usersCount}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Registered Users</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Shelf Carousel */}
      <section className="featured-section-new" style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em' }}>Featured Books</h2>
            <p style={{ color: '#64748b', marginTop: '4px' }}>Explore some of the most anticipated titles of this week</p>
          </div>
          <Link to="/user/login" className="shelf-link" style={{ fontSize: '15px', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View Full Shelf <ChevronRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <div className="books-grid-shelf" style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '28px',
            paddingBottom: '20px',
            scrollBehavior: 'smooth'
          }}>
            {books.slice(0, 8).map((book) => (
              <motion.div 
                key={book._id} 
                className="book-card-premium"
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(15,23,42,0.08)' }}
                style={{ flex: '0 0 280px', width: '280px' }}
              >
                <div className="book-card-image-box">
                  <img src={getBookCover(book)} alt={book.title} className="book-card-cover-img" />
                  {book.stock === 0 && (
                    <div className="out-of-stock-overlay">Out of Stock</div>
                  )}
                </div>
                
                <div className="book-card-details">
                  <div className="category-badge"><TagIcon /> {book.category}</div>
                  <h3 className="book-title" title={book.title}>{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  
                  <div className="book-footer-info">
                    <span className="book-price">₹{book.price !== undefined && book.price !== null ? Number(book.price).toFixed(2) : '0.00'}</span>
                    <span className="rating-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>
                      <Star style={{ width: '14px', height: '14px', fill: '#f59e0b' }} /> {book.averageRating !== undefined && book.averageRating !== null ? Number(book.averageRating).toFixed(1) : '0.0'}
                    </span>
                  </div>

                  <div className="book-card-buttons" style={{ gridTemplateColumns: '1fr' }}>
                    <button
                      className="btn-view-pill"
                      onClick={() => setSelectedBook(book)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Categories */}
      <section className="home-page-section-wrapper" style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>Popular Categories</h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>Find the exact genre to fuel your curiosity</p>
        </div>
        <div className="category-grid-premium">
          {[
            { name: 'Fiction', icon: '📖', desc: 'Escape into worlds built by imagination', redirect: 'Fiction' },
            { name: 'Science', icon: '🧪', desc: 'Expand your knowledge of the universe', redirect: 'Science' },
            { name: 'Biographies', icon: '👤', desc: 'Read about the lives that shaped our world', redirect: 'Biographies' },
            { name: "Children", icon: '👶', desc: 'Inspire magic in young minds', redirect: 'Children' },
            { name: 'Romance', icon: '❤️', desc: 'Feel the power of love and human connection', redirect: 'Romance' },
            { name: 'Horror', icon: '👻', desc: 'Test your limits with spine-chilling tales', redirect: 'Horror' }
          ].map((cat, idx) => (
            <motion.div
              key={idx}
              className="category-card-premium"
              whileHover={{ y: -8, boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.08)' }}
              onClick={() => navigate(`/user/login?redirect=books&category=${cat.redirect}`)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="home-page-section-wrapper">
        <div className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>Why Choose BookVerse?</h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>We are building a community centered around the love for books</p>
        </div>
        <div className="why-us-grid-premium">
          {[
            { title: 'Wide Collection', desc: 'Explore thousands of books across multiple genres.', icon: <BookMarked /> },
            { title: 'Verified Sellers', desc: 'Direct access to verified local independent stores.', icon: <Store /> },
            { title: 'Secure Payments', desc: 'Multiple secure checkout and gateway mechanisms.', icon: <ShieldCheck /> },
            { title: 'Fast Delivery', desc: 'Sellers ship items directly with quick timelines.', icon: <TrendingUp /> },
            { title: 'Easy Ordering', desc: 'Order books in a few simple clicks with COD/UPI.', icon: <ShoppingBag /> },
            { title: 'Quality Books', desc: 'Each physical book is reviewed and checked for print quality.', icon: <Star /> }
          ].map((feature, idx) => (
            <div key={idx} className="why-card-premium">
              <div className="why-icon-box">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline: How It Works */}
      <section className="home-page-section-wrapper" style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>How It Works</h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>Follow these simple steps from discovery to delivery</p>
        </div>
        <div className="timeline-wrapper-premium">
          <div className="timeline-line-premium"></div>
          <div className="timeline-steps-grid-premium">
            {[
              { step: '1', title: 'Browse Books', desc: 'Search title catalog' },
              { step: '2', title: 'Select Book', desc: 'Check specifications' },
              { step: '3', title: 'Place Order', desc: 'Provide address details' },
              { step: '4', title: 'Seller Confirms', desc: 'Direct merchant validation' },
              { step: '5', title: 'Packed', desc: 'Secured print wrapping' },
              { step: '6', title: 'Shipped', desc: 'Handed to shipment courier' },
              { step: '7', title: 'Delivered', desc: 'Arrives at your doorstep' }
            ].map((step, idx) => (
              <div key={idx} className="timeline-step-card-premium">
                <div className="timeline-step-bubble">{step.step}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="home-page-section-wrapper">
        <div className="newsletter-card-premium">
          <div className="newsletter-illustration-column">
            <BookMarked className="floating-newsletter-book" style={{ color: 'rgba(255, 255, 255, 0.08)', position: 'absolute', width: '240px', height: '240px' }} />
            <BookOpen style={{ width: '90px', height: '120px', color: '#3b82f6', filter: 'drop-shadow(0 15px 30px rgba(59, 130, 246, 0.4))', transform: 'rotate(-10deg)', position: 'relative', zIndex: 5 }} />
          </div>
          
          <div className="newsletter-form-premium-wrapper">
            <AnimatePresence mode="wait">
              {!newsletterSubscribed ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h2>Subscribe to our Newsletter</h2>
                  <p>Get weekly updates on popular titles, curated reading lists, and author interviews.</p>
                  <form onSubmit={handleNewsletterSubmit} className="premium-input-box-wrapper">
                    <Mail className="input-icon-mail" />
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required 
                    />
                    <button type="submit">Subscribe</button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  style={{ textAlign: 'center' }}
                >
                  <CheckCircle style={{ width: '56px', height: '56px', color: '#10b981', margin: '0 auto 16px auto' }} />
                  <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>You're Subscribed!</h2>
                  <p style={{ color: '#94a3b8', fontSize: '15px' }}>Thank you for joining. We will deliver curated reading logs straight to your inbox.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Quick View Modal integration */}
      <AnimatePresence>
        {selectedBook && (
          <QuickView 
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onAddToWishlist={handleQuickViewWishlist}
            isWishlisted={false}
            onBuyNow={handleQuickViewBuy}
            showFullDetailsLink={handleQuickViewFullDetails}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
);

export default Home;
