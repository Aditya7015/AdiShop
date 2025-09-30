import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/products/owner/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch products, status:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleStock = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`${BASE_URL}/products/${id}/toggle-stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to update stock");

      const data = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === data.product._id ? data.product : p))
      );
    } catch (err) {
      console.error("Error toggling stock:", err);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading products...</p>;
  if (!products.length)
    return <p className="p-6 text-center text-gray-400">No products found</p>;

  return (
    <div className="flex-1 py-10 flex flex-col gap-6 md:p-10 p-4 min-h-screen overflow-x-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-md border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-900 text-left text-sm">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Selling Price</th>
              <th className="px-4 py-3 font-semibold">In Stock</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {products.map((product) => (
              <tr key={product._id} className="border-t border-gray-200">
                <td className="px-4 py-3 flex items-center space-x-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <span className="truncate">{product.name}</span>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">
                  ${product.offerPrice || product.price}
                </td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={product.inStock}
                      onChange={() => toggleStock(product._id)}
                    />
                    <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                    <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col bg-white rounded-lg p-4 shadow border border-gray-200 hover:shadow-md transition-shadow w-full"
          >
            {/* Image */}
            <div className="flex justify-center mb-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-24 h-24 object-cover rounded border"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col items-center text-center gap-1 w-full">
              <h3 className="font-semibold text-gray-900 text-sm break-words">
                {product.name}
              </h3>
              <p className="text-gray-500 text-xs break-words">
                {product.category}
              </p>
              <p className="text-gray-800 font-semibold text-sm mt-1">
                ${product.offerPrice || product.price}
              </p>
            </div>

            {/* Stock Toggle */}
            <div className="flex justify-center mt-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={product.inStock}
                  onChange={() => toggleStock(product._id)}
                />
                <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
