import express from 'express';
import {
  signup,
  login,
  profile,
  dashboard,
  addBook,
  getMyBooks,
  getBook,
  updateBook,
  deleteBook,
  sellerOrders,
  updateOrderStatus,
} from '../controllers/SellerControllers.js';
import { protect, sellerOnly } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (Seller only)
router.get('/profile', protect, sellerOnly, profile);
router.get('/dashboard', protect, sellerOnly, dashboard);
router.get('/my-books', protect, sellerOnly, getMyBooks);
router.get('/book/:id', protect, sellerOnly, getBook);
router.post('/add-book', protect, sellerOnly, upload.single('image'), addBook);
router.put('/update-book/:id', protect, sellerOnly, upload.single('image'), updateBook);
router.delete('/delete-book/:id', protect, sellerOnly, deleteBook);
router.get('/my-orders', protect, sellerOnly, sellerOrders);
router.put('/update-order/:id', protect, sellerOnly, updateOrderStatus);

export default router;
