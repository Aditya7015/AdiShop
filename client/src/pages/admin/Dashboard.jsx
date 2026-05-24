import React, {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  ShoppingCart,
  IndianRupee,
  Package,
  Users,
  TrendingUp,
  Sparkles,
  Clock3,
} from "lucide-react";

import { motion } from "framer-motion";

// BASE URL
const BASE_URL =
  import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] =
    useState(null);

  const [
    recentOrders,
    setRecentOrders,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH DASHBOARD
  useEffect(() => {
    const fetchDashboard =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "userToken"
            );

          if (!token) {
            toast.error(
              "User token not found"
            );

            setLoading(false);

            return;
          }

          const res =
            await fetch(
              `${BASE_URL}/dashboard`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          const data =
            await res.json();

          if (!res.ok)
            throw new Error(
              data.message ||
                "Failed to fetch dashboard"
            );

          setStats(data.stats);

          setRecentOrders(
            data.recentOrders
          );
        } catch (err) {
          console.error(err);

          toast.error(
            err.message ||
              "Failed to load dashboard"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchDashboard();
  }, []);

  // FORMAT AMOUNT
  const formatAmount = (
    amount
  ) =>
    Number(amount).toFixed(2);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  // ERROR
  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
        Failed to load stats.
      </div>
    );
  }

  // STATS DATA
  const statCards = [
    {
      title: "Total Orders",
      value:
        stats.totalOrders,
      icon: (
        <ShoppingCart
          size={24}
        />
      ),
      color:
        "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
    },
    {
      title:
        "Total Earnings",
      value: `₹${formatAmount(
        stats.totalEarnings
      )}`,
      icon: (
        <IndianRupee
          size={24}
        />
      ),
      color:
        "from-green-500 to-emerald-500",
      bg: "bg-green-50",
    },
    {
      title:
        "Active Products",
      value:
        stats.activeProducts,
      icon: (
        <Package
          size={24}
        />
      ),
      color:
        "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
    },
    {
      title: "My Products",
      value:
        stats.adminProducts,
      icon: (
        <Sparkles
          size={24}
        />
      ),
      color:
        "from-orange-500 to-red-500",
      bg: "bg-orange-50",
    },
    {
      title: "Customers",
      value:
        stats.customers,
      icon: (
        <Users size={24} />
      ),
      color:
        "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* HERO */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 shadow-2xl mb-10"
      >
        {/* GLOW */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-white text-sm mb-5">
              <TrendingUp size={16} />

              Store Analytics
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Admin Dashboard
            </h1>

            <p className="text-white/80 mt-4 max-w-2xl text-lg leading-relaxed">
              Monitor your
              AdiShop store
              performance,
              products, revenue and
              customer activity.
            </p>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 text-white min-w-[160px]">
              <p className="text-white/70 text-sm">
                Total Revenue
              </p>

              <h2 className="text-3xl font-semibold mt-3">
                ₹
                {formatAmount(
                  stats.totalEarnings
                )}
              </h2>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 text-white min-w-[160px]">
              <p className="text-white/70 text-sm">
                Active Orders
              </p>

              <h2 className="text-3xl font-semibold mt-3">
                {
                  stats.totalOrders
                }
              </h2>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
        {statCards.map(
          (
            item,
            index
          ) => (
            <motion.div
              key={index}
              whileHover={{
                y: -4,
              }}
              className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 relative overflow-hidden"
            >
              {/* GLOW */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-indigo-100 to-purple-100 blur-[70px]" />

              <div className="relative z-10">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center shadow-lg`}
                >
                  {item.icon}
                </div>

                <p className="text-gray-500 text-sm mt-6">
                  {item.title}
                </p>

                <h2 className="text-4xl font-semibold text-gray-900 mt-3 tracking-tight">
                  {item.value}
                </h2>
              </div>
            </motion.div>
          )
        )}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-[36px] border border-gray-100 shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Recent Orders
            </h2>

            <p className="text-gray-500 mt-2">
              Latest customer orders
              and transactions
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
            <Clock3 size={16} />

            Live Updates
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            {/* HEAD */}
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-800">
                  Order ID
                </th>

                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-800">
                  Customer
                </th>

                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-800">
                  Amount
                </th>

                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-800">
                  Status
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {recentOrders.length >
              0 ? (
                recentOrders.map(
                  (
                    order
                  ) => (
                    <tr
                      key={
                        order._id
                      }
                      className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-300"
                    >
                      {/* ORDER ID */}
                      <td className="px-8 py-6">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {
                              order.orderId
                            }
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Order
                            Transaction
                          </p>
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold shadow-lg">
                            {order.customer
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-900">
                              {
                                order.customer
                              }
                            </h3>

                            <p className="text-sm text-gray-500">
                              Customer
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-8 py-6">
                        <div className="text-2xl font-semibold text-indigo-600">
                          ₹
                          {formatAmount(
                            order.amount
                          )}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium ${
                            order.status ===
                            "Delivered"
                              ? "bg-green-50 text-green-700"
                              : order.status ===
                                "Pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              order.status ===
                              "Delivered"
                                ? "bg-green-500"
                                : order.status ===
                                  "Pending"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }`}
                          />

                          {
                            order.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-gray-400"
                  >
                    No recent orders
                    found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="lg:hidden p-5 space-y-5">
          {recentOrders.length >
          0 ? (
            recentOrders.map(
              (
                order
              ) => (
                <motion.div
                  whileHover={{
                    y: -3,
                  }}
                  key={
                    order._id
                  }
                  className="bg-[#f8f9fc] rounded-[28px] border border-gray-100 p-5"
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <h3 className="font-semibold text-gray-900 mt-1">
                        {
                          order.orderId
                        }
                      </h3>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-medium ${
                        order.status ===
                        "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status ===
                            "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {
                        order.status
                      }
                    </span>
                  </div>

                  {/* CUSTOMER */}
                  <div className="mt-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-semibold">
                      {order.customer
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Customer
                      </p>

                      <h3 className="font-medium text-gray-900">
                        {
                          order.customer
                        }
                      </h3>
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div className="mt-6">
                    <p className="text-sm text-gray-500">
                      Order Amount
                    </p>

                    <h2 className="text-3xl font-semibold text-indigo-600 mt-2">
                      ₹
                      {formatAmount(
                        order.amount
                      )}
                    </h2>
                  </div>
                </motion.div>
              )
            )
          ) : (
            <div className="py-16 text-center text-gray-400">
              No recent orders
              found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;