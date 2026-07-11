import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  LogOut, 
  ShoppingBag, 
  Home as HomeIcon, 
  Star, 
  ChevronLeft, 
  Store, 
  Tag, 
  Check, 
  MessageSquare,
  FileText,
  Sparkles,
  ShoppingBag as CartIcon
} from 'lucide-react';
import API from '../api/axios';
import Footer from '../Components/Footer';
import { getBookCover } from '../api/bookCovers';
import { getKnownMetadata } from '../api/knownBooks';
import toast from 'react-hot-toast';

const Uitem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alternativeSellers, setAlternativeSellers] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Purchase quantity
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchCartCount = async () => {
    try {
      const cartRes = await API.get('/cart');
      if (cartRes.data.success) {
        const totalCartQty = cartRes.data.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalCartQty);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const fetchBookDetails = async (bookId = id) => {
    setLoading(true);
    try {
      const res = await API.get(`/books/${bookId}`);
      if (res.data.success) {
        setBook(res.data.data);
        
        // Fetch alternative sellers for the same title
        const allBooksRes = await API.get('/books');
        if (allBooksRes.data.success) {
          const matchingSellers = allBooksRes.data.books.filter(
            b => b.title.toLowerCase() === res.data.data.title.toLowerCase()
          );
          setAlternativeSellers(matchingSellers);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
    fetchCartCount();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleAddToCart = async () => {
    if (!book) return;
    setAddingToCart(true);
    try {
      const res = await API.post('/cart/add', {
        bookId: book._id,
        quantity: quantity
      });
      if (res.data.success) {
        toast.success('Added to shopping cart!');
        fetchCartCount();
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!book) return;
    navigate(`/user/checkout?source=buyNow&bookId=${book._id}&qty=${quantity}`);
  };

  const handleChooseSeller = (alternativeBook) => {
    setBook(alternativeBook);
    setQuantity(1);
    toast.success(`Switched seller to ${alternativeBook.seller?.shopName || 'Partner Seller'}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await API.post(`/users/book/${book._id}/review`, { rating, comment });
      if (res.data.success) {
        toast.success('Review submitted successfully');
        setComment('');
        fetchBookDetails(book._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const knownMetadata = book ? getKnownMetadata(book.title) : null;

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

      <main className="user-main-content" style={{ paddingBottom: '80px' }}>
        <div className="back-nav-box" style={{ marginBottom: '24px' }}>
          <button onClick={() => navigate('/user/books')} className="back-text-btn">
            <ChevronLeft /> Back to catalog
          </button>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : book ? (
          <div>
            {/* Split Grid Layout for Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'start' }} className="uitem-details-responsive-grid">
              
              {/* Left Column: Cover Box */}
              <div style={{ position: 'sticky', top: '24px' }}>
                <motion.div 
                  className="details-cover-box-new"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '24px',
                    padding: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)'
                  }}
                >
                  <img 
                    src={getBookCover(book)} 
                    alt={book.title} 
                    style={{ width: '100%', maxWidth: '300px', height: 'auto', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                </motion.div>
              </div>

              {/* Right Column: Title, Metadata, Specs, Alternative Sellers, Sticky Buy Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* Meta details */}
                <div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <span className="category-pill-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                      <Tag className="pill-icon" style={{ width: '14px', height: '14px' }} /> {book.category}
                    </span>
                    <span className="seller-name-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0f7ff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>
                      <Store className="pill-icon" style={{ width: '14px', height: '14px' }} /> {book.seller?.shopName || 'Partner Seller'}
                    </span>
                  </div>

                  <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.2 }}>{book.title}</h1>
                  <p style={{ fontSize: '18px', color: '#64748b' }}>by <strong>{book.author}</strong></p>
                  
                  {/* Rating Block */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} style={{ width: '16px', height: '16px' }} className={s <= Math.round(book.averageRating || 0) ? 'star-gold-filled' : 'star-muted'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{book.averageRating !== undefined && book.averageRating !== null ? Number(book.averageRating).toFixed(1) : '0.0'} / 5.0</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>({book.reviews ? book.reviews.length : 0} reviews)</span>
                  </div>
                </div>

                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>₹{book.price !== undefined && book.price !== null ? Number(book.price).toFixed(2) : '0.00'}</div>

                {/* Synopsis */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Synopsis</h3>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.7 }}>{book.description}</p>
                </div>

                {/* Known Metadata Table Block */}
                {knownMetadata && (
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText style={{ width: '16px', height: '16px', color: '#2563eb' }} /> Book Specifications
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '13px' }}>
                      <div><span style={{ color: '#64748b' }}>Publisher:</span> <strong style={{ color: '#334155' }}>{knownMetadata.publisher}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Published Year:</span> <strong style={{ color: '#334155' }}>{knownMetadata.publishedYear}</strong></div>
                      {knownMetadata.pages && (
                        <div><span style={{ color: '#64748b' }}>Pages:</span> <strong style={{ color: '#334155' }}>{knownMetadata.pages}</strong></div>
                      )}
                      <div><span style={{ color: '#64748b' }}>Language:</span> <strong style={{ color: '#334155' }}>{knownMetadata.language}</strong></div>
                    </div>
                  </div>
                )}

                {/* Available Sellers Section */}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Available Sellers</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {alternativeSellers.map((altBook) => (
                      <div 
                        key={altBook._id} 
                        style={{
                          border: altBook._id === book._id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: altBook._id === book._id ? '#f0f7ff' : '#fff'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {altBook.seller?.shopName || 'Partner Seller'} 
                            {altBook._id === book._id && <span style={{ fontSize: '10px', backgroundColor: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Chosen</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            Stock: {altBook.stock > 0 ? `${altBook.stock} available` : <span style={{ color: '#ef4444' }}>Out of Stock</span>}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>₹{altBook.price.toFixed(2)}</span>
                          {altBook._id !== book._id && (
                            <button 
                              onClick={() => handleChooseSeller(altBook)}
                              className="btn btn-outline"
                              style={{ padding: '6px 14px', fontSize: '12px' }}
                            >
                              Choose
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase CTA Card */}
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>Availability Status:</span>
                      {book.stock > 0 ? (
                        <div style={{ color: '#16a34a', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <Check style={{ width: '16px', height: '16px' }} /> In Stock ({book.stock} left)
                        </div>
                      ) : (
                        <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {book.stock > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Qty:</span>
                        <select 
                          value={quantity} 
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }}
                        >
                          {[...Array(Math.min(10, book.stock)).keys()].map(x => (
                            <option key={x+1} value={x+1}>{x+1}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      onClick={handleAddToCart}
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '14px 28px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      disabled={book.stock === 0 || addingToCart}
                    >
                      <CartIcon style={{ width: '16px', height: '16px' }} /> {addingToCart ? 'Adding...' : 'Add To Cart'}
                    </button>
                    <button 
                      onClick={handleBuyNow}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '14px 28px', fontSize: '14px', fontWeight: 700 }}
                      disabled={book.stock === 0}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Review Section */}
            <section className="reviews-section-new" style={{ marginTop: '56px' }}>
              <div className="reviews-section-header">
                <h2>Reviews ({book.reviews ? book.reviews.length : 0})</h2>
              </div>

              <div className="reviews-split-grid">
                {/* Left Side: Write a review form */}
                <form onSubmit={handleReviewSubmit} className="review-composer-form-new">
                  <h3>Write a Review</h3>
                  
                  <div className="form-group">
                    <label htmlFor="rating-select">Select Rating</label>
                    <select
                      id="rating-select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars (Good)</option>
                      <option value="3">⭐⭐⭐ 3 Stars (Average)</option>
                      <option value="2">⭐⭐ 2 Stars (Poor)</option>
                      <option value="1">⭐ 1 Star (Very Bad)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="review-comment">Your Review</label>
                    <textarea
                      id="review-comment"
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about the characters, plotting, and key takeaways..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>

                {/* Right Side: Feed of comments */}
                <div className="reviews-feed-container">
                  {book.reviews && book.reviews.length > 0 ? (
                    book.reviews.map((rev) => (
                      <div key={rev._id} className="review-card-modern">
                        <div className="review-card-header">
                          <div className="reviewer-info">
                            <div className="avatar-letter">{rev.user ? rev.user.fullName[0].toUpperCase() : 'R'}</div>
                            <div>
                              <h4>{rev.user ? rev.user.fullName : 'Verified Reader'}</h4>
                              <span className="review-date-span">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="review-card-stars">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={s <= rev.rating ? 'star-gold-mini' : 'star-muted-mini'} />
                            ))}
                          </div>
                        </div>
                        <p className="review-card-body">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews-box" style={{
                      backgroundColor: '#f8fafc',
                      border: '1px dashed #e2e8f0',
                      borderRadius: '16px',
                      padding: '40px',
                      textAlign: 'center'
                    }}>
                      <MessageSquare style={{ width: '40px', height: '40px', color: '#94a3b8', marginBottom: '12px', display: 'inline-block' }} />
                      <p style={{ color: '#475569', fontSize: '14px' }}>No reviews yet. Be the first person to review this book.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <p className="no-data">Book not found.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Uitem;
