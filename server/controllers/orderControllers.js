// controllers/orderControllers.js
import Order from "../models/Order.js";

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
