import React, { useContext } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo/logo.png'

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Redirect non-admin users to login page
  if (!user?.role || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Add Product", path: "/admin/addproduct", icon: "➕" },
    { name: "Product List", path: "/admin/productstatus", icon: "📋" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="md:w-64 w-16 border-r border-gray-300 pt-4 flex flex-col">
        {sidebarLinks.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center py-3 px-4 gap-3 ${
              location.pathname === item.path
                ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                : "hover:bg-gray-100/90 border-white text-gray-700"
            }`}
          >
            <span>{item.icon}</span>
            <p className="md:block hidden">{item.name}</p>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
          <Link to="/">
            <img 
              className="h-9 w-auto object-contain" 
              src={logo} 
              alt="Website Logo" 
            />
          </Link>
          <div className="flex items-center gap-5 text-gray-500">
            <p>Hi! Admin</p>
            <button
              onClick={logout}
              className="border rounded-full text-sm px-4 py-1 hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto h-full">
          <Outlet /> {/* Render nested routes here */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;