import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendOrderShipped } from '../services/emailService.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order status
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    
    await order.save();

    // Send shipping email if status changed to 'Shipped'
    if (status === 'Shipped') {
      try {
        const user = await User.findById(order.customer);
        if (user) {
          await sendOrderShipped(order, user, trackingNumber);
          console.log(`🟢 Order shipped email sent to: ${user.email}`);
        }
      } catch (emailError) {
        console.error('🔴 Failed to send shipping email:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('🔴 Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};