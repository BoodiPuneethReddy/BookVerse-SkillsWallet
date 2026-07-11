import React, { useState, useEffect } from 'react';
import Anavbar from './Anavbar';
import API from '../api/axios';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

const Items = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await API.get('/admin/books');
      if (res.data.success) {
        setBooks(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      try {
        const res = await API.delete(`/admin/book/${bookId}`);
        if (res.data.success) {
          toast.success(res.data.message);
          fetchBooks();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="dashboard-layout font-poppins">
      <Anavbar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Manage Books</h1>
        </header>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Book Cover</th>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book, index) => (
                    <tr key={book._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="table-img-wrapper">
                          <img src={getBookCover(book)} alt={book.title} />
                        </div>
                      </td>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.seller ? book.seller.fullName : 'Unknown'}</td>
                      <td>₹{book.price.toFixed(2)}</td>
                      <td>{book.stock}</td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteBook(book._id)}
                        >
                          <FaTrash /> Delete Book
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">No books registered in the store.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Items;
