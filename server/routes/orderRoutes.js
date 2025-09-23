// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * Get order by Stripe sessionId
 * GET /api/orders/session/:sessionId
 */
router.get("/session/:sessionId", async (req, res) => {
  try {
    const order = await Order.findOne({ stripeSessionId: req.params.sessionId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order by sessionId:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get order by our internal orderId
 * GET /api/orders/:orderId
 */
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order by orderId:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get all orders for a customer
 * GET /api/orders/customer/:customerId
 */
router.get("/customer/:customerId", async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders by customer:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
