import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const [wishlist, setWishlist] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.items || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    }
  };

  const removeFromWishlist = async (productId, productName) => {
    try {
      await axios.delete(`${BASE_URL}/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(wishlist.filter((item) => item._id !== productId));
      toast.success(`${productName} removed from wishlist!`);
    } catch (err) {
      console.error("Remove wishlist error:", err);
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) return toast.error("Please login first!");

    try {
      await dispatch(
        addToCart({
          userId: user._id,
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleBuyNow = (product) => {
    navigate(`/cart`);
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // Product Card Component (matching Products page style with Flipkart/Myntra-like wishlist)
  const WishlistProductCard = ({ product }) => {
    const [addedToCart, setAddedToCart] = useState(false);
    const image = product.images?.[0] || "https://via.placeholder.com/300";

    const handleCardAddToCart = async (e) => {
      e.stopPropagation();
      await handleAddToCart(product);
      setAddedToCart(true);
    };

    const handleCardBuyNow = (e) => {
      e.stopPropagation();
      handleBuyNow(product);
    };

    const handleRemoveFromWishlist = (e) => {
      e.stopPropagation();
      removeFromWishlist(product._id, product.name);
    };

    return (
      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer overflow-hidden transition relative group"
      >
        {/* Wishlist Icon - Red/Pink when in wishlist (like Flipkart/Myntra) */}
        <button
          onClick={handleRemoveFromWishlist}
          className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-600 transition-all duration-200 transform hover:scale-110"
          title="Remove from wishlist"
        >
          <AiFillHeart size={22} className="filter drop-shadow-sm" />
        </button>

        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={product.name} 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        {/* Product Details */}
        <div className="p-3">
          <p className="text-sm text-gray-600 mb-1">{product.brand || "Brand"}</p>
          <h3 className="font-medium text-gray-800 line-clamp-2 h-10 mb-2 leading-5">
            {product.name}
          </h3>
          
          {/* Price Section */}
          <div className="mb-2">
            <span className="text-gray-900 font-semibold text-lg">
              ₹{product.offerPrice || product.price}
            </span>
            {product.offerPrice && product.price && product.offerPrice < product.price && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-gray-500 line-through text-sm">
                  ₹{product.price}
                </span>
                <span className="text-green-600 text-sm font-medium">
                  {Math.round(
                    ((product.price - (product.offerPrice || product.price)) / product.price) *
                      100
                  )}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-3">
              <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded mr-1 flex items-center">
                {product.rating} ★
              </span>
              <span className="text-gray-600 text-sm">Rating</span>
            </div>
          )}

          {/* Add to Cart / Buy Now Buttons */}
          <div className="space-y-2">
            {!addedToCart ? (
              <button
                onClick={handleCardAddToCart}
                className="w-full bg-slate-800 text-white py-2.5 rounded hover:bg-slate-700 transition text-sm font-medium shadow-sm"
              >
                ADD TO CART
              </button>
            ) : (
              <button
                onClick={handleCardBuyNow}
                className="w-full bg-green-600 text-white py-2.5 rounded hover:bg-green-500 transition text-sm font-medium shadow-sm"
              >
                BUY NOW
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
            <p className="text-gray-600 text-sm mt-1">
              Your favorite items all in one place
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
            </span>
            <Link 
              to="/products" 
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition font-medium text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20 text-gray-600 bg-white rounded-lg shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <AiOutlineHeart size={32} className="text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6">
                Save your favorite items here to keep track of them and buy later.
              </p>
              <Link 
                to="/products" 
                className="inline-block bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition font-medium shadow-sm"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <WishlistProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;