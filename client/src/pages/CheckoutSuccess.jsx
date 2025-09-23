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
      if (!sessionId) {
        setLoading(false);
        return;
      }
      try {
        const resp = await axios.get(`${process.env.REACT_APP_API_BASE_URL || ""}/api/orders/by-session/${sessionId}`);
        setOrder(resp.data.order);
      } catch (err) {
        console.error("Fetch order by session failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [sessionId]);

  if (loading) return <div>Loading...</div>;

  return order ? (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Successful ✅</h1>
      <p className="mb-2">Order ID: <strong>{order.orderId}</strong></p>
      <p className="mb-2">Amount: <strong>{order.amount}</strong></p>
      <p className="mb-4">Status: <strong>{order.paymentStatus}</strong></p>

      <h2 className="text-lg font-semibold mt-4">Items</h2>
      <ul className="list-disc pl-6">
        {order.products?.map((p) => (
          <li key={p.product._id || p.product}>{p.product.name || p.product} x {p.quantity}</li>
        ))}
      </ul>

      <Link to="/" className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded">
        Continue shopping
      </Link>
    </div>
  ) : (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order not found</h1>
      <p>We couldn't find order details for this payment. If your card was charged, contact support.</p>
      <Link to="/" className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded">Home</Link>
    </div>
  );
};

export default CheckoutSuccess;
