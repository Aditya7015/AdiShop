// components/CheckoutButton.jsx
import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = () => {
  const { user } = useContext(AuthContext);
  const cart = useSelector((state) => state.cart); // update path to your store

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Prepare items: [{ productId, quantity }]
      const items = cart.items?.map((it) => ({
        productId: it.product?._id || it._id || it.productId,
        quantity: it.quantity || it.qty || 1,
      })) || [];

      // Call your backend to create a Stripe session
      const resp = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || ""}/api/stripe/create-session`,
        {
          items,
          customer: {
            id: user?.id || user?._id,
            email: user?.email,
            name: user?.name,
          },
        }
      );

      const { sessionId } = resp.data;
      if (!sessionId) throw new Error("No session id returned from server");

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe redirectToCheckout error:", error);
        alert(error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Proceed to payment
    </button>
  );
};

export default CheckoutButton;
