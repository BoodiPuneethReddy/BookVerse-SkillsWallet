import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snavbar from './Snavbar';
import API from '../api/axios';
import { FileText, User, Tag, IndianRupee, Layers, Image, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const Addbook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, author, category, price, stock, description } = formData;
    if (!title || !author || !category || !price || !stock || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('author', author);
      data.append('category', category);
      data.append('price', price);
      data.append('stock', stock);
      data.append('description', description);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await API.post('/seller/add-book', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Book added successfully');
        navigate('/seller/products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout font-poppins">
      <Snavbar />
      <main className="dashboard-content">
        <div className="form-container-new">
          <div className="form-card-new-panel">
            <h2>Add New Book</h2>
            <p className="subtitle-text">Publish a new paperback or text book catalog item into the BookVerse store.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid-two-cols">
                <div className="form-group-with-icon">
                  <label htmlFor="title">Book Title</label>
                  <div className="input-icon-wrapper">
                    <FileText className="input-left-icon" />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Atomic Habits"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-with-icon">
                  <label htmlFor="author">Author Name</label>
                  <div className="input-icon-wrapper">
                    <User className="input-left-icon" />
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="e.g. James Clear"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-with-icon">
                  <label htmlFor="category">Genre / Category</label>
                  <div className="input-icon-wrapper">
                    <Tag className="input-left-icon" />
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 46px',
                        fontSize: '14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                        outline: 'none',
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
                </div>

                <div className="form-grid-nested-two">
                  <div className="form-group-with-icon">
                    <label htmlFor="price">Price (₹)</label>
                    <div className="input-icon-wrapper">
                      <IndianRupee className="input-left-icon" />
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group-with-icon">
                    <label htmlFor="stock">Stock Inventory</label>
                    <div className="input-icon-wrapper">
                      <Layers className="input-left-icon" />
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group-with-icon full-row-form">
                <label htmlFor="description">Synopsis / Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed summary of the book cover flap details or back summary..."
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Upload image block */}
              <div className="image-upload-wrapper-new">
                <label>Book Cover Image</label>
                <div className="upload-dropzone">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden-file-input"
                  />
                  <label htmlFor="image" className="dropzone-label">
                    {imagePreview ? (
                      <div className="preview-image-box">
                        <img src={imagePreview} alt="Preview" />
                        <span className="change-img-btn">Change Cover</span>
                      </div>
                    ) : (
                      <div className="dropzone-placeholder">
                        <Upload className="dropzone-upload-icon" />
                        <p>Drag and drop or <span>Browse</span> your image</p>
                        <span>Supports JPG, PNG, WEBP up to 5MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="form-actions-new">
                <button type="submit" className="btn btn-primary btn-block btn-submit-form" disabled={loading}>
                  {loading ? 'Publishing Book...' : 'Publish Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Addbook;
