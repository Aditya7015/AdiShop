import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/cartSlice";
import logo from "../assets/logo/logo.png";
import { FaHome, FaUserAlt, FaShoppingCart, FaBars } from "react-icons/fa";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?._id) dispatch(fetchCart(user._id));
  }, [user, dispatch]);

  const cartCount = Array.isArray(items)
    ? items.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  return (
    <nav className="relative">
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white">
        <Link to="/">
          <img src={logo} alt="Website Logo" className="h-10 w-auto" />
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <Link to="/shop/mens" className="hover:text-indigo-600">Men</Link>
          <Link to="/shop/womens" className="hover:text-indigo-600">Women</Link>
          <Link to="/shop/kids" className="hover:text-indigo-600">Kids</Link>
          <Link to="/shop/beauty" className="hover:text-indigo-600">Accessories</Link>
          <Link to="/about" className="hover:text-indigo-600">About</Link>
          <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link to="/admin" className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm hover:opacity-90">
                  Admin
                </Link>
              )}
              <Link to="/myorders" className="px-4 py-2 bg-indigo-500 text-white rounded-full text-sm hover:opacity-90">
                My Orders
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:opacity-90"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 bg-indigo-500 text-white rounded-full text-sm hover:opacity-90">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:opacity-90">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50">
        <div className="flex justify-between items-center px-4 py-2">
          <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-indigo-600">
            <FaHome size={22} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600"
          >
            <FaBars size={22} />
            <span className="text-xs mt-1">Menu</span>
          </button>

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-gray-700 hover:text-indigo-600"
          >
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 text-xs text-white bg-indigo-500 w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>

          <Link
            to={user ? "/profile" : "/login"}
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600"
          >
            <FaUserAlt size={22} />
            <span className="text-xs mt-1">{user ? "Profile" : "Login"}</span>
          </Link>
        </div>

        {/* Mobile Menu Drawer */}
        {openMenu && (
          <div
            ref={menuRef}
            className="absolute bottom-12 left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col py-4 px-4 space-y-2"
          >
            {user?.role === "admin" && (
              <Link to="/admin" className="block text-yellow-500 hover:text-yellow-600">
                Admin Dashboard
              </Link>
            )}

            {user && (
              <Link to="/myorders" className="block text-gray-700 hover:text-indigo-600">
                My Orders
              </Link>
            )}

            <Link to="/products" className="block text-gray-700 hover:text-indigo-600">Products</Link>
            <Link to="/shop/mens" className="block text-gray-700 hover:text-indigo-600">Men</Link>
            <Link to="/shop/womens" className="block text-gray-700 hover:text-indigo-600">Women</Link>
            <Link to="/shop/kids" className="block text-gray-700 hover:text-indigo-600">Kids</Link>
            <Link to="/shop/beauty" className="block text-gray-700 hover:text-indigo-600">Accessories</Link>
            <Link to="/about" className="block text-gray-700 hover:text-indigo-600">About</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-indigo-600">Contact</Link>

            {user && (
              <button
                onClick={logout}
                className="w-full text-left text-red-500 hover:text-red-600 mt-2"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
