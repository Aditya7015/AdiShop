import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${API_URL}/orders/user/${userId}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (!userId)
    return <p className="p-6 text-center text-gray-600">Please login to see your orders.</p>;
  if (loading)
    return <p className="p-6 text-center text-gray-600">Loading your orders...</p>;
  if (!orders.length)
    return <p className="p-6 text-center text-gray-600">You have no orders yet.</p>;

  return (
    <div className="md:p-10 p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">My Orders</h2>

      <div className="space-y-8">
        {orders.map(order => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-all overflow-hidden"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-100">
              <div>
                <p className="text-sm text-gray-600">
                  ORDER ID:{" "}
                  <span className="font-medium text-gray-800">
                    {order.orderId || order._id}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  ₹{order.amount?.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-medium ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              {order.products?.map((p, idx) => {
                const product = p.product || {};
                const image =
                  product.images?.[0] ||
                  product.image ||
                  "https://via.placeholder.com/100";

                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-5 border-b last:border-0"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-5 w-full md:w-2/3">
                      <img
                        src={image}
                        alt={product.name || "Product"}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                      <div className="flex flex-col justify-center">
                        <p className="font-medium text-gray-900 text-base">
                          {product.name || "Product Name"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {p.quantity}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          ₹{product.offerPrice || product.price}
                        </p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="text-center md:text-right w-full md:w-1/3">
                      <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Delivered
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Delivered on {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                        <Link
                          to={`/order/${order._id}`}
                          className="mt-3 px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-center"
                        >
                          View Details
                        </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
