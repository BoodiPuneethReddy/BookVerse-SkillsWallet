import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Snavbar from './Snavbar';
import API from '../api/axios';
import { getBookCover } from '../api/bookCovers';

const Book = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/seller/book/${id}`);
        if (res.data.success) {
          setBook(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  return (
    <div className="dashboard-layout font-poppins">
      <Snavbar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <Link to="/seller/products" className="btn btn-outline btn-sm">&larr; Back to Products</Link>
          <h1>Book Details</h1>
        </header>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : book ? (
          <div className="book-detail-container">
            <div className="book-detail-main">
              <div className="book-detail-cover">
                <img src={getBookCover(book)} alt={book.title} />
              </div>
              <div className="book-detail-info-sheet">
                <h2>{book.title}</h2>
                <p className="author-name">by {book.author}</p>
                <div className="metadata-tag">{book.category}</div>
                <div className="price-tag-large">₹{book.price.toFixed(2)}</div>
                
                <div className="stock-info">
                  <span>Stock Status:</span>
                  <strong className={book.stock > 0 ? 'text-success' : 'text-danger'}>
                    {book.stock > 0 ? `${book.stock} Available` : 'Out of Stock'}
                  </strong>
                </div>

                <div className="book-description">
                  <h3>Description</h3>
                  <p>{book.description}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="no-data">Book not found or access denied.</p>
        )}
      </main>
    </div>
  );
};

export default Book;
