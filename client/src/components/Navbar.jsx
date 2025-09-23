import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo/logo.png';
import { AuthContext } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../redux/cartSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  const cartCount = Array.isArray(items) ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Website Logo" className="h-10 w-auto" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-4 md:gap-8">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Cart */}
        <Link to="/cart" className="relative cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Auth Buttons */}
        {user ? (
          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:opacity-90 transition text-sm"
              >
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/myorders"
              className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:opacity-90 transition text-sm"
            >
              My Orders
            </Link>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:opacity-90 transition text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:opacity-90 transition text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:opacity-90 transition text-sm"
            >
              Signup
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
        <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
        <Link to="/" className="block">Home</Link>
        <Link to="/products" className="block">Products</Link>
        <Link to="/about" className="block">About</Link>
        <Link to="/contact" className="block">Contact</Link>
        <Link to="/cart" className="block">Cart ({cartCount})</Link>

        {user ? (
          <div className="flex flex-col gap-2 mt-2">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="block px-6 py-2 bg-yellow-500 text-white rounded-full text-sm"
              >
                Admin Dashboard
              </Link>
            )}
            <span className="block px-6 py-2 text-gray-700 text-sm">Hello, {user.name}</span>
            <Link
              to="/myorders"
              className="block px-6 py-2 bg-indigo-500 text-white rounded-full text-sm"
            >
              My Orders
            </Link>
            <button
              onClick={logout}
              className="block px-6 py-2 bg-red-500 text-white rounded-full text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-2">
            <Link
              to="/login"
              className="block px-6 py-2 bg-indigo-500 text-white rounded-full text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="block px-6 py-2 bg-green-500 text-white rounded-full text-sm"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
