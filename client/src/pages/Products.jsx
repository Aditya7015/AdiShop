import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../redux/cartSlice";
import toast from 'react-hot-toast';

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const { category } = useParams(); // comes from /shop/:category or undefined
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: "All",
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    sortBy: "none",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const categoryMap = {
    mens: "Mens Wear",
    womens: "Womens Wear",
    kids: "Kids Wear",
    beauty: "Beauty Products",
  };

  useEffect(() => {
    if (category && categoryMap[category]) {
      setFilters((prev) => ({ ...prev, category: categoryMap[category] }));
    } else {
      setFilters((prev) => ({ ...prev, category: "All" }));
    }
  }, [category]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    if (filters.inStock) {
      result = result.filter((p) => p.inStock === true);
    }

    if (filters.sortBy === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
  }, [filters, products]);

  if (loading) return <p className="text-center mt-20">Loading products...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  const ProductCard = ({ product }) => {
    const image = product.images?.[0] || "https://via.placeholder.com/300";

    const handleAddToCart = async (e) => {
      e.stopPropagation();
      if (!user) return alert("Please login first to add items to cart!");

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

    const handleBuyNow = (e) => {
      e.stopPropagation();
      navigate(`/products/${product._id}`);
    };

    return (
      <div className="flex flex-col bg-white shadow-md w-72 rounded-md overflow-hidden">
        <div
          onClick={() => navigate(`/products/${product._id}`)}
          className="cursor-pointer"
        >
          <img
            className="w-72 h-48 object-cover"
            src={image}
            alt={product.name}
          />
          <div className="p-4 text-sm">
            <p className="text-slate-600">$ {product.price.toFixed(2)}</p>
            <p className="text-slate-800 text-base font-medium my-1.5">
              {product.name}
            </p>
            <p className="text-slate-500">
              {product.description?.slice(0, 60) || "No description available."}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4">
          <button
            className="bg-slate-100 text-slate-600 py-2 rounded-md hover:bg-slate-200 transition"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          <button
            className="bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 transition"
            onClick={handleBuyNow}
          >
            Buy now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 md:p-12 lg:p-16 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        {filters.category === "All" ? "All Products" : filters.category}
      </h1>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-6 items-center justify-center bg-white shadow p-6 rounded-md">
        <select
          className="border p-2 rounded-md"
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <option value="All">All Categories</option>
          <option value="Mens Wear">Mens Wear</option>
          <option value="Womens Wear">Womens Wear</option>
          <option value="Kids Wear">Kids Wear</option>
          <option value="Beauty Products">Beauty Products</option>
        </select>

        <div className="flex gap-2 items-center">
          <span className="text-gray-600">Price:</span>
          <input
            type="number"
            className="border p-2 w-24 rounded-md"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
            }
          />
          <span>-</span>
          <input
            type="number"
            className="border p-2 w-24 rounded-md"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
            }
          />
        </div>

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStock: e.target.checked }))
            }
          />
          In Stock Only
        </label>

        <select
          className="border p-2 rounded-md"
          value={filters.sortBy}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
          }
        >
          <option value="none">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No products found in {filters.category}.
        </p>
      )}
    </div>
  );
};

export default Products;
