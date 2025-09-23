import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000"; // your backend URL

  // Fetch products owned by logged-in admin
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/api/products/owner/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Toggle stock status
  const toggleStock = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`${BASE_URL}/api/products/${id}/toggle-stock`, {
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

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">My Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16"
                        />
                      </div>
                      <span className="truncate max-sm:hidden w-full">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      ${product.offerPrice || product.price}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.inStock}
                          onChange={() => toggleStock(product._id)}
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
