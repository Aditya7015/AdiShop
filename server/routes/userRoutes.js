// server/routes/userRoutes.js
import express from "express";
import upload from "../middlewares/upload.js"; // multer memoryStorage
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/userControllers.js";

import { protect } from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);

// Profile
userRoutes.get("/profile", protect, getUserProfile);
userRoutes.put("/profile", protect, upload.single("avatar"), updateUserProfile);

// Wishlist
userRoutes.get("/wishlist", protect, getWishlist);
userRoutes.post("/wishlist", protect, addToWishlist); // body: { productId }
userRoutes.delete("/wishlist/:productId", protect, removeFromWishlist);

export default userRoutes;
