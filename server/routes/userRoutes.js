import express from 'express';
import {
  signup,
  login,
  profile,
  getBooks,
  getBook,
  searchBooks,
  placeOrder,
  myOrders,
  addReview,
} from '../controllers/UsersController.js';
import { protect, userOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/books', getBooks);
router.get('/book/:id', getBook);
router.get('/search', searchBooks);

// Protected routes (User only)
router.get('/profile', protect, userOnly, profile);
router.post('/place-order', protect, userOnly, placeOrder);
router.get('/my-orders', protect, userOnly, myOrders);
router.post('/review/:id', protect, userOnly, addReview);

export default router;
