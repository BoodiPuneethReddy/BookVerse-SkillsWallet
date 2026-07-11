import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  LogOut, 
  ShoppingBag, 
  Home as HomeIcon, 
  Star, 
  ChevronLeft, 
  X, 
  Store, 
  Tag, 
  Book, 
  Check, 
  CreditCard,
  User,
  MessageSquare,
  Bookmark,
  AlertTriangle,
  Globe,
  FileText,
  Calendar
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
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [sameSellerBooks, setSameSellerBooks] = useState([]);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Order Placement Modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [quantity, setQuantity] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchBookDetails = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      if (res.data.success) {
        setBook(res.data.data);
        
        // Fetch related books in the same category
        const catRes = await API.get(`/books/category/${res.data.data.category}`);
        if (catRes.data.success) {
          const list = catRes.data.books.filter((b) => b._id !== id).slice(0, 4);
          setRelatedBooks(list);
        }

        // Fetch other books from the same seller
        if (res.data.data.seller?._id) {
          const sellerBooksRes = await API.get(`/books`);
          if (sellerBooksRes.data.success) {
            const list = sellerBooksRes.data.books
              .filter((b) => b.seller?._id === res.data.data.seller._id && b._id !== id)
              .slice(0, 4);
            setSameSellerBooks(list);
          }
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
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await API.post(`/users/review/${id}`, { rating, comment });
      if (res.data.success) {
        toast.success('Review added successfully');
        setComment('');
        fetchBookDetails(); // Refresh details
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      toast.error('Please enter shipping address');
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await API.post('/orders', {
        items: [
          {
            book: book._id,
            quantity: Number(quantity),
            price: book.price,
          },
        ],
        shippingAddress,
        paymentMethod,
      });

      if (res.data.success) {
        toast.success('Order placed successfully!');
        setShowOrderModal(false);
        navigate('/user/orders');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  const userName = JSON.parse(localStorage.getItem('user'))?.fullName || 'User';
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
          <Link to="/user/books" className="active-nav"><Book className="nav-btn-icon" /> Books</Link>
          <Link to="/user/orders"><ShoppingBag className="nav-btn-icon" /> My Orders</Link>
          <button onClick={handleLogout} className="logout-btn"><LogOut className="nav-btn-icon" /> Logout</button>
        </div>
      </header>

      <main className="user-main-content">
        <div className="back-nav-box" style={{ marginBottom: '24px' }}>
          <button onClick={() => navigate('/user/books')} className="back-text-btn">
            <ChevronLeft /> Back to catalog
          </button>
        </div>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : book ? (
          <div className="book-details-wrapper-new">
            {/* Split Grid Layout for Details */}
            <div className="details-split-grid">
              {/* Left Column: Huge Cover Box with Zoom */}
              <div className="details-cover-box-new">
                <div className="cover-inner-wrapper" style={{ cursor: 'zoom-in' }}>
                  <img src={getBookCover(book)} alt={book.title} />
                </div>
              </div>

              {/* Right Column: Title Info & CTA */}
              <div className="details-info-box-new">
                <div className="details-header-meta">
                  <span className="category-pill-badge"><Tag className="pill-icon" /> {book.category}</span>
                  <span className="seller-name-info"><Store className="pill-icon" /> {book.seller?.shopName || 'Partner Seller'}</span>
                </div>

                <h1 className="details-title">{book.title}</h1>
                <p className="details-author">by <strong>{book.author}</strong></p>

                {/* Rating display */}
                <div className="details-rating-block">
                  <div className="stars-list">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={s <= Math.round(book.averageRating) ? 'star-gold-filled' : 'star-muted'} />
                    ))}
                  </div>
                  <span className="rating-value">{book.averageRating !== undefined && book.averageRating !== null ? Number(book.averageRating).toFixed(1) : '0.0'} / 5.0</span>
                  <span className="rating-count">({book.reviews ? book.reviews.length : 0} reviews)</span>
                </div>

                <div className="price-tag-jumbo">₹{book.price !== undefined && book.price !== null ? Number(book.price).toFixed(2) : '0.00'}</div>

                {/* Description summary */}
                <div className="details-synopsis">
                  <h3>Synopsis</h3>
                  <p>{book.description}</p>
                </div>

                {/* Known Metadata Table Block */}
                {knownMetadata && (
                  <div className="book-specs-table-box" style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    marginTop: '24px',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText style={{ width: '18px', height: '18px', color: '#2563eb' }} /> Book Specifications
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', fontSize: '13px' }}>
                      <div><span style={{ color: '#64748b' }}>Publisher:</span> <strong style={{ color: '#334155' }}>{knownMetadata.publisher}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Published Year:</span> <strong style={{ color: '#334155' }}>{knownMetadata.publishedYear}</strong></div>
                      {knownMetadata.pages && (
                        <div><span style={{ color: '#64748b' }}>Pages:</span> <strong style={{ color: '#334155' }}>{knownMetadata.pages}</strong></div>
                      )}
                      <div><span style={{ color: '#64748b' }}>Language:</span> <strong style={{ color: '#334155' }}>{knownMetadata.language}</strong></div>
                      {knownMetadata.sales && (
                        <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Worldwide Sales:</span> <strong style={{ color: '#334155' }}>{knownMetadata.sales}</strong></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sticky Buy Card representation */}
                <div className="purchase-cta-card">
                  <div className="stock-level-jumbo">
                    <span className="dot-label">Status:</span>
                    {book.stock > 0 ? (
                      <span className="stock-label-instock"><Check className="stock-check-icon" /> {book.stock} Books available in stock</span>
                    ) : (
                      <span className="stock-label-outstock">Temporarily Out of Stock</span>
                    )}
                  </div>
                  <button
                    className="btn btn-primary btn-block btn-buy-now-jumbo"
                    onClick={() => setShowOrderModal(true)}
                    disabled={book.stock === 0}
                  >
                    <ShoppingBag className="buy-icon-jumbo" /> Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
              <section className="related-books-section" style={{ marginTop: '56px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>You May Also Like</h2>
                <div className="books-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                  {relatedBooks.map((relBook) => (
                    <div 
                      key={relBook._id} 
                      className="book-card-premium clickable"
                      onClick={() => navigate(`/user/book/${relBook._id}`)}
                    >
                      <div className="book-card-image-box" style={{ height: '240px' }}>
                        <img src={getBookCover(relBook)} alt={relBook.title} />
                      </div>
                      <div className="book-card-details">
                        <span className="category-badge">{relBook.category}</span>
                        <h4 className="book-title">{relBook.title}</h4>
                        <p className="book-author">by {relBook.author}</p>
                        <span className="book-price">₹{relBook.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Books From Same Seller */}
            {sameSellerBooks.length > 0 && (
              <section className="related-books-section" style={{ marginTop: '56px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>More from {book.seller?.shopName || 'this seller'}</h2>
                <div className="books-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                  {sameSellerBooks.map((relBook) => (
                    <div 
                      key={relBook._id} 
                      className="book-card-premium clickable"
                      onClick={() => navigate(`/user/book/${relBook._id}`)}
                    >
                      <div className="book-card-image-box" style={{ height: '240px' }}>
                        <img src={getBookCover(relBook)} alt={relBook.title} />
                      </div>
                      <div className="book-card-details">
                        <span className="category-badge">{relBook.category}</span>
                        <h4 className="book-title">{relBook.title}</h4>
                        <p className="book-author">by {relBook.author}</p>
                        <span className="book-price">₹{relBook.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Review Section */}
            <section className="reviews-section-new">
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

        {/* Place Order Checkout Modal */}
        {showOrderModal && book && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content order-checkout-modal-new"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="modal-header">
                <h2>Complete Checkout</h2>
                <button className="close-btn-x" onClick={() => setShowOrderModal(false)}><X /></button>
              </div>
              <form onSubmit={handlePlaceOrderSubmit}>
                <div className="modal-body">
                  <div className="checkout-summary-box-new">
                    <div className="summary-left-img">
                      <img src={getBookCover(book)} alt={book.title} />
                    </div>
                    <div className="summary-right-details">
                      <h3>{book.title}</h3>
                      <p className="author">by {book.author}</p>
                      <p className="price-tag-summary">₹{book.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="order-quantity">Quantity</label>
                    <input
                      type="number"
                      id="order-quantity"
                      min="1"
                      max={book.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shipping-address">Shipping Address</label>
                    <textarea
                      id="shipping-address"
                      rows="3"
                      placeholder="Street address, City, State, ZIP code"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="payment-method">Payment Method</label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="COD">💵 Cash on Delivery (COD)</option>
                      <option value="UPI">📱 UPI / QR Code Payment</option>
                      <option value="Card">💳 Credit / Debit Card</option>
                    </select>
                  </div>

                  <div className="checkout-total-footer">
                    <span>Order Total:</span>
                    <strong>₹{(book.price * quantity).toFixed(2)}</strong>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowOrderModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={placingOrder}>
                    {placingOrder ? 'Processing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Uitem;
