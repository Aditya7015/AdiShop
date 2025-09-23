// models/Order.js
import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
