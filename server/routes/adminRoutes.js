import express from 'express';
import {
  signup,
  login,
  profile,
  dashboard,
  getUsers,
  getSellers,
  getBooks,
  deleteBook,
  toggleBlockUser,
  approveSeller,
  getUserOrders,
} from '../controllers/AdminControllers.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (Admin only)
router.get('/profile', protect, adminOnly, profile);
router.get('/dashboard', protect, adminOnly, dashboard);
router.get('/users', protect, adminOnly, getUsers);
router.get('/sellers', protect, adminOnly, getSellers);
router.get('/books', protect, adminOnly, getBooks);
router.delete('/book/:id', protect, adminOnly, deleteBook);
router.put('/user/:id', protect, adminOnly, toggleBlockUser);
router.put('/seller/:id', protect, adminOnly, approveSeller);
router.get('/orders/user/:userId', protect, adminOnly, getUserOrders);

export default router;
