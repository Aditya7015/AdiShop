import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

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

  // Apply filters + sorting
  useEffect(() => {
    let result = [...products];

    if (filters.brand) {
      result = result.filter((p) =>
        p.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    result = result.filter(
      (p) => p.offerPrice >= filters.minPrice && p.offerPrice <= filters.maxPrice
    );

    if (filters.inStock) {
      result = result.filter((p) => p.inStock);
    }

    if (filters.sortBy === "lowToHigh") {
      result.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (filters.sortBy === "highToLow") {
      result.sort((a, b) => b.offerPrice - a.offerPrice);
    } else if (filters.sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
  }, [filters, products]);

  if (loading)
    return <p className="text-center mt-10">Loading {categoryName} products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (products.length === 0)
    return <p className="text-center mt-10">No products found in {categoryName}.</p>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="font-semibold text-lg mb-4">Filters</h2>

        {/* Price */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Price</h3>
          <div className="flex gap-2">
            <input
              type="number"
              className="border p-1 w-20 rounded"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
              }
            />
            <input
              type="number"
              className="border p-1 w-20 rounded"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
            />
          </div>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Brand</h3>
          <input
            type="text"
            placeholder="Search brand"
            className="border p-2 rounded w-full"
            value={filters.brand}
            onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
          />
        </div>

        {/* Stock */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, inStock: e.target.checked }))
              }
            />
            <span className="ml-2">In Stock Only</span>
          </label>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Sorting */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 shadow rounded">
          <h1 className="text-2xl font-semibold">{categoryName}</h1>
          <select
            className="border p-2 rounded"
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
          >
            <option value="relevance">Relevance</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={product.images?.[0] || "https://placehold.co/300x300"}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-700 truncate">{product.name}</p>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  ${product.offerPrice.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center mt-10 text-gray-500">No products found.</p>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
