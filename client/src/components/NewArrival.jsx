import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load new arrivals.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading new arrivals...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const ProductCard = ({ product }) => {
    const image = product.images?.[0] || "https://via.placeholder.com/300";
    return (
      <div className="flex-shrink-0 w-56 bg-white shadow-md rounded-md overflow-hidden">
        <Link to={`/products/${product._id}`} className="block">
          <img className="w-full h-64 object-cover" src={image} alt={product.name} />
          <div className="p-3">
            <p className="text-sm text-gray-700 truncate">{product.name}</p>
            <p className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="p-8 md:p-12 lg:p-16 bg-gray-100 overflow-hidden">
      <h1 className="text-3xl font-medium text-slate-800 text-center mb-4 font-poppins">
        New Arrivals
      </h1>
      <p className="text-slate-600 mb-8 font-poppins text-center">
        Explore the latest additions to our collection.
      </p>

      {/* ✅ Auto-scrolling carousel with hover pause */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex gap-6 animate-scroll group-hover:[animation-play-state:paused]">
          {products.concat(products).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      {/* ✅ View All Products Button */}
      <div className="flex justify-center mt-8">
        <Link
          to="/products"
          className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition-all"
        >
          View All Products
        </Link>
      </div>

      {/* ✅ Animation CSS */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewArrivals;
