import React, { useState } from "react";
import { Link } from "react-router-dom";

// Dummy user info
const dummyUser = {
  name: "Adi Tiwari",
  email: "adi.tiwari@example.com",
  phone: "+91 98765 43210",
  joinedAt: "Jan 2024",
  avatarUrl: "https://i.pravatar.cc/150?img=12", // dummy avatar
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <div className="max-w-5xl mx-auto p-6">
        {/* Profile card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
          <img
            src={dummyUser.avatarUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{dummyUser.name}</h2>
            <p className="text-gray-600 text-sm">{dummyUser.email}</p>
            <p className="text-gray-500 text-xs">
              Member since {dummyUser.joinedAt}
            </p>
          </div>
          <div className="ml-auto">
            <button className="px-4 py-2 rounded border">Edit Profile</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-4 border-b">
          {["overview", "orders", "wishlist", "addresses", "settings"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-medium text-lg mb-4">Account Overview</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Name:</strong> {dummyUser.name}
                </li>
                <li>
                  <strong>Email:</strong> {dummyUser.email}
                </li>
                <li>
                  <strong>Phone:</strong> {dummyUser.phone}
                </li>
              </ul>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-medium text-lg mb-4">My Orders</h3>
              <p className="text-sm text-gray-600">
                No orders yet. <Link to="/products" className="text-indigo-600">Shop now</Link>
              </p>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-medium text-lg mb-4">My Wishlist</h3>
              <p className="text-sm text-gray-600">
                Your wishlist is empty. <Link to="/products" className="text-indigo-600">Explore products</Link>
              </p>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-medium text-lg mb-4">Saved Addresses</h3>
              <p className="text-sm text-gray-600">
                No saved addresses. Add one at checkout.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-medium text-lg mb-4">Settings</h3>
              <div className="space-y-2">
                <button className="px-4 py-2 rounded border w-full text-left">
                  Change Password
                </button>
                <button className="px-4 py-2 rounded border w-full text-left text-red-600">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
