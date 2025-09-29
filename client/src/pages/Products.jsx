// src/pages/Products.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { addToCart } from "../redux/cartSlice";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // CATEGORY FILTER
  if (filters.category && filters.category !== "All") {
    result = result.filter(
      (p) => (p.category || "").toLowerCase() === filters.category.toLowerCase()
    );
  }

  // PRICE FILTER
  result = result.filter((p) => {
    const price = Number(p.price || 0);
    const min = Number(filters.minPrice || 0);
    const max = Number(filters.maxPrice || 1000000);
    return price >= min && price <= max;
  });

  // --- IN STOCK FILTER ---
  // Always remove out-of-stock products
  result = result.filter((p) => p.inStock === true);

  // SORTING
  if (filters.sortBy === "lowToHigh") {
    result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (filters.sortBy === "highToLow") {
    result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  } else if (filters.sortBy === "newest") {
    result.sort(
      (a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
    );
  }

  setFilteredProducts(result);
}, [filters, products]);


// useEffect(() => {
//   // Start with all products
//   let result = [...products];

//   // --- CATEGORY FILTER ---
//   if (filters.category && filters.category !== "All") {
//     result = result.filter(
//       (p) => (p.category || "").toLowerCase() === filters.category.toLowerCase()
//     );
//   }

//   // --- PRICE FILTER ---
//   result = result.filter((p) => {
//     const price = Number(p.price || 0); // convert string to number, default 0
//     const min = Number(filters.minPrice || 0);
//     const max = Number(filters.maxPrice || 1000000); // some high default
//     return price >= min && price <= max;
//   });

//   // --- IN STOCK FILTER ---
//   if (filters.inStock) {
//     result = result.filter((p) => p.inStock === true);
//   }

//   // --- SORTING ---
//   if (filters.sortBy === "lowToHigh") {
//     result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
//   } else if (filters.sortBy === "highToLow") {
//     result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
//   } else if (filters.sortBy === "newest") {
//     result.sort(
//       (a, b) =>
//         new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())
//     );
//   }

//   // Set filtered products
//   setFilteredProducts(result);
// }, [filters, products]);



  if (loading) return <p className="text-center mt-20">Loading products...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  const ProductCard = ({ product }) => {
    const image = product.images?.[0] || "https://via.placeholder.com/300";

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
      } catch (err) {
        toast.error("Failed to add product to cart");
      }
    };

    return (
      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer overflow-hidden transition"
      >
        <img
          src={image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-3">
          <p className="text-sm text-gray-600">{product.brand || "Brand"}</p>
          <h3 className="font-medium text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-gray-900 font-semibold">
            ₹{product.price}{" "}
            {product.originalPrice && (
              <>
                <span className="text-gray-400 line-through ml-1">
                  ₹{product.originalPrice}
                </span>
                <span className="text-green-600 text-sm ml-1">
                  ({Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % OFF)
                </span>
              </>
            )}
          </p>
          {product.rating && (
            <p className="text-yellow-500 text-sm">⭐ {product.rating}</p>
          )}
          <button
            onClick={handleAddToCart}
            className="mt-2 w-full bg-slate-800 text-white py-1.5 rounded hover:bg-slate-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar Filters */}
      <aside className="hidden md:block w-64 bg-white shadow p-5">
        <h3 className="text-lg font-bold mb-4">Filters</h3>

        {/* Category */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
          {["All", "Mens Wear", "Womens Wear", "Kids Wear", "Beauty Products"].map(
            (cat) => (
              <label key={cat} className="flex gap-2 text-sm text-gray-600 mb-1">
                <input
                  type="radio"
                  checked={filters.category === cat}
                  onChange={() =>
                    setFilters((prev) => ({ ...prev, category: cat }))
                  }
                />
                {cat}
              </label>
            )
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Price</h4>
          <input
            type="number"
            className="border p-1 w-20 rounded mr-2"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minPrice: Number(e.target.value),
              }))
            }
          />
          -
          <input
            type="number"
            className="border p-1 w-20 rounded ml-2"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxPrice: Number(e.target.value),
              }))
            }
          />
        </div>

        {/* In Stock */}
        <div className="mb-6">
          <label className="flex gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  inStock: e.target.checked,
                }))
              }
            />
            In Stock Only
          </label>
        </div>
      </aside>

      {/* Right Section */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {filters.category === "All" ? "All Products" : filters.category}
          </h1>
          <select
            className="border border-gray-300 rounded px-3 py-2"
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
            }
          >
            <option value="recommended">Recommended</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center mt-10 text-gray-500">
            No products found in {filters.category}.
          </p>
        )}
      </main>
    </div>
  );
};

export default Products;
