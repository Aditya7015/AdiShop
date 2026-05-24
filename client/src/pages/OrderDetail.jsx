import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
  AiOutlineArrowLeft,
} from "react-icons/ai";

import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const OrderDetail = () => {
  const { orderId } =
    useParams();

  const { user } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL;

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // FETCH ORDER
  useEffect(() => {
    if (!user?._id) return;

    const fetchOrderDetail =
      async () => {
        try {
          setLoading(true);

          const res =
            await fetch(
              `${API_URL}/orders/user/${user._id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

          if (!res.ok) {
            throw new Error(
              "Failed to fetch orders"
            );
          }

          const data =
            await res.json();

          const foundOrder =
            data.orders?.find(
              (order) =>
                order._id ===
                  orderId ||
                order.orderId ===
                  orderId
            );

          if (foundOrder) {
            setOrder(
              foundOrder
            );
          } else {
            throw new Error(
              "Order not found"
            );
          }
        } catch (err) {
          console.error(err);

          setError(
            "Failed to load order details"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchOrderDetail();
  }, [orderId, user]);

  // STATUS COLOR
  const getStatusColor = (
    status
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "delivered":
        return "bg-green-50 text-green-700";

      case "shipped":
        return "bg-blue-50 text-blue-700";

      case "processing":
        return "bg-yellow-50 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // LOGIN
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-10 text-center max-w-md w-full">
          <Package
            size={52}
            className="mx-auto text-indigo-500"
          />

          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Login Required
          </h2>

          <p className="mt-2 text-gray-500">
            Please login to view
            your order details.
          </p>

          <Link
            to="/login"
            className="inline-block mt-7 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Go to Login
          </Link>
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
          Loading order details...
        </p>
      </div>
    );
  }

  // ERROR
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-10 text-center max-w-md w-full">
          <p className="text-red-500 text-lg">
            {error ||
              "Order not found"}
          </p>

          <button
            onClick={() =>
              navigate(
                "/myorders"
              )
            }
            className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const totalItems =
    order.products?.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        {/* BACK */}
        <button
          onClick={() =>
            navigate(
              "/myorders"
            )
          }
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 mb-8"
        >
          <AiOutlineArrowLeft />
          Back to My Orders
        </button>

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <Package size={28} />
                </div>

                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                    Order Details
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Order #
                    {order.orderId ||
                      order._id}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-5">
                Placed on{" "}
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap gap-3">
              <div
                className={`px-5 py-3 rounded-2xl text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status ||
                  "Processing"}
              </div>

              <div
                className={`px-5 py-3 rounded-2xl text-sm font-medium ${
                  order.paymentStatus ===
                  "paid"
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {order.paymentStatus ===
                "paid"
                  ? "Paid"
                  : "Pending"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mt-8">
          {/* LEFT */}
          <div className="space-y-8">
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
                delay: 0.1,
              }}
              className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Ordered Items
                </h2>

                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                  {totalItems} Items
                </div>
              </div>

              <div className="space-y-6">
                {order.products?.map(
                  (
                    item,
                    index
                  ) => {
                    const product =
                      item.product ||
                      {};

                    return (
                      <div
                        key={
                          index
                        }
                        className="flex flex-col md:flex-row gap-5 p-5 rounded-3xl bg-gray-50"
                      >
                        {/* IMAGE */}
                        <img
                          src={
                            product
                              .images?.[0] ||
                            "https://via.placeholder.com/120"
                          }
                          alt=""
                          className="w-28 h-28 object-cover rounded-2xl border border-gray-200"
                        />

                        {/* INFO */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {
                              product.name
                            }
                          </h3>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                            <span>
                              Qty:{" "}
                              {
                                item.quantity
                              }
                            </span>

                            {item.color && (
                              <span>
                                Color:{" "}
                                {
                                  item.color
                                }
                              </span>
                            )}

                            {item.size && (
                              <span>
                                Size:{" "}
                                {
                                  item.size
                                }
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-xl font-semibold text-gray-900">
                              ₹
                              {(
                                (product.offerPrice ||
                                  product.price) *
                                item.quantity
                              ).toFixed(
                                2
                              )}
                            </p>

                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                              Delivered
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>

            {/* TIMELINE */}
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
              className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                Order Timeline
              </h2>

              <div className="space-y-8">
                {/* PLACED */}
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="text-green-600" />
                    </div>

                    <div className="w-[2px] flex-1 bg-gray-200 mt-2" />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      Order Confirmed
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Your payment
                      has been
                      verified
                      successfully.
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* SHIPPING */}
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Truck className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      Shipping
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Your order is
                      on the way.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* PRICE DETAILS */}
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
              className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Price Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Price (
                    {
                      totalItems
                    }{" "}
                    items)
                  </span>

                  <span>
                    ₹
                    {order.amount?.toFixed(
                      2
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Delivery
                  </span>

                  <span className="text-green-600 font-medium">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>

                  <span>
                    ₹
                    {(
                      order.amount *
                      0.18
                    ).toFixed(
                      2
                    )}
                  </span>
                </div>

                <hr className="my-5" />

                <div className="flex justify-between text-xl font-semibold text-gray-900">
                  <span>Total</span>

                  <span>
                    ₹
                    {(
                      order.amount *
                      1.18
                    ).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* PAYMENT */}
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
              className="bg-white rounded-[32px] border border-gray-100 shadow-xl p-8"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Payment Info
              </h2>

              <div className="flex items-center gap-4 bg-gray-50 rounded-3xl p-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <CreditCard className="text-indigo-600" />
                </div>

                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.paymentMethod ||
                      "Online"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Secure payment
                    completed
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 bg-green-50 rounded-2xl p-4">
                <ShieldCheck className="text-green-600" />

                <p className="text-sm text-green-700">
                  Your payment is
                  securely protected
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;