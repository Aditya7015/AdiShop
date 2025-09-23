// import express from 'express';
// import { addProduct, getAllProducts, getProductById, toggleProductStock } from '../controllers/productControllers.js';
// import upload from '../middlewares/upload.js';

// const router = express.Router();

// // Add a product (admin)
// router.post("/", upload.array("images", 4), addProduct);

// // Get all products
// router.get("/", getAllProducts);

// // Get product by ID
// router.get("/:id", getProductById);

// // Toggle stock (list/unlist product)
// router.put("/:id/toggle-stock", toggleProductStock);


// export default router;


// server/routes/productRoutes.js
import express from 'express';
import {
  addProduct,
  getAllProducts,
  getProductById,
  getProductsByOwner,
  toggleProductStock
} from '../controllers/productControllers.js';
import upload from '../middlewares/upload.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes
// Add product - only authenticated users (admins) can post — protect used
router.post("/", protect, upload.array("images", 4), addProduct);

// Get products posted by the logged-in user (admin) only
router.get("/owner/me", protect, getProductsByOwner);

// Toggle stock/list - protected and ownership enforced in controller
router.put("/:id/toggle-stock", protect, toggleProductStock);

export default router;
