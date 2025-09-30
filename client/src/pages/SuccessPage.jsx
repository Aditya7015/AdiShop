import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { clearCartState } from "../redux/cartSlice";
import { CheckCircle2 } from "lucide-react"; // ✅ Lucide icon (built-in with ShadCN setup)
import toast from "react-hot-toast";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");

  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const API_URL = import.meta.env.VITE_API_URL;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/orders/session/${sessionId}`);
        const data = await res.json();
        setOrder(data.order || null);
        setLoading(false);

        // 🧹 Clear server + client cart
        if (userId) {
          try {
            await fetch(`${API_URL}/cart/${userId}`, { method: "DELETE" });
          } catch (err) {
            console.warn("Could not clear server cart:", err);
          }
        }
        dispatch(clearCartState());
      } catch (err) {
        console.error("Failed to fetch order:", err);
        toast.error("Could not fetch your order details");
        setLoading(false);
      }
    })();
  }, [sessionId, userId, API_URL, dispatch]);

  if (!sessionId)
    return <p className="text-center mt-10 text-gray-600">No session found.</p>;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-gray-600">
        <p className="text-lg font-medium">Processing your order...</p>
        <p className="text-sm text-gray-500 mt-1">
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  if (!order)
    return (
      <p className="text-center mt-20 text-red-500 font-medium">
        Order not found. Please contact support.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 bg-gray-50 min-h-screen">
      {/* ✅ Success header */}
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={64} className="text-green-600 mb-4" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 text-sm">
          Thank you for your purchase! Your order has been placed successfully.
        </p>
      </div>

      {/* ✅ Order Summary Card */}
      <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-medium text-gray-800">{order.orderId || order._id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-semibold text-gray-900">
              ₹{order.amount?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* ✅ Products Section */}
        <div className="mt-5">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Your Items</h2>
          <div className="divide-y">
            {order.products?.map((p, idx) => {
              const product = p.product || {};
              const image =
                product.images?.[0] ||
                product.image ||
                "https://via.placeholder.com/100";

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={image}
                      alt={product.name || "Product"}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {p.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{product.offerPrice || product.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                      Paid
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ Footer */}
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            You’ll receive an email confirmation shortly.
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-indigo-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
