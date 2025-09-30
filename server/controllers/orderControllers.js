// server/controllers/orderControllers.js
import Order from "../models/Order.js";

// existing:
export const getOrderBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const order = await Order.findOne({ stripeSessionId: sessionId }).populate("products.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// NEW:
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("products.product").sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    console.error("getOrdersByUserId error:", err);
    res.status(500).json({ message: err.message });
  }
};

