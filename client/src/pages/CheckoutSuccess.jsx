// pages/CheckoutSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const CheckoutSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract session_id from query string
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Optional: you can add an endpoint to fetch order by stripeSessionId
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/orders/session/${sessionId}`
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchOrder();
    else setLoading(false);
  }, [sessionId]);

  if (loading) {
    return <div className="p-6 text-center">Processing your order...</div>;
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>
      {order ? (
        <div className="bg-white shadow-md p-4 rounded mx-auto max-w-md">
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₹{order.amount}
          </p>
          <p>
            <strong>Status:</strong> {order.paymentStatus}
          </p>
        </div>
      ) : (
        <p>Your payment was successful. Your order will be processed soon.</p>
      )}

      <Link
        to="/"
        className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Back to Shop
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
