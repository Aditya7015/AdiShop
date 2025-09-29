// controllers/stripeControllers.js
import Stripe from "stripe";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const line_items = cart.products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productId.name,
          images: item.productId.images,
        },
        unit_amount: Math.round((item.productId.offerPrice || item.productId.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    // Save order in DB
    const order = new Order({
      orderId: new Date().getTime().toString(),
      customer: userId,
      amount: cart.products.reduce(
        (acc, item) => acc + (item.productId.offerPrice || item.productId.price) * item.quantity,
        0
      ),
      stripeSessionId: session.id,
      products: cart.products.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
      })),
      paymentStatus: "pending",
    });

    await order.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ message: err.message });
  }
};
