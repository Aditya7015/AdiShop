import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "../redux/wishlistSlice";
import toast from "react-hot-toast";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const BASE_URL = import.meta.env.VITE_API_URL;

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const [filters, setFilters] = useState({
    category: "All",
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    sortBy: "recommended",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q");

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}`);
        const productsData = response.data.products || response.data || [];
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setFilteredProducts(Array.isArray(productsData) ? productsData : []);
        
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results. Please try again.");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  // Fetch user's wishlist using Redux
  useEffect(() => {
    if (user && token) {
      dispatch(fetchWishlist(token));
    }
  }, [user, token, dispatch]);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Category
    if (filters.category && filters.category !== "All") {
      result = result.filter(
        (p) => (p.category || "").toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price
    result = result.filter((p) => {
      const price = Number(p.offerPrice || p.price || 0);
      const min = Number(filters.minPrice || 0);
      const max = Number(filters.maxPrice || 1000000);
      return price >= min && price <= max;
    });

    // In Stock
    if (filters.inStock) {
      result = result.filter((p) => p.inStock === true);
    }

    // Sorting
    if (filters.sortBy === "lowToHigh") {
      result.sort((a, b) => Number(a.offerPrice || a.price || 0) - Number(b.offerPrice || b.price || 0));
    } else if (filters.sortBy === "highToLow") {
      result.sort((a, b) => Number(b.offerPrice || b.price || 0) - Number(a.offerPrice || a.price || 0));
    } else if (filters.sortBy === "newest") {
      result.sort(
        (a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
      );
    }

    setFilteredProducts(result);
  }, [filters, products]);

  // Get unique categories for filter
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  // --- Product Card Component ---
// --- Product Card Component ---
const ProductCard = ({ product }) => {
  const image = product.images?.[0] || "https://via.placeholder.com/300";
  const [addedToCart, setAddedToCart] = useState(false);
  
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
      onClick={() => navigate(`/products/${product._id}`)} // FIXED: Changed to /products/
      className="bg-white rounded-lg shadow-sm hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300 relative group border border-gray-100"
    >
      {/* Wishlist Icon */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 transition-all duration-200 transform hover:scale-110 ${
          isInWishlist 
            ? "text-red-500 hover:text-red-600" 
            : "text-gray-400 hover:text-gray-600 bg-white/80 backdrop-blur-sm rounded-full p-1"
        }`}
      >
        {isInWishlist ? (
          <AiFillHeart size={22} />
        ) : (
          <AiOutlineHeart size={22} />
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
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
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
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 h-10 leading-tight">
          {product.name}
        </h3>
        
        {/* Rating (if available) */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <span className="bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
              {product.rating} ★
            </span>
            <span className="text-gray-600 text-xs">Ratings</span>
          </div>
        )}

        {/* Pricing */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{displayPrice}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-xs text-green-600 font-semibold">
              Great Deal!
            </span>
          )}
        </div>

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
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              ADD TO CART
            </button>
          ) : (
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-md hover:from-orange-600 hover:to-orange-700 transition-all text-sm font-medium"
            >
              BUY NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for "{searchQuery}"...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-6">
        {/* Search Header - Flipkart Style */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Results for "{searchQuery}"
              </h1>
              <p className="text-gray-600 text-sm">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
                {filters.category !== "All" && ` in ${filters.category}`}
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                }
              >
                <option value="recommended">Recommended</option>
                <option value="newest">Newest First</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Myntra Style */}
          <aside className="lg:w-64 bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">FILTERS</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">CATEGORY</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, category: cat }))
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="group-hover:text-blue-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

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
                category: "All",
                minPrice: 0,
                maxPrice: 10000,
                inStock: false,
                sortBy: "recommended",
              })}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 && !error ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                <div className="text-gray-500 text-lg mb-4">
                  No products found for "{searchQuery}"
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  Try different keywords or check the spelling
                </p>
                <Link
                  to="/products"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block font-medium"
                >
                  Browse All Products
                </Link>
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

export default SearchResults;