// import mongoose from "mongoose";

// const userSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["customer", "admin"], default: "customer" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);


// server/models/User.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String }, // e.g. 'Home', 'Office'
    name: { type: String },
    phone: { type: String },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },

    // Profile fields
    phone: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },

    // Multiple saved addresses
    addresses: { type: [addressSchema], default: [] },

    // Wishlist - array of product ObjectIds
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
