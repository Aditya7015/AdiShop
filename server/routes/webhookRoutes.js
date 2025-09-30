import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Webhook received:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log("Checkout session completed:", JSON.stringify(session, null, 2));

    try {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (!order) {
        console.warn(`No order found for sessionId: ${session.id}`);
      } else {
        order.paymentStatus = 'paid';
        await order.save();
        console.log(`Order ${order.orderId} marked as paid`);
      }
    } catch (err) {
      console.error('Error updating order payment status:', err);
    }
  }

  res.status(200).send('Received');
});

export default router;
