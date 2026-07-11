import express from 'express';
import Book from '../models/Book.js';

const router = express.Router();

// GET / - Return all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({}).populate('seller', 'fullName shopName');
    return res.status(200).json({ success: true, books });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /search - Search books
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Missing search query' });
    }
    const searchRegex = new RegExp(q, 'i');
    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { category: searchRegex },
      ],
    }).populate('seller', 'fullName shopName');
    return res.status(200).json({ success: true, books });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /category/:category - Books by category
router.get('/category/:category', async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.category }).populate('seller', 'fullName shopName');
    return res.status(200).json({ success: true, books });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /seller/:id - Books by seller
router.get('/seller/:id', async (req, res) => {
  try {
    const books = await Book.find({ seller: req.params.id }).populate('seller', 'fullName shopName');
    return res.status(200).json({ success: true, books });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /:id - Return one book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('seller', 'fullName shopName')
      .populate('reviews.user', 'fullName');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    return res.status(200).json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
