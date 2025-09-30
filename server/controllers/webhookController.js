import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { sendOrderConfirmation } from '../services/emailService.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Find order by stripe session id
      const order = await Order.findOne({ stripeSessionId: session.id });

      if (order) {
        order.paymentStatus = 'paid';
        await order.save();
        console.log(`Order ${order.orderId} marked as paid`);

        // Send order confirmation email
        try {
          const user = await User.findById(order.customer);
          
          if (user) {
            // Get product details for email
            const productIds = order.products.map(p => p.product);
            const products = await Product.find({ _id: { $in: productIds } });
            
            await sendOrderConfirmation(order, user, products);
            console.log(`🟢 Order confirmation email sent to: ${user.email}`);
          } else {
            console.warn(`User not found for order ${order.orderId}`);
          }
        } catch (emailError) {
          console.error('🔴 Failed to send order confirmation email:', emailError);
        }

        // Clear user's cart
        if (order.customer) {
          try {
            await Cart.findOneAndUpdate(
              { userId: order.customer },
              { products: [] }
            );
            console.log(`Cleared cart for user ${order.customer}`);
          } catch (err) {
            console.error('Error clearing cart for user:', err);
          }
        }
      } else {
        console.warn(`No order found for sessionId: ${session.id}`);
      }
    } catch (err) {
      console.error('Error processing checkout.session.completed webhook:', err);
    }
  }

  res.status(200).send('Received');
});

export default router;