import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import { AuthContext } from "../context/AuthContext";

import { Link } from "react-router-dom";

import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { motion } from "framer-motion";

const MyOrders = () => {
  const { user } =
    useContext(AuthContext);

  const userId = user?._id;

  const API_URL =
    import.meta.env.VITE_API_URL;

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // FETCH ORDERS
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/orders/user/${userId}`
        );

        const data =
          await res.json();

        setOrders(
          data.orders || []
        );
      } catch (err) {
        console.error(
          "Failed to fetch orders:",
          err
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // LOGIN REQUIRED
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-10 text-center max-w-md w-full">
          <Package
            size={50}
            className="mx-auto text-indigo-500"
          />

          <h2 className="mt-5 text-2xl font-semibold text-gray-900">
            Login Required
          </h2>

          <p className="text-gray-500 mt-2">
            Please login to view
            your orders.
          </p>
        </div>
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-indigo-500 animate-spin" />

        <p className="mt-6 text-gray-600 text-lg">
          Loading your orders...
        </p>
      </div>
    );
  }

  // EMPTY
  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-12 text-center max-w-lg w-full">
          <div className="w-24 h-24 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
            <Package
              size={52}
              className="text-indigo-500"
            />
          </div>

          <h2 className="mt-8 text-3xl font-semibold text-gray-900">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3 leading-relaxed">
            Looks like you
            haven’t placed any
            orders yet.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-7 py-3 rounded-2xl font-medium shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
              My Orders
            </h1>

            <p className="text-gray-500 mt-2">
              Track and manage your
              recent purchases
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 w-fit">
            <Package size={18} />

            <span className="font-medium">
              {orders.length} Orders
            </span>
          </div>
        </div>

        {/* ORDERS */}
        <div className="space-y-8">
          {orders.map(
            (order, orderIndex) => (
              <motion.div
                key={order._id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    orderIndex * 0.08,
                }}
                className="bg-white rounded-[32px] border border-gray-100 shadow-lg overflow-hidden"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-6 md:px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  {/* LEFT */}
                  <div>
                    <p className="text-sm text-gray-500">
                      ORDER ID
                    </p>

                    <p className="mt-1 text-gray-900 font-medium break-all">
                      {order.orderId ||
                        order._id}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Placed on{" "}
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-start md:items-end">
                    <p className="text-2xl font-semibold text-gray-900">
                      ₹
                      {order.amount?.toFixed(
                        2
                      )}
                    </p>

                    <div
                      className={`mt-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                        order.paymentStatus ===
                        "paid"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus ===
                      "paid"
                        ? "Paid Successfully"
                        : "Pending Payment"}
                    </div>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="divide-y divide-gray-100">
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
                          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-6 md:px-8 py-6"
                        >
                          {/* PRODUCT */}
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <img
                                src={image}
                                alt=""
                                className="w-24 h-24 object-cover rounded-2xl border border-gray-200"
                              />

                              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full shadow">
                                {p.quantity}x
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {product.name ||
                                  "Product"}
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                ₹
                                {product.offerPrice ||
                                  product.price}
                              </p>

                              <div className="flex items-center gap-2 mt-3">
                                <CheckCircle2
                                  size={16}
                                  className="text-green-600"
                                />

                                <span className="text-sm text-green-600 font-medium">
                                  Delivered
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* DELIVERY */}
                          <div className="flex flex-col md:flex-row md:items-center gap-5">
                            {/* TRACK */}
                            <div className="bg-gray-50 rounded-2xl px-5 py-4 min-w-[220px]">
                              <div className="flex items-center gap-3">
                                <Truck
                                  size={18}
                                  className="text-indigo-500"
                                />

                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Delivered
                                  </p>

                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(
                                      order.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                              </div>
                            </div>

                            {/* BUTTON */}
                            <Link
                              to={`/order/${order._id}`}
                              className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-2xl font-medium transition-all duration-300"
                            >
                              <Clock3 size={16} />
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;