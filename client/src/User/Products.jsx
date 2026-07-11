import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ShoppingBag, 
  Heart, 
  Search, 
  Home as HomeIcon,
  LogOut,
  Tag,
  Star,
  Bookmark
} from 'lucide-react';
import API from '../api/axios';
import Footer from '../Components/Footer';
import QuickView from '../Components/QuickView';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [wishlist, setWishlist] = useState([]);

  // Quick View State
  const [selectedQuickViewBook, setSelectedQuickViewBook] = useState(null);

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = '/books';
      const q = searchParams.get('search');
      if (q) {
        url = `/books/search?q=${q}`;
      }
      const res = await API.get(url);
      if (res.data.success) {
        setBooks(res.data.books || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const [cartCount, setCartCount] = useState(0);

  // Load wishlist from user profile and active cart count
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get('/users/profile');
        if (res.data.success) {
          setWishlist(res.data.data.wishlist || []);
        }
        const cartRes = await API.get('/cart');
        if (cartRes.data.success) {
          const totalCartQty = cartRes.data.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
          setCartCount(totalCartQty);
        }
      } catch (err) {
        console.error('Error fetching user metadata', err);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/books?search=${searchQuery.trim()}`);
    } else {
      navigate('/user/books');
    }
  };

  const toggleWishlist = async (bookId) => {
    const isWishlisted = wishlist.includes(bookId);
    let updatedWishlist = [];
    try {
      // Toggle on the server if possible or just update local UI
      const res = await API.post(`/users/wishlist/${bookId}`);
      if (res.data.success) {
        if (isWishlisted) {
          updatedWishlist = wishlist.filter((id) => id !== bookId);
          toast.success('Removed from Wishlist');
        } else {
          updatedWishlist = [...wishlist, bookId];
          toast.success('Added to Wishlist');
        }
        setWishlist(updatedWishlist);
      }
    } catch (err) {
      // Fallback
      if (isWishlisted) {
        updatedWishlist = wishlist.filter((id) => id !== bookId);
      } else {
        updatedWishlist = [...wishlist, bookId];
      }
      setWishlist(updatedWishlist);
    }
  };

  const handleQuickViewBuy = (book) => {
    setSelectedQuickViewBook(null);
    navigate(`/user/book/${book._id}`);
  };

  const handleQuickViewFullDetails = (bookId) => {
    setSelectedQuickViewBook(null);
    navigate(`/user/book/${bookId}`);
  };

  const userName = JSON.parse(localStorage.getItem('user'))?.fullName || 'User';

  const displayedBooks = books.filter((book) => {
    if (selectedCategory === 'All') return true;
    return book.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categoriesList = ['All', 'Fiction', 'Science', 'Biographies', 'Children', 'Romance', 'Horror'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
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
          <Link to="/user/books" className="active-nav"><BookOpen className="nav-btn-icon" /> Books</Link>
          <Link to="/user/orders"><ShoppingBag className="nav-btn-icon" /> My Orders</Link>
          <Link to="/user/cart" style={{ fontWeight: 600 }}>🛒 Cart ({cartCount})</Link>
          <button onClick={handleLogout} className="logout-btn"><LogOut className="nav-btn-icon" /> Logout</button>
        </div>
      </header>

      <main className="user-main-content">
        <header className="products-heading-section">
          <h1>Explore Our Collection</h1>
          <p className="subtitle-text">Browse from hundreds of handpicked paperbacks, biographies, and scientific textbooks.</p>
        </header>

        {/* Search Bar */}
        <div className="search-banner-improved">
          <form onSubmit={handleSearchSubmit} className="search-box-form-large">
            <input
              type="text"
              placeholder="Search by book title, author name, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-search-large">
              <Search className="search-icon-btn" /> Search
            </button>
          </form>
        </div>

        {/* Category Filters */}
        <div className="filters-container-improved">
          <div className="category-filters-list">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                className={`filter-tab-pill ${selectedCategory === cat ? 'active-tab-pill' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Books' : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <motion.div 
            className="books-grid-layout"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayedBooks.length > 0 ? (
              displayedBooks.map((book) => {
                const isWishlisted = wishlist.includes(book._id);
                const coverImage = getBookCover(book);

                return (
                  <motion.div 
                    key={book._id} 
                    className="book-card-premium"
                    variants={itemVariants}
                    whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)' }}
                  >
                    <div className="book-card-image-box">
                      <img src={coverImage} alt={book.title} className="book-card-cover-img" />
                      {book.stock === 0 && (
                        <div className="out-of-stock-overlay">Out of Stock</div>
                      )}
                    </div>
                    
                    <div className="book-card-details">
                      <div className="category-badge"><Tag className="pill-icon" /> {book.category}</div>
                      <h3 className="book-title" title={book.title}>{book.title}</h3>
                      <p className="book-author">by {book.author}</p>
                      
                      <div className="book-footer-info">
                        <span className="book-price">₹{book.price !== undefined && book.price !== null ? Number(book.price).toFixed(2) : '0.00'}</span>
                        <span className={`stock-status ${book.stock > 0 ? 'stock-instock' : 'stock-outstock'}`}>
                          {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>

                      <div className="book-card-buttons">
                        <button
                          className="btn-wishlist-pill"
                          onClick={() => setSelectedQuickViewBook(book)}
                          style={{ fontSize: '11px' }}
                        >
                          Quick View
                        </button>
                        <button
                          className="btn-view-pill"
                          onClick={() => navigate(`/user/book/${book._id}`)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="no-books-container">
                <p className="no-data">No books found matching your selection.</p>
                <button className="btn btn-outline" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); navigate('/user/books'); }}>
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Quick View Modal integration */}
      <AnimatePresence>
        {selectedQuickViewBook && (
          <QuickView 
            book={selectedQuickViewBook}
            onClose={() => setSelectedQuickViewBook(null)}
            onAddToWishlist={toggleWishlist}
            isWishlisted={wishlist.includes(selectedQuickViewBook._id)}
            onBuyNow={handleQuickViewBuy}
            showFullDetailsLink={handleQuickViewFullDetails}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Products;
