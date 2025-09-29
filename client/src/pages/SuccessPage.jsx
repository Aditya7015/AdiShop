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

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/orders/session/${sessionId}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
          setLoading(false);
          // Clear cart after successful payment
          localStorage.removeItem("cart"); // or dispatch redux clear action
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
  }, [sessionId]);

  if (loading) return <p className="text-center mt-20">Loading order...</p>;
  if (!order) return <p className="text-center mt-20 text-red-500">Order not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-medium mb-6 text-green-600">Payment Successful!</h1>
      <p>Order ID: {order.orderId}</p>
      <p>Total Paid: ${order.amount}</p>
      <p>Status: {order.paymentStatus}</p>

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
