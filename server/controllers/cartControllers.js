import Cart from "../models/Cart.js";
import mongoose from "mongoose";

// Get cart by userId
export const getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    res.status(200).json(cart || { userId, products: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add product to cart


export const addToCart = async (req, res) => {
  const { userId } = req.params;
  // Support both { productId, quantity } and { product }
  let { productId, quantity, product } = req.body;

  // If frontend sent whole product object, extract id
  if (!productId && product) {
    productId = product._id || product.id || product.productId;
  }

  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  // Validate ObjectId format (defensive)
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid userId or productId" });
  }

  // Ensure quantity is a number
  quantity = Number(quantity) || 1;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    await cart.populate("products.productId");

    res.status(200).json(cart.products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product to cart", error: err.message });
  }
};




// Update quantity of a product
export const updateCartItem = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    }

    res.status(404).json({ message: "Product not found in cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// Remove product from cart
// export const removeCartItem = async (req, res) => {
//   const { userId, productId } = req.params;

//   try {
//     const cart = await Cart.findOne({ userId });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     cart.products = cart.products.filter(
//       (p) => p.productId.toString() !== productId
//     );

//     await cart.save();
//     res.status(200).json(cart);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to remove item" });
//   }
// };

// removeCartItem
export const removeCartItem = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("products.productId"); // ensure populated
    res.status(200).json(cart.products); // <-- send array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};


// Clear cart
export const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
