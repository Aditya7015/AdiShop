// controllers/stripeController.js
import Stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session
 * Expects body: { items: [{ productId, quantity }], customer: {id,email,name} }
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, customer } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Build line_items for Stripe
    const line_items = await Promise.all(
      items.map(async (it) => {
        const product = await Product.findById(it.productId);
        if (!product) throw new Error(`Product ${it.productId} not found`);

        return {
          price_data: {
            currency: "inr", // change if needed
            product_data: {
              name: product.name,
              description: product.description || undefined,
              images: product.images?.length ? [product.images[0]] : undefined,
              metadata: { productId: product._id.toString() },
            },
            unit_amount: Math.round((product.price || 0) * 100), // Stripe wants cents/paise
          },
          quantity: it.quantity || 1,
        };
      })
    );

    // Generate orderId for metadata
    const orderId = crypto.randomBytes(8).toString("hex");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: customer?.email,
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        customerId: customer?.id || "",
        orderId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * Stripe Webhook handler
 * Needs raw body, see server.js configuration
 */
export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const orderId = session.metadata?.orderId || `ord_${session.id}`;
      const customerId =
        session.metadata?.customerId || session.customer_email || "guest";
      const amountTotal = session.amount_total || 0;

      // Fetch line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        { limit: 100 }
      );

      const products = lineItems.data.map((li) => ({
        product: null, // optional: map to your DB product if you add productId metadata
        quantity: li.quantity,
      }));

      // Prevent duplicate order creation
      const existing = await Order.findOne({ stripeSessionId: session.id });
      if (!existing) {
        await Order.create({
          orderId,
          customer: customerId,
          amount: amountTotal / 100,
          paymentStatus: "paid",
          stripeSessionId: session.id,
          products,
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
