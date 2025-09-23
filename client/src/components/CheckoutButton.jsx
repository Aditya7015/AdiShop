// components/CheckoutButton.jsx
import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";

// load once with publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = () => {
  const { user } = useContext(AuthContext);
  const cart = useSelector((state) => state.cart); // adjust to your slice

  const handleCheckout = async () => {
    try {
      const items = cart.products.map((p) => ({
        productId: p._id || p.id,
        quantity: p.quantity,
      }));

      const customer = {
        id: user?.id || user?._id || user?.email || "",
        email: user?.email,
        name: user?.name,
      };

      const resp = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/stripe/create-session`,
        { items, customer }
      );

      const { sessionId } = resp.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert(error.message);
      }
    } catch (err) {
      console.error("checkout error:", err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Checkout / Pay
    </button>
  );
};

export default CheckoutButton;
