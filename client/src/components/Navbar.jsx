import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/cartSlice";
import { fetchWishlist } from "../redux/wishlistSlice";
import logo from "../assets/logo/logo.png";
import { FaHome, FaUserAlt, FaShoppingCart, FaBars } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  
  // Get both cart and wishlist from Redux store
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Fetch cart and wishlist when user changes
  useEffect(() => {
    if (user?._id && user?.token) {
      console.log("Fetching cart and wishlist for user:", user._id);
      dispatch(fetchCart(user._id));
      dispatch(fetchWishlist(user.token));
    }
  }, [user, dispatch]);

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  console.log("Navbar - Wishlist count:", wishlistCount, "Items:", wishlistItems);

  // Toggle menu function
  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

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
      <div className="hidden md:flex items-center justify-between px-8 lg:px-20 py-4 border-b border-gray-300 bg-white">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logo}
            alt="Website Logo"
            className="h-10 lg:h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <Link to="/shop/mens" className="hover:text-indigo-600">Men</Link>
          <Link to="/shop/womens" className="hover:text-indigo-600">Women</Link>
          <Link to="/shop/kids" className="hover:text-indigo-600">Kids</Link>
          <Link to="/shop/beauty" className="hover:text-indigo-600">Accessories</Link>
          <Link to="/about" className="hover:text-indigo-600">About</Link>
          <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Wishlist */}
          {user && (
            <Link to="/wishlist" className="relative">
              <AiOutlineHeart size={22} className="text-gray-700 hover:text-red-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 text-xs text-white bg-red-500 w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            to={user ? "/profile" : "/login"}
            className="flex items-center gap-1 text-gray-700 hover:text-indigo-600"
          >
            <FaUserAlt size={22} />
            <span className="text-sm">{user ? "Profile" : "Login"}</span>
          </Link>

          {user && (
            <>
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
            </>
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
            onClick={toggleMenu}
            className="flex flex-col items-center text-gray-700 hover:text-indigo-600"
          >
            <FaBars size={22} />
            <span className="text-xs mt-1">Menu</span>
          </button>

          {user && (
            <Link to="/wishlist" className="relative flex flex-col items-center text-gray-700 hover:text-red-500">
              <AiOutlineHeart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 right-1 text-xs text-white bg-red-500 w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
              <span className="text-xs mt-1">Wishlist</span>
            </Link>
          )}

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-gray-700 hover:text-indigo-600"
          >
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 right-1 text-xs text-white bg-indigo-500 w-4 h-4 rounded-full flex items-center justify-center font-medium">
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
              <>
                <Link to="/wishlist" className="block text-gray-700 hover:text-red-500">
                  Wishlist ({wishlistCount})
                </Link>
                <Link to="/myorders" className="block text-gray-700 hover:text-indigo-600">
                  My Orders
                </Link>
                <Link to="/profile" className="block text-gray-700 hover:text-indigo-600">
                  Profile
                </Link>
              </>
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
                onClick={() => {
                  logout();
                  setOpenMenu(false);
                }}
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