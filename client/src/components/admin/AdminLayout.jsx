// PREMIUM ENHANCED ADMIN LAYOUT
// ALL PREVIOUS LOGIC PRESERVED
// FULL COPY-PASTE CODE

import React, {
  useContext,
  useState,
} from "react";

import {
  Link,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../../context/AuthContext";

import logo from "../../assets/logo/logo.png";

import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

const AdminLayout = () => {
  const { user, logout } =
    useContext(AuthContext);

  const location =
    useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // REDIRECT NON ADMIN
  if (
    !user?.role ||
    user.role !== "admin"
  ) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
        }}
      />
    );
  }

  // SIDEBAR LINKS
  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: (
        <LayoutDashboard
          size={20}
        />
      ),
      desc: "Analytics",
    },
    {
      name: "Add Product",
      path: "/admin/addproduct",
      icon: (
        <PlusCircle
          size={20}
        />
      ),
      desc: "Upload Products",
    },
    {
      name: "Product List",
      path:
        "/admin/productstatus",
      icon: (
        <Package
          size={20}
        />
      ),
      desc: "Manage Products",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen z-50 transition-all duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="w-[290px] h-full bg-white/90 backdrop-blur-2xl border-r border-gray-100 shadow-xl flex flex-col">
          {/* LOGO */}
          <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
            <Link to="/">
              <motion.img
                whileHover={{
                  scale: 1.03,
                }}
                src={logo}
                alt="AdiShop Logo"
                className="h-12 object-contain"
              />
            </Link>

            {/* MOBILE CLOSE */}
            <button
              onClick={() =>
                setSidebarOpen(
                  false
                )
              }
              className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>

          {/* ADMIN CARD */}
          <div className="mx-5 mt-6 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-5 text-white shadow-2xl relative overflow-hidden">
            {/* GLOW */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[80px]" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Admin Panel
              </h2>

              <p className="text-white/80 text-sm mt-2">
                Manage your
                ecommerce store
                professionally.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                Active Session
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 px-4 py-8 overflow-y-auto">
            <p className="px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold mb-5">
              Navigation
            </p>

            <div className="space-y-3">
              {sidebarLinks.map(
                (
                  item,
                  index
                ) => {
                  const isActive =
                    location.pathname ===
                    item.path;

                  return (
                    <Link
                      key={
                        index
                      }
                      to={
                        item.path
                      }
                      className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl"
                          : "hover:bg-white hover:shadow-md text-gray-700"
                      }`}
                    >
                      {/* ACTIVE BG */}
                      {isActive && (
                        <motion.div
                          layoutId="adminSidebar"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-4 w-full">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                            isActive
                              ? "bg-white/20"
                              : "bg-gray-100 group-hover:bg-indigo-50"
                          }`}
                        >
                          {
                            item.icon
                          }
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium">
                            {
                              item.name
                            }
                          </h3>

                          <p
                            className={`text-xs ${
                              isActive
                                ? "text-white/70"
                                : "text-gray-400"
                            }`}
                          >
                            {
                              item.desc
                            }
                          </p>
                        </div>

                        <ChevronRight
                          size={16}
                          className={`transition-transform duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:translate-x-1"
                          }`}
                        />
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="p-5 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all duration-300 font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-gray-100 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-5">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              {/* MENU */}
              <button
                onClick={() =>
                  setSidebarOpen(
                    true
                  )
                }
                className="lg:hidden w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center"
              >
                <Menu size={20} />
              </button>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  Welcome Back 👋
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage your
                  AdiShop store
                  efficiently
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              {/* SEARCH */}
              <div className="hidden md:flex relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  className="w-72 bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* NOTIFICATION */}
              <button className="relative w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
                <Bell
                  size={20}
                  className="text-gray-700"
                />

                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              </button>

              {/* ADMIN PROFILE */}
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
                  {user?.name
                    ?.charAt(
                      0
                    )
                    ?.toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <h3 className="font-medium text-gray-900">
                    {
                      user?.name
                    }
                  </h3>

                  <p className="text-xs text-gray-500">
                    Super Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {/* PAGE WRAPPER */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm min-h-[calc(100vh-180px)] p-5 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;