import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Snavbar from './Snavbar';
import API from '../api/axios';
import { getBookCover } from '../api/bookCovers';
import toast from 'react-hot-toast';
import { FaTrash, FaEdit, FaEye, FaTimes } from 'react-icons/fa';

const MyProducts = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });
  const [newImage, setNewImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchMyBooks = async () => {
    try {
      const res = await API.get('/seller/my-books');
      if (res.data.success) {
        setBooks(res.data.books);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const res = await API.delete(`/seller/delete-book/${id}`);
        if (res.data.success) {
          toast.success(res.data.message || 'Book deleted successfully');
          fetchMyBooks();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setEditFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price.toString(),
      stock: book.stock.toString(),
      description: book.description,
    });
    setNewImage(null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { title, author, category, price, stock, description } = editFormData;

    setSubmitLoading(true);
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('author', author);
      data.append('category', category);
      data.append('price', price);
      data.append('stock', stock);
      data.append('description', description);
      if (newImage) {
        data.append('image', newImage);
      }

      const res = await API.put(`/seller/update-book/${editingBook._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Book updated successfully');
        setShowEditModal(false);
        fetchMyBooks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="dashboard-layout font-poppins">
      <Snavbar />
      <main className="dashboard-content">
        <header className="dashboard-header flex-header">
          <h1>My Products</h1>
          <Link to="/seller/add-book" className="btn btn-primary">Add New Book</Link>
        </header>

        {loading ? (
          <div className="spinner-container"><div className="spinner"></div></div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <div className="table-img-wrapper">
                          <img src={getBookCover(book)} alt={book.title} />
                        </div>
                      </td>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>
                        <span className={book.stock === 0 ? 'text-danger font-bold' : ''}>
                          {book.stock}
                        </span>
                      </td>
                      <td>₹{book.price.toFixed(2)}</td>
                      <td className="actions-cell">
                        <Link to={`/seller/book/${book._id}`} className="btn btn-sm btn-outline" title="View Book">
                          <FaEye /> View
                        </Link>
                        <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(book)} title="Edit Book">
                          <FaEdit /> Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book._id)} title="Delete Book">
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">You haven't listed any books yet. Click Add New Book to start selling!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Book Details</h2>
                <button className="close-btn-x" onClick={() => setShowEditModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="edit-title">Title</label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-author">Author</label>
                    <input
                      type="text"
                      id="edit-author"
                      name="author"
                      value={editFormData.author}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-category">Genre / Category</label>
                    <select
                      id="edit-category"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        fontSize: '14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                      required
                    >
                      <option value="" disabled>Select category</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Science">Science</option>
                      <option value="Biographies">Biographies</option>
                      <option value="Children">Children</option>
                      <option value="Romance">Romance</option>
                      <option value="Horror">Horror</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-price">Price</label>
                    <input
                      type="number"
                      id="edit-price"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-stock">Stock</label>
                    <input
                      type="number"
                      id="edit-stock"
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleEditChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-description">Description</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-image">Update Book Cover (Optional)</label>
                    <input
                      type="file"
                      id="edit-image"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                    {submitLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProducts;
