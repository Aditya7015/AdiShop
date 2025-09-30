import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          toast.error("User token not found. Please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch dashboard");

        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        toast.error(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading dashboard...</p>;
  if (!stats) return <p className="p-6 text-center text-red-500">Failed to load stats.</p>;

  const formatAmount = (amount) => Number(amount).toFixed(2);

  return (
    <div className="flex-1 py-10 flex flex-col gap-8 md:p-10 p-4">
      <h2 className="pb-4 text-xl font-semibold">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm">Total Earnings</h3>
          <p className="text-2xl font-bold">${formatAmount(stats.totalEarnings)}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm">Active Products</h3>
          <p className="text-2xl font-bold">{stats.activeProducts}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm">My Products</h3>
          <p className="text-2xl font-bold">{stats.adminProducts}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm">Customers</h3>
          <p className="text-2xl font-bold">{stats.customers}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Recent Orders</h3>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 min-w-[600px]">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-6 py-3">{order.orderId}</td>
                    <td className="px-6 py-3">{order.customer}</td>
                    <td className="px-6 py-3">${formatAmount(order.amount)}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Order ID:</span>
                  <span>{order.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Customer:</span>
                  <span>{order.customer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Amount:</span>
                  <span>${formatAmount(order.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-400">No recent orders found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
