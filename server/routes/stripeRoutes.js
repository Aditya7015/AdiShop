// import express from 'express';
// import Stripe from 'stripe';
// import Cart from '../models/Cart.js';
// import Order from '../models/Order.js';

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // POST /api/stripe/checkout
// router.post('/checkout', async (req, res) => {
//   const { userId } = req.body;

//   try {
//     // Fetch cart items
//     const cart = await Cart.findOne({ userId }).populate('products.productId');
//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Map cart items to Stripe line items
//     const line_items = cart.products.map(item => {
//       const product = item.productId;
//       return {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: product.name,
//             images: product.images,
//           },
//           unit_amount: Math.round((product.offerPrice || product.price) * 100), // cents
//         },
//         quantity: item.quantity,
//       };
//     });

    

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items,
//       mode: 'payment',
//       success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/cart`,
//     });

//     // ⚡ Save the order in DB
//     const order = new Order({
//       orderId: new Date().getTime().toString(), // simple unique ID
//       customer: userId,
//       amount: cart.products.reduce(
//         (acc, item) => acc + (item.productId.offerPrice || item.productId.price) * item.quantity,
//         0
//       ),
//       stripeSessionId: session.id, // store session id
//       products: cart.products.map(item => ({
//         product: item.productId._id,
//         quantity: item.quantity,
//       })),
//       paymentStatus: 'pending',
//     });

//     await order.save();

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error('Stripe checkout error:', err);
//     res.status(500).json({ message: 'Failed to create Stripe session' });
//   }
// });

// export default router;


// server/routes/stripeRoutes.js
import express from 'express';
import Stripe from 'stripe';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/stripe/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    // ✅ Define your domain (use environment variable or fallback to localhost)
    const YOUR_DOMAIN = process.env.FRONTEND_URL || "http://localhost:5173";

    // ✅ Fetch user's cart
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // ✅ Convert cart products to Stripe line_items
    const line_items = cart.products.map(item => {
      const product = item.productId;
      const price = (product.offerPrice || product.price) || 0;

      return {
        price_data: {
          currency: 'usd', // or 'inr' if you prefer
          product_data: {
            name: product.name,
            description: product.description || "",
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      };
    });

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cart`,
      metadata: { userId },
    });

    // ✅ Create pending order before payment success
    const totalAmount = cart.products.reduce(
      (sum, item) =>
        sum + ((item.productId.offerPrice || item.productId.price) || 0) * item.quantity,
      0
    );

    const order = new Order({
      orderId: `ORD-${Date.now()}`,
      userId,
      customer: userId,
      amount: totalAmount,
      stripeSessionId: session.id,
      products: cart.products.map(it => ({
        product: it.productId._id,
        quantity: it.quantity,
      })),
      paymentStatus: 'pending',
    });

    await order.save();

    // ✅ Send checkout URL to frontend
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ message: 'Failed to create Stripe session', error: err.message });
  }
});

export default router;
