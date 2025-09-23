// controllers/stripeController.js
import Stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/stripe/create-session
 * body: { items: [{ productId, quantity }], customer: { id, email, name } }
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch product details from DB and prepare line_items
    const line_items = [];
    const productsForOrder = []; // to later store in Order
    let amountTotal = 0;

    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) return res.status(404).json({ message: "Product not found: " + it.productId });

      const quantity = it.quantity || 1;
      // Stripe expects amount in cents
      const unitAmount = Math.round((product.offerPrice ?? product.price) * 100);

      line_items.push({
        price_data: {
          currency: "usd", // or currency you use
          product_data: {
            name: product.name,
            description: product.description?.slice(0, 200) || "",
            metadata: { productId: product._id.toString() },
          },
          unit_amount: unitAmount,
        },
        quantity,
      });

      amountTotal += unitAmount * quantity;
      productsForOrder.push({ product: product._id, quantity });
    }

    // Optionally create a preliminary Order with "pending" status
    const orderId = crypto.randomBytes(8).toString("hex");
    const newOrder = await Order.create({
      orderId,
      customer: customer?.id || customer?.email || "guest",
      amount: amountTotal / 100,
      paymentStatus: "pending",
      status: "Pending",
      products: productsForOrder,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: customer?.email,
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        customerId: customer?.id || "",
        orderId: newOrder.orderId,
        mongoOrderId: newOrder._id.toString(),
      },
    });

    // Return the session id to frontend to redirect
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

/**
 * Webhook handler for Stripe events
 * This endpoint must receive the raw body (see stripeRoutes.js)
 */
export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // session.metadata should contain mongoOrderId (we set it above)
      const mongoOrderId = session.metadata?.mongoOrderId;
      const stripeSessionId = session.id;
      const amountTotal = session.amount_total ? session.amount_total / 100 : undefined;

      // Update the order in DB using mongoOrderId or orderId
      if (mongoOrderId) {
        await Order.findByIdAndUpdate(
          mongoOrderId,
          {
            paymentStatus: "paid",
            stripeSessionId,
            amount: amountTotal ?? undefined,
            status: "Pending",
          },
          { new: true }
        );
      } else if (session.metadata?.orderId) {
        await Order.findOneAndUpdate(
          { orderId: session.metadata.orderId },
          { paymentStatus: "paid", stripeSessionId, amount: amountTotal ?? undefined },
          { new: true }
        );
      }
    } else if (event.type === "checkout.session.async_payment_failed") {
      // handle failed payments
      const session = event.data.object;
      const mongoOrderId = session.metadata?.mongoOrderId;
      if (mongoOrderId) {
        await Order.findByIdAndUpdate(mongoOrderId, { paymentStatus: "failed" });
      }
    }

    // Return a 200 to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).send(`Webhook handler error: ${err.message}`);
  }
};
