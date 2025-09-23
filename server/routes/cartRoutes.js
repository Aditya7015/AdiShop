import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartControllers.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/:userId", addToCart);
router.put("/:userId", updateCartItem);
router.delete("/:userId/:productId", removeCartItem);
router.delete("/:userId", clearCart);

export default router;
