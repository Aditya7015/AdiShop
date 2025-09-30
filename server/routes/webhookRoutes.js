// import express from 'express';
// import Stripe from 'stripe';
// import Order from '../models/Order.js';

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     console.log("Webhook received:", event.type);
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     console.log("Checkout session completed:", JSON.stringify(session, null, 2));

//     try {
//       const order = await Order.findOne({ stripeSessionId: session.id });
//       if (!order) {
//         console.warn(`No order found for sessionId: ${session.id}`);
//       } else {
//         order.paymentStatus = 'paid';
//         await order.save();
//         console.log(`Order ${order.orderId} marked as paid`);
//       }
//     } catch (err) {
//       console.error('Error updating order payment status:', err);
//     }
//   }

//   res.status(200).send('Received');
// });

// export default router;

// server/routes/webhookRoutes.js
import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

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
      // Try finding order by stripe session id
      let order = await Order.findOne({ stripeSessionId: session.id });

      // fallback: maybe session metadata has orderId or userId (we added userId earlier)
      if (!order && session.metadata?.orderId) {
        order = await Order.findOne({ orderId: session.metadata.orderId });
      }

      if (order) {
        order.paymentStatus = 'paid';
        await order.save();
        console.log(`Order ${order.orderId} marked as paid`);

        // Clear user's cart (prefer order.userId, fallback to session.metadata.userId)
        const uid = order.userId ? String(order.userId) : session.metadata?.userId;
        if (uid) {
          try {
            const cart = await Cart.findOne({ userId: uid });
            if (cart) {
              cart.products = [];
              await cart.save();
              console.log(`Cleared cart for user ${uid}`);
            } else {
              console.log(`No cart found for user ${uid} (nothing to clear)`);
            }
          } catch (err) {
            console.error('Error clearing cart for user:', err);
          }
        } else {
          console.warn('No userId available in order or session metadata to clear cart.');
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
