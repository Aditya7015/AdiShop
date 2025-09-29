import Stripe from "stripe";
import Order from "../models/Order.js"; // adjust path if needed
import connectDB from "../configs/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Connect to MongoDB
connectDB();

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  // Get raw body
  const buf = await buffer(req);

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.log("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Payment completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.paymentStatus = "paid";
        await order.save();
        console.log(`Order ${order.orderId} marked as paid`);
      }
    } catch (err) {
      console.error("Error updating order:", err);
    }
  }

  res.status(200).send("Received");
}

// Helper to read raw request body
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
