import express from 'express';
import { updateOrderStatus } from '../controllers/orderStatusController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/:orderId', protect, isAdmin, updateOrderStatus);

export default router;