import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!sessionId) return;

    let retries = 0;
    const maxRetries = 10; // number of polling attempts
    const delay = 1000; // 1 second between retries

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/session/${sessionId}`);
        const data = await res.json();

        if (res.ok) {
          setOrder(data.order);
          // If still pending and retries left, poll again
          if (data.order.paymentStatus === "pending" && retries < maxRetries) {
            retries++;
            setTimeout(fetchOrder, delay);
          } else {
            setLoading(false);
            // Clear cart once payment is confirmed
            if (data.order.paymentStatus === "paid") {
              localStorage.removeItem("cart");
            }
          }
        } else {
          throw new Error(data.message || "Order not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, API_URL]);

  if (loading)
    return (
      <div className="text-center mt-20">
        <p>Loading order details...</p>
        <p className="text-sm text-gray-500 mt-2">
          Waiting for payment confirmation from Stripe.
        </p>
      </div>
    );

  if (!order)
    return (
      <p className="text-center mt-20 text-red-500">
        Order not found. Please contact support.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-medium mb-6 text-green-600">
        Payment Successful!
      </h1>
      <p>Order ID: {order.orderId}</p>
      <p>Total Paid: ${order.amount}</p>
      <p>
        Status:{" "}
        <span
          className={
            order.paymentStatus === "paid"
              ? "text-green-600 font-medium"
              : "text-yellow-600 font-medium"
          }
        >
          {order.paymentStatus}
        </span>
      </p>

      <h2 className="text-xl mt-6 font-medium">Products:</h2>
      <ul className="list-disc pl-5 mt-2">
        {order.products.map((item, index) => (
          <li key={index}>
            {item.product.name} x {item.quantity}
          </li>
        ))}
      </ul>

      <button
        className="mt-6 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        onClick={() => navigate("/")}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default Success;
