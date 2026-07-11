import express from 'express';
import { getCart, addToCart, updateCartQty, removeFromCart } from '../controllers/UsersController.js';
import { protect, userOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET / - Retrieve active user cart
router.get('/', protect, userOnly, getCart);

// POST /add - Add item to cart
router.post('/add', protect, userOnly, addToCart);

// PUT /update - Update item quantity in cart
router.put('/update', protect, userOnly, updateCartQty);

// DELETE /remove/:bookId - Remove item from cart
router.delete('/remove/:bookId', protect, userOnly, removeFromCart);

export default router;
