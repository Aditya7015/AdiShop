import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import cloudinary from "../configs/cloudinary.js";


// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await User.create({ name, email, password: hashedPassword, role });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import { sendWelcomeEmail } from '../services/emailService.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role });

    // Send welcome email (non-blocking with proper error handling)
    try {
      const emailResult = await sendWelcomeEmail(user);
      if (emailResult.success) {
        console.log(`🟢 Welcome email sent to: ${user.email}`);
      } else {
        console.log(`🟡 Email not sent (configuration issue): ${user.email}`);
      }
    } catch (emailError) {
      console.error('🔴 Email error (non-fatal):', emailError.message);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get current user's profile (protected)
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "wishlist",
        select: "name price offerPrice images inStock category", // fields you want
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update profile (protected)
// Accepts JSON fields (name, phone, bio, addresses)
// and/or an uploaded file `avatar` (use upload.single('avatar') in route)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, bio, addresses } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;

    // addresses can be sent as JSON string from frontend
    if (addresses) {
      try {
        user.addresses = typeof addresses === "string" ? JSON.parse(addresses) : addresses;
      } catch (e) {
        // fallback: if parsing fails, ignore or set error
        return res.status(400).json({ message: "Invalid addresses format" });
      }
    }

    // Avatar upload handling (if frontend posts multipart/form-data with file field 'avatar')
    if (req.file && req.file.buffer) {
      // Convert buffer to data-uri and upload to Cloudinary
      const base64 = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: "adishow/avatars",
        overwrite: true,
      });
      if (uploaded?.secure_url) user.avatarUrl = uploaded.secure_url;
    } else if (req.body.avatarUrl) {
      // If frontend provides already hosted avatar url
      user.avatarUrl = req.body.avatarUrl;
    }

    await user.save();

    const updated = await User.findById(userId).select("-password");
    res.status(200).json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("updateUserProfile error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------
   Wishlist actions
   ------------------- */

// GET /api/user/wishlist  (protected)
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId).populate({
      path: "wishlist",
      select: "name price offerPrice images inStock category",
    });

    res.status(200).json({ items: user.wishlist || [] });
  } catch (err) {
    console.error("getWishlist error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/user/wishlist { productId } (protected)
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(userId);
    user.wishlist = user.wishlist || [];

    // avoid duplicates
    if (user.wishlist.some((id) => id.toString() === productId.toString())) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    // return the added item populated
    const added = await Product.findById(productId).select("name price offerPrice images inStock category");

    res.status(201).json({ message: "Added to wishlist", item: added });
  } catch (err) {
    console.error("addToWishlist error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/user/wishlist/:productId (protected)
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: "productId is required" });

    const user = await User.findById(userId);
    const before = user.wishlist.length;
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
    await user.save();

    res.status(200).json({ message: "Removed from wishlist", removed: before - user.wishlist.length });
  } catch (err) {
    console.error("removeFromWishlist error:", err);
    res.status(500).json({ message: err.message });
  }
};