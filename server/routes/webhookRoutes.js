import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // store in .env

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Update order in DB
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.paymentStatus = "paid";  // ✅ mark as paid
        await order.save();
      }
    } catch (err) {
      console.error("Webhook DB update error:", err);
    }
  }

  res.status(200).send('Received');
});

export default router;
