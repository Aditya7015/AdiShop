// server/controllers/searchController.js
import Product from "../models/Product.js";

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q: searchQuery } = req.query;

    console.log("Search query received:", searchQuery); // For debugging

    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).json({ 
        message: "Search query is required",
        products: []
      });
    }

    // Create a case-insensitive regex pattern for searching
    const searchRegex = new RegExp(searchQuery.trim(), 'i');

    // Search in name, description, and category, and only in-stock products
    const products = await Product.find({
      inStock: true,
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ]
    }).sort({ createdAt: -1 });

    console.log("Products found:", products.length); // For debugging

    res.status(200).json({
      message: "Search completed successfully",
      products,
      searchQuery: searchQuery.trim(),
      resultsCount: products.length
    });

  } catch (err) {
    console.error("Error in searchProducts controller:", err);
    res.status(500).json({ 
      message: "Failed to search products",
      products: [],
      error: err.message 
    });
  }
};