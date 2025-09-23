import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchDashboard();
  }, []);

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="flex-1 py-10 flex flex-col gap-8 md:p-10 p-4">
      <h2 className="pb-4 text-xl font-semibold">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500 text-sm">Total Earnings</h3>
          <p className="text-2xl font-bold">${stats.totalEarnings}</p>
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

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <h3 className="px-6 py-4 text-lg font-semibold border-b">Recent Orders</h3>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-6 py-3">{order.orderId}</td>
                <td className="px-6 py-3">{order.customer}</td>
                <td className="px-6 py-3">${order.amount}</td>
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
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
