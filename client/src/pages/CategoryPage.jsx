import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../redux/wishlistSlice";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL;

const CategoryPage = () => {
  const { category } = useParams(); // "mens", "womens", "kids", "beauty"
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    brand: "",
    minPrice: 0,
    maxPrice: 100000,
    inStock: false,
    sortBy: "relevance",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Map URL param to database category name
  const categoryMap = {
    mens: "Mens Wear",
    womens: "Womens Wear",
    kids: "Kids Wear",
    beauty: "Beauty Products",
  };

  const categoryName = categoryMap[category] || "Unknown Category";

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/products`);
        const filtered = res.data.filter(
          (p) => p.category.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filtered);
        setFilteredProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products for this category.");
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  // Fetch user's wishlist using Redux
  useEffect(() => {
    if (user && token) {
      dispatch(fetchWishlist(token));
    }
  }, [user, token, dispatch]);

  // Apply filters + sorting
  useEffect(() => {
    let result = [...products];

    if (filters.brand) {
      result = result.filter((p) =>
        p.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    result = result.filter(
      (p) => (p.offerPrice || p.price) >= filters.minPrice && (p.offerPrice || p.price) <= filters.maxPrice
    );

    if (filters.inStock) {
      result = result.filter((p) => p.inStock);
    }

    if (filters.sortBy === "lowToHigh") {
      result.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
    } else if (filters.sortBy === "highToLow") {
      result.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
    } else if (filters.sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    }

    setFilteredProducts(result);
  }, [filters, products]);

  // --- Product Card Component ---
  const ProductCard = ({ product }) => {
    const image = product.images?.[0] || "https://via.placeholder.com/300";
    const [addedToCart, setAddedToCart] = useState(false);
    
    // Use Redux state to check if product is in wishlist
    const isInWishlist = wishlistItems.some(item => item._id === product._id);

    const handleAddToCart = async (e) => {
      e.stopPropagation();
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
        setAddedToCart(true);
      } catch (err) {
        toast.error("Failed to add product to cart");
      }
    };

    const handleBuyNow = (e) => {
      e.stopPropagation();
      if (!user) return toast.error("Please login first!");
      navigate(`/cart`);
    };

    const handleWishlistToggle = async (e) => {
      e.stopPropagation();
      if (!user) return toast.error("Please login first!");
      
      try {
        if (!isInWishlist) {
          await dispatch(addToWishlist({ 
            productId: product._id, 
            token: token 
          })).unwrap();
          toast.success("Added to wishlist!");
        } else {
          await dispatch(removeFromWishlist({ 
            productId: product._id, 
            token: token 
          })).unwrap();
          toast.success("Removed from wishlist!");
        }
      } catch (err) {
        console.error("Wishlist error:", err);
        toast.error("Failed to update wishlist");
      }
    };

    const displayPrice = product.offerPrice || product.price;
    const originalPrice = product.offerPrice ? product.price : null;
    const discount = originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

    return (
      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer overflow-hidden transition relative group"
      >
        {/* Wishlist Icon - Improved visibility */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 z-10 transition-all duration-200 transform hover:scale-110 ${
            isInWishlist 
              ? "text-pink-500 hover:text-pink-600" 
              : "text-gray-400 hover:text-gray-500"
          }`}
        >
          {isInWishlist ? (
            <AiFillHeart size={24} className="filter drop-shadow-sm" />
          ) : (
            <AiOutlineHeart size={24} />
          )}
        </button>

        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={product.name} 
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-red-600 font-bold px-3 py-1 rounded text-sm">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <p className="text-sm text-gray-600">{product.brand || "Brand"}</p>
          <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
          
          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-gray-900 font-semibold">
              ₹{displayPrice}
            </span>
            {originalPrice && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  ₹{originalPrice}
                </span>
                <span className="text-green-600 text-sm">
                  ({discount}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Rating (if available) */}
          {product.rating && (
            <p className="text-yellow-500 text-sm mb-2">⭐ {product.rating}</p>
          )}

          {/* Category */}
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block capitalize mb-3">
            {product.category || "Uncategorized"}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!addedToCart ? (
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                ADD TO CART
              </button>
            ) : (
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-500 transition text-sm font-medium"
              >
                BUY NOW
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading {categoryName} products...</p>
        </div>
      </div>
    );
  
  if (error) 
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  
  if (products.length === 0)
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">No products found in {categoryName}.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600 text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">FILTERS</h3>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">PRICE RANGE</h4>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
                  }
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">BRAND</h4>
              <input
                type="text"
                placeholder="Search brand"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filters.brand}
                onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
              />
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, inStock: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="group-hover:text-blue-600 transition-colors">In Stock Only</span>
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                brand: "",
                minPrice: 0,
                maxPrice: 100000,
                inStock: false,
                sortBy: "relevance",
              })}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                <div className="text-gray-500 text-lg mb-4">
                  No products found in {categoryName}
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  Try adjusting your filters or browse all products
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;