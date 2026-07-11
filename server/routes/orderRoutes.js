import express from 'express';
import { placeOrder, myOrders } from '../controllers/UsersController.js';
import { updateOrderStatus } from '../controllers/SellerControllers.js';
import { protect, userOnly, sellerOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST / - Place Order
router.post('/', protect, userOnly, placeOrder);

// GET /mine - My Orders
router.get('/mine', protect, userOnly, myOrders);

// PUT /:id - Update Order Status
router.put('/:id', protect, sellerOnly, updateOrderStatus);

export default router;
