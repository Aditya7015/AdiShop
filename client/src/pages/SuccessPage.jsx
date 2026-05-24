import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { useDispatch } from "react-redux";

import { clearCartState } from "../redux/cartSlice";

import {
  CheckCircle2,
  PackageCheck,
  Truck,
  ShieldCheck,
} from "lucide-react";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

const Success = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const query =
    new URLSearchParams(
      location.search
    );

  const sessionId =
    query.get("session_id");

  const { user } =
    useContext(AuthContext);

  const userId = user?._id;

  const API_URL =
    import.meta.env.VITE_API_URL;

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const dispatch = useDispatch();

  // FETCH ORDER
  useEffect(() => {
    if (!sessionId) return;

    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/orders/session/${sessionId}`
        );

        const data =
          await res.json();

        setOrder(
          data.order || null
        );

        setLoading(false);

        // CLEAR CART
        if (userId) {
          try {
            await fetch(
              `${API_URL}/cart/${userId}`,
              {
                method: "DELETE",
              }
            );
          } catch (err) {
            console.warn(
              "Could not clear cart:",
              err
            );
          }
        }

        dispatch(
          clearCartState()
        );
      } catch (err) {
        console.error(err);

        toast.error(
          "Could not fetch order"
        );

        setLoading(false);
      }
    })();
  }, [
    sessionId,
    userId,
    API_URL,
    dispatch,
  ]);

  // NO SESSION
  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">
          No session found.
        </p>
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white px-6">
        <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-black animate-spin" />

        <h2 className="mt-8 text-2xl font-semibold text-gray-800">
          Processing your order
        </h2>

        <p className="text-gray-500 mt-2 text-center max-w-md">
          Please wait while we
          confirm your payment
          and prepare your order.
        </p>
      </div>
    );
  }

  // NO ORDER
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">
          Order not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-14">
        {/* SUCCESS HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-10 text-center"
        >
          {/* ICON */}
          <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2
              size={54}
              className="text-green-600"
            />
          </div>

          {/* TITLE */}
          <h1 className="mt-6 text-4xl font-semibold text-gray-900 tracking-tight">
            Payment Successful
          </h1>

          <p className="mt-3 text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            Thank you for your
            purchase. Your order
            has been placed
            successfully and is
            now being processed.
          </p>

          {/* ORDER INFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <p className="mt-1 text-gray-900 font-medium break-all">
                {order.orderId ||
                  order._id}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">
                Payment Status
              </p>

              <p className="mt-1 text-green-600 font-medium">
                Paid Successfully
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">
                Total Amount
              </p>

              <p className="mt-1 text-gray-900 text-xl font-semibold">
                ₹
                {order.amount?.toFixed(
                  2
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* DELIVERY TIMELINE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mt-8 bg-white rounded-[32px] shadow-xl border border-gray-100 p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            Order Progress
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="text-green-600" />
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  Order Confirmed
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Your payment was
                  verified
                  successfully.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <PackageCheck className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  Preparing Order
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  We’re packing your
                  items carefully.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Truck className="text-orange-500" />
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  Shipping Soon
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Expected delivery
                  within 3–5 days.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PRODUCTS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mt-8 bg-white rounded-[32px] shadow-xl border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Ordered Items
            </h2>

            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              {order.products?.length}{" "}
              Items
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {order.products?.map(
              (p, idx) => {
                const product =
                  p.product || {};

                const image =
                  product.images?.[0] ||
                  product.image ||
                  "https://via.placeholder.com/120";

                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 bg-gray-50 rounded-3xl p-5"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-5">
                      <img
                        src={image}
                        alt=""
                        className="w-24 h-24 object-cover rounded-2xl border border-gray-200"
                      />

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {product.name ||
                            "Product"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Quantity:{" "}
                          {
                            p.quantity
                          }
                        </p>

                        <p className="text-gray-700 mt-2">
                          ₹
                          {product.offerPrice ||
                            product.price}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                        Paid
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </motion.div>

        {/* TRUST SECTION */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-6 text-center">
            <ShieldCheck className="mx-auto text-green-600" />

            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Secure Payment
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Your payment was
              processed securely.
            </p>
          </div>

          <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-6 text-center">
            <Truck className="mx-auto text-orange-500" />

            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Fast Delivery
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Estimated delivery
              within 3–5 business
              days.
            </p>
          </div>

          <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-6 text-center">
            <PackageCheck className="mx-auto text-blue-600" />

            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Easy Returns
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Hassle-free returns
              available on eligible
              items.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <button
            onClick={() =>
              navigate("/")
            }
            className="bg-black text-white px-8 py-4 rounded-2xl font-medium hover:scale-[1.02] transition-all duration-300 shadow-xl"
          >
            Continue Shopping
          </button>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="bg-white border border-gray-200 text-gray-800 px-8 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-all duration-300"
          >
            View Orders
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;