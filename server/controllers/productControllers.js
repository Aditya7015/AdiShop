// server/controllers/productControllers.js
import Product from "../models/Product.js";
import cloudinary from "../configs/cloudinary.js";

// Add product - now requires authentication (req.user)
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, offerPrice } = req.body;

    if (!name || !category || !price || !req.files?.length) {
      return res.status(400).json({ message: "Please provide all required fields and at least 1 image" });
    }

    // Upload images to Cloudinary (same logic as before)
    const imageUploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    });

    const imageResults = await Promise.all(imageUploadPromises);
    const images = imageResults.map(r => r.secure_url);

    // Create product with postedBy = logged-in user id
    const product = new Product({
      name,
      description,
      category,
      price,
      offerPrice,
      images,
      postedBy: req.user.id,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("Error in addProduct controller:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET all public products (unchanged)
export const getAllProducts = async (req, res) => {
  try {
    // return only listed products if you prefer; currently returning all:
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET products posted by authenticated user (admin)
export const getProductsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const products = await Product.find({ postedBy: ownerId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching owner's products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET single product by ID (unchanged)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Toggle product inStock — only if owner is the authenticated user
export const toggleProductStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ownership check
    if (!product.postedBy || product.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you can only modify your own products" });
    }

    product.inStock = !product.inStock;
    await product.save();

    res.status(200).json({
      message: `Product ${product.inStock ? "listed/in stock" : "unlisted/out of stock"} successfully`,
      product,
    });
  } catch (err) {
    console.error("Error toggling product stock:", err);
    res.status(500).json({ message: "Failed to toggle product stock" });
  }
};
