import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Eye, BookOpen, Check, AlertTriangle } from 'lucide-react';
import { getBookCover } from '../api/bookCovers';
import { getKnownMetadata } from '../api/knownBooks';

const QuickView = ({ book, onClose, onAddToWishlist, isWishlisted, onBuyNow, showFullDetailsLink }) => {
  // Listen for ESC key press to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const metadata = getKnownMetadata(book.title);

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
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
        className="quick-view-card-modal"
        onClick={(e) => e.stopPropagation()} // stop close on card click
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        style={{
          backgroundColor: '#fff',
          borderRadius: '24px',
          width: '90%',
          maxWidth: '800px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.5fr',
          maxHeight: '90vh'
        }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
          className="close-hover-style"
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Cover column */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid var(--border-color)',
          position: 'relative'
        }}>
          <img 
            src={getBookCover(book)} 
            alt={book.title} 
            style={{
              maxHeight: '340px',
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 15px 30px -10px rgba(15,23,42,0.2)'
            }}
          />
          {book.stock === 0 && (
            <div className="out-of-stock-overlay" style={{ borderRadius: '8px' }}>Out of Stock</div>
          )}
        </div>

        {/* Details column */}
        <div style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span className="category-pill-badge" style={{ margin: 0 }}><TagIcon /> {book.category}</span>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '99px' }}>
              🏪 {book.seller?.shopName || 'BookVerse Store'}
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', lineHeight: 1.2 }}>{book.title}</h2>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>by <strong style={{ color: '#0f172a' }}>{book.author}</strong></p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#2563eb' }}>₹{book.price !== undefined && book.price !== null ? Number(book.price).toFixed(2) : '0.00'}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: book.stock > 0 ? '#16a34a' : '#dc2626' }}>
              {book.stock > 0 ? <Check style={{ width: '16px', height: '16px' }} /> : <AlertTriangle style={{ width: '16px', height: '16px' }} />}
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Description Snippet */}
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {book.description}
          </p>

          {/* Known Book Details specifications */}
          {metadata && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '28px',
              fontSize: '12px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px 20px'
            }}>
              <div><span style={{ color: '#64748b' }}>Publisher:</span> <strong style={{ color: '#334155' }}>{metadata.publisher}</strong></div>
              <div><span style={{ color: '#64748b' }}>Year:</span> <strong style={{ color: '#334155' }}>{metadata.publishedYear}</strong></div>
              <div><span style={{ color: '#64748b' }}>Pages:</span> <strong style={{ color: '#334155' }}>{metadata.pages || 'N/A'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Language:</span> <strong style={{ color: '#334155' }}>{metadata.language}</strong></div>
              {metadata.sales && (
                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#64748b' }}>Worldwide Sales:</span> <strong style={{ color: '#334155' }}>{metadata.sales}</strong></div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginTop: 'auto' }}>
            <button 
              className="btn btn-primary"
              disabled={book.stock === 0}
              onClick={() => onBuyNow(book)}
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              <ShoppingBag style={{ width: '16px', height: '16px' }} /> Buy Now
            </button>
            <button 
              onClick={() => onAddToWishlist(book._id)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                backgroundColor: isWishlisted ? '#fef2f2' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isWishlisted ? '#ef4444' : '#64748b'
              }}
              className="wishlist-btn-hover"
            >
              <Heart style={{ width: '20px', height: '20px', fill: isWishlisted ? '#ef4444' : 'transparent' }} />
            </button>
          </div>

          {showFullDetailsLink && (
            <button 
              onClick={() => showFullDetailsLink(book._id)}
              style={{
                textAlign: 'center',
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '13px',
                fontWeight: 600,
                marginTop: '16px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Eye style={{ width: '15px', height: '15px' }} /> View Full Details
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
);

export default QuickView;
