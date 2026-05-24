// import React, { useState, useContext, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchCart } from "../redux/cartSlice";
// import { fetchWishlist } from "../redux/wishlistSlice";
// import logo from "../assets/logo/logo.png";
// import { FaHome, FaUserAlt, FaShoppingCart, FaBars, FaSearch, FaTimes } from "react-icons/fa";
// import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";

// const Navbar = () => {
//   const [openMenu, setOpenMenu] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const { user, logout } = useContext(AuthContext);
//   const menuRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const navigate = useNavigate();

//   const dispatch = useDispatch();
  
//   const { items: cartItems } = useSelector((state) => state.cart);
//   const { items: wishlistItems } = useSelector((state) => state.wishlist);

//   useEffect(() => {
//     if (user?._id && user?.token) {
//       console.log("Fetching cart and wishlist for user:", user._id);
//       dispatch(fetchCart(user._id));
//       dispatch(fetchWishlist(user.token));
//     }
//   }, [user, dispatch]);

//   const cartCount = Array.isArray(cartItems)
//     ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
//     : 0;

//   const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

//   const toggleMenu = () => {
//     setOpenMenu((prev) => !prev);
//   };

//   const closeMenu = () => {
//     setOpenMenu(false);
//   };

//   // SEARCH FUNCTIONALITY - CONNECTED TO API
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       // This will trigger the API call in SearchResults page
//       navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//       setShowMobileSearch(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch(e);
//     }
//   };

//   const toggleMobileSearch = () => {
//     setShowMobileSearch(!showMobileSearch);
//     if (!showMobileSearch) {
//       setTimeout(() => {
//         searchInputRef.current?.focus();
//       }, 100);
//     }
//   };

//   // Close menus when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (openMenu && menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenMenu(false);
//       }
//       if (showMobileSearch && searchInputRef.current && !searchInputRef.current.contains(event.target)) {
//         setShowMobileSearch(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [openMenu, showMobileSearch]);

//   return (
//     <nav className="relative bg-white shadow-sm">
//       {/* Desktop Navbar */}
//       <div className="hidden md:block">
//         {/* Top Bar - Logo, Search, User Actions */}
//         <div className="flex items-center justify-between px-6 lg:px-8 py-3">
//           {/* Logo */}
//           <Link to="/" className="flex-shrink-0 mr-8">
//             <img
//               src={logo}
//               alt="Website Logo"
//               className="h-8 lg:h-10 w-auto object-contain"
//             />
//           </Link>

//           {/* Search Bar - CONNECTED TO SEARCH API */}
//           <div className="flex-1 max-w-2xl mx-8">
//             <form onSubmit={handleSearch} className="relative">
//               <input
//                 type="text"
//                 placeholder="Search for products, brands and more..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-sm"
//               />
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                 <FaSearch size={14} />
//               </div>
//               <button
//                 type="submit"
//                 className="absolute right-0 top-0 h-full px-4 bg-indigo-600 text-white rounded-r-sm hover:bg-indigo-700 transition-colors"
//               >
//                 <FaSearch size={14} />
//               </button>
//             </form>
//           </div>

//           {/* Right Side Actions */}
//           <div className="flex items-center gap-6">
//             {/* Wishlist */}
//             {user && (
//               <Link to="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-red-500 group">
//                 <div className="relative">
//                   <AiOutlineHeart size={20} />
//                   {wishlistCount > 0 && (
//                     <span className="absolute -top-2 -right-2 text-xs text-white bg-red-500 w-4 h-4 rounded-full flex items-center justify-center font-medium">
//                       {wishlistCount > 9 ? "9+" : wishlistCount}
//                     </span>
//                   )}
//                 </div>
//                 <span className="text-xs mt-1 group-hover:text-red-500">Wishlist</span>
//               </Link>
//             )}

//             {/* Cart */}
//             <Link to="/cart" className="flex flex-col items-center text-gray-700 hover:text-indigo-600 group">
//               <div className="relative">
//                 <FaShoppingCart size={20} />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-2 -right-2 text-xs text-white bg-indigo-500 w-4 h-4 rounded-full flex items-center justify-center font-medium">
//                     {cartCount > 9 ? "9+" : cartCount}
//                   </span>
//                 )}
//               </div>
//                 <span className="text-xs mt-1 group-hover:text-indigo-600">Cart</span>
//             </Link>

//             {/* Profile */}
//             <Link
//               to={user ? "/profile" : "/login"}
//               className="flex flex-col items-center text-gray-700 hover:text-indigo-600 group"
//             >
//               <FaUserAlt size={18} />
//               <span className="text-xs mt-1 group-hover:text-indigo-600">
//                 {user ? user.name?.split(' ')[0] || "Profile" : "Login"}
//               </span>
//             </Link>

//             {user && (
//               <>
//                 {user.role === "admin" && (
//                   <Link to="/admin" className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:opacity-90">
//                     Admin
//                   </Link>
//                 )}
//                 <button
//                   onClick={logout}
//                   className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Navigation Links Bar */}
//         <div className="border-t border-gray-200">
//           <div className="flex items-center justify-center gap-8 lg:gap-12 px-6 py-2">
//             <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">Home</Link>
//             <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">All Products</Link>
//             <Link to="/shop/mens" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">Men</Link>
//             <Link to="/shop/womens" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">Women</Link>
//             <Link to="/shop/kids" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">Kids</Link>
//             <Link to="/shop/beauty" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">Accessories</Link>
//             <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">About</Link>
//             <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">Contact</Link>
//             {user && (
//               <Link to="/myorders" className="text-sm font-medium text-gray-700 hover:text-indigo-600 py-2">My Orders</Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navbar */}
//       <div className="md:hidden">
//         {/* Top Bar - Logo and Search Toggle */}
//         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//           {/* Logo */}
//           <Link to="/" className="flex-shrink-0">
//             <img
//               src={logo}
//               alt="Website Logo"
//               className="h-8 w-auto object-contain"
//             />
//           </Link>

//           {/* Search Toggle Button */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={toggleMobileSearch}
//               className="p-2 text-gray-600 hover:text-indigo-600"
//             >
//               <FaSearch size={18} />
//             </button>
            
//             <button
//               onClick={toggleMenu}
//               className="p-2 text-gray-600 hover:text-indigo-600"
//             >
//               {openMenu ? <FaTimes size={18} /> : <FaBars size={18} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Search Bar - CONNECTED TO SEARCH API */}
//         {showMobileSearch && (
//           <div className="px-4 py-3 border-b border-gray-200 bg-white">
//             <form onSubmit={handleSearch} className="relative">
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search for products, brands and more..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-sm"
//               />
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                 <FaSearch size={14} />
//               </div>
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <AiOutlineClose size={16} />
//                 </button>
//               )}
//               <button
//                 type="submit"
//                 className="absolute right-0 top-0 h-full px-4 bg-indigo-600 text-white rounded-r-sm hover:bg-indigo-700 transition-colors"
//               >
//                 <FaSearch size={14} />
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Mobile Bottom Navigation */}
//         <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50">
//           <div className="flex justify-between items-center px-4 py-2">
//             <Link 
//               to="/" 
//               className="flex flex-col items-center text-gray-700 hover:text-indigo-600 flex-1"
//               onClick={() => setShowMobileSearch(false)}
//             >
//               <FaHome size={20} />
//               <span className="text-xs mt-1">Home</span>
//             </Link>

//             {user && (
//               <Link 
//                 to="/wishlist" 
//                 className="relative flex flex-col items-center text-gray-700 hover:text-red-500 flex-1"
//                 onClick={() => setShowMobileSearch(false)}
//               >
//                 <AiOutlineHeart size={20} />
//                 {wishlistCount > 0 && (
//                   <span className="absolute -top-1 right-4 text-xs text-white bg-red-500 w-4 h-4 rounded-full flex items-center justify-center font-medium">
//                     {wishlistCount}
//                   </span>
//                 )}
//                 <span className="text-xs mt-1">Wishlist</span>
//               </Link>
//             )}

//             <button
//               onClick={toggleMobileSearch}
//               className="flex flex-col items-center text-gray-700 hover:text-indigo-600 flex-1"
//             >
//               <FaSearch size={18} />
//               <span className="text-xs mt-1">Search</span>
//             </button>

//             <Link 
//               to="/cart" 
//               className="relative flex flex-col items-center text-gray-700 hover:text-indigo-600 flex-1"
//               onClick={() => setShowMobileSearch(false)}
//             >
//               <FaShoppingCart size={20} />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 right-4 text-xs text-white bg-indigo-500 w-4 h-4 rounded-full flex items-center justify-center font-medium">
//                   {cartCount}
//                 </span>
//               )}
//               <span className="text-xs mt-1">Cart</span>
//             </Link>

//             <Link
//               to={user ? "/profile" : "/login"}
//               className="flex flex-col items-center text-gray-700 hover:text-indigo-600 flex-1"
//               onClick={() => setShowMobileSearch(false)}
//             >
//               <FaUserAlt size={18} />
//               <span className="text-xs mt-1">{user ? "Profile" : "Login"}</span>
//             </Link>
//           </div>
//         </div>

//         {/* Mobile Menu Drawer */}
//         {openMenu && (
//           <div
//             ref={menuRef}
//             className="fixed inset-0 bg-white z-50 pt-16 pb-20 overflow-y-auto"
//           >
//             {/* Close Button Header */}
//             <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-60">
//               <span className="text-lg font-semibold text-gray-800">Menu</span>
//               <button
//                 onClick={closeMenu}
//                 className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <FaTimes size={20} />
//               </button>
//             </div>

//             <div className="px-4 py-6 mt-12">
//               {/* User Info */}
//               {user && (
//                 <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                   <p className="font-medium text-gray-900">Hello, {user.name}</p>
//                   <p className="text-sm text-gray-600">{user.email}</p>
//                 </div>
//               )}

//               {/* Quick Links */}
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 {user?.role === "admin" && (
//                   <Link 
//                     to="/admin" 
//                     className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center"
//                     onClick={closeMenu}
//                   >
//                     <span className="text-yellow-700 text-sm font-medium">Admin</span>
//                   </Link>
//                 )}
//                 {user && (
//                   <Link 
//                     to="/myorders" 
//                     className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center"
//                     onClick={closeMenu}
//                   >
//                     <span className="text-indigo-700 text-sm font-medium">My Orders</span>
//                   </Link>
//                 )}
//               </div>

//               {/* Navigation Links */}
//               <div className="space-y-1">
//                 <Link to="/" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>Home</Link>
//                 <Link to="/products" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>All Products</Link>
//                 <Link to="/shop/mens" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>Men</Link>
//                 <Link to="/shop/womens" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>Women</Link>
//                 <Link to="/shop/kids" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>Kids</Link>
//                 <Link to="/shop/beauty" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>Accessories</Link>
//                 <Link to="/about" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>About</Link>
//                 <Link to="/contact" className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded" onClick={closeMenu}>Contact</Link>
//               </div>

//               {/* Logout Button */}
//               {user && (
//                 <button
//                   onClick={() => {
//                     logout();
//                     closeMenu();
//                   }}
//                   className="w-full mt-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// PREMIUM ENHANCED + CORRECTED NAVBAR
// ADMIN LOGIC PRESERVED
// FULL COPY-PASTE CODE

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import { fetchCart } from "../redux/cartSlice";

import { fetchWishlist } from "../redux/wishlistSlice";

import logo from "../assets/logo/logo.png";

import {
  FaHome,
  FaUserAlt,
  FaShoppingCart,
  FaBars,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import {
  AiOutlineHeart,
  AiOutlineClose,
} from "react-icons/ai";

import { motion } from "framer-motion";

const Navbar = () => {
  const [openMenu, setOpenMenu] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    showMobileSearch,
    setShowMobileSearch,
  ] = useState(false);

  const { user, logout } =
    useContext(AuthContext);

  const menuRef =
    useRef(null);

  const searchInputRef =
    useRef(null);

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const dispatch =
    useDispatch();

  const {
    items: cartItems,
  } = useSelector(
    (state) => state.cart
  );

  const {
    items: wishlistItems,
  } = useSelector(
    (state) => state.wishlist
  );

  // FETCH DATA
  useEffect(() => {
    if (
      user?._id &&
      user?.token
    ) {
      dispatch(
        fetchCart(user._id)
      );

      dispatch(
        fetchWishlist(
          user.token
        )
      );
    }
  }, [user, dispatch]);

  // COUNTS
  const cartCount =
    Array.isArray(cartItems)
      ? cartItems.reduce(
          (acc, item) =>
            acc +
            item.quantity,
          0
        )
      : 0;

  const wishlistCount =
    Array.isArray(
      wishlistItems
    )
      ? wishlistItems.length
      : 0;

  // SEARCH
  const handleSearch = (
    e
  ) => {
    e.preventDefault();

    if (
      searchQuery.trim()
    ) {
      navigate(
        `/search?q=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );

      setSearchQuery("");

      setShowMobileSearch(
        false
      );
    }
  };

  const handleKeyPress = (
    e
  ) => {
    if (
      e.key === "Enter"
    ) {
      handleSearch(e);
    }
  };

  // MENU
  const toggleMenu =
    () => {
      setOpenMenu(
        !openMenu
      );
    };

  const closeMenu =
    () => {
      setOpenMenu(
        false
      );
    };

  // MOBILE SEARCH
  const toggleMobileSearch =
    () => {
      setShowMobileSearch(
        !showMobileSearch
      );

      if (
        !showMobileSearch
      ) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    };

  // OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          openMenu &&
          menuRef.current &&
          !menuRef.current.contains(
            event.target
          )
        ) {
          setOpenMenu(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [openMenu]);

  // NAV LINKS
  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Products",
      path: "/products",
    },
    {
      name: "Men",
      path: "/shop/mens",
    },
    {
      name: "Women",
      path: "/shop/womens",
    },
    {
      name: "Kids",
      path: "/shop/kids",
    },
    {
      name: "Accessories",
      path: "/shop/beauty",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
        {/* DESKTOP */}
        <div className="hidden md:block">
          {/* TOP */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center shrink-0"
            >
              <motion.img
                whileHover={{
                  scale: 1.03,
                }}
                transition={{
                  duration: 0.3,
                }}
                src={logo}
                alt="AdiShop Logo"
                className="h-12 lg:h-14 w-auto object-contain drop-shadow-sm"
              />
            </Link>

            {/* SEARCH */}
            <div className="flex-1 max-w-2xl">
              <form
                onSubmit={
                  handleSearch
                }
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search products, brands and more..."
                  value={
                    searchQuery
                  }
                  onChange={(
                    e
                  ) =>
                    setSearchQuery(
                      e.target
                        .value
                    )
                  }
                  onKeyPress={
                    handleKeyPress
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-16 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                />

                <FaSearch
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                />

                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2.5 rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <FaSearch
                    size={13}
                  />
                </button>
              </form>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-5">
              {/* WISHLIST */}
              {user && (
                <Link
                  to="/wishlist"
                  className="relative flex flex-col items-center text-gray-700 hover:text-pink-500 transition-all duration-300"
                >
                  <div className="relative">
                    <AiOutlineHeart
                      size={24}
                    />

                    {wishlistCount >
                      0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-medium shadow">
                        {wishlistCount >
                        9
                          ? "9+"
                          : wishlistCount}
                      </span>
                    )}
                  </div>

                  <span className="text-xs mt-1 font-medium">
                    Wishlist
                  </span>
                </Link>
              )}

              {/* CART */}
              <Link
                to="/cart"
                className="relative flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
              >
                <div className="relative">
                  <FaShoppingCart
                    size={22}
                  />

                  {cartCount >
                    0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] flex items-center justify-center font-medium shadow">
                      {cartCount >
                      9
                        ? "9+"
                        : cartCount}
                    </span>
                  )}
                </div>

                <span className="text-xs mt-1 font-medium">
                  Cart
                </span>
              </Link>

              {/* PROFILE */}
              <Link
                to={
                  user
                    ? "/profile"
                    : "/login"
                }
                className="flex flex-col items-center text-gray-700 hover:text-indigo-600 transition-all duration-300"
              >
                <FaUserAlt
                  size={20}
                />

                <span className="text-xs mt-1 font-medium">
                  {user
                    ? user.name?.split(
                        " "
                      )[0]
                    : "Login"}
                </span>
              </Link>

              {/* ADMIN */}
              {user?.role ===
                "admin" && (
                <Link
                  to="/admin"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Admin Panel
                </Link>
              )}

              {/* LOGOUT */}
              {user && (
                <button
                  onClick={
                    logout
                  }
                  className="px-5 py-2.5 rounded-2xl bg-gray-100 hover:bg-red-500 hover:text-white text-gray-700 text-sm font-medium transition-all duration-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* NAV LINKS */}
          <div className="border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center gap-10 flex-wrap">
              {navLinks.map(
                (link) => {
                  const isActive =
                    location.pathname ===
                    link.path;

                  return (
                    <Link
                      key={
                        link.name
                      }
                      to={
                        link.path
                      }
                      className={`relative text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "text-indigo-600"
                          : "text-gray-700 hover:text-indigo-600"
                      }`}
                    >
                      {
                        link.name
                      }

                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-3 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      )}
                    </Link>
                  );
                }
              )}

              {user && (
                <Link
                  to="/myorders"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-all duration-300"
                >
                  My Orders
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          {/* TOP */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center"
            >
              <motion.img
                whileHover={{
                  scale: 1.03,
                }}
                src={logo}
                alt="AdiShop Logo"
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            </Link>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={
                  toggleMobileSearch
                }
                className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700"
              >
                <FaSearch
                  size={16}
                />
              </button>

              <button
                onClick={
                  toggleMenu
                }
                className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg"
              >
                {openMenu ? (
                  <FaTimes
                    size={18}
                  />
                ) : (
                  <FaBars
                    size={18}
                  />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          {showMobileSearch && (
            <div className="px-4 pb-4 pt-2">
              <form
                onSubmit={
                  handleSearch
                }
                className="relative"
              >
                <input
                  ref={
                    searchInputRef
                  }
                  type="text"
                  placeholder="Search products..."
                  value={
                    searchQuery
                  }
                  onChange={(
                    e
                  ) =>
                    setSearchQuery(
                      e.target
                        .value
                    )
                  }
                  onKeyPress={
                    handleKeyPress
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <FaSearch
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery(
                        ""
                      )
                    }
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <AiOutlineClose
                      size={18}
                    />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2.5 rounded-xl"
                >
                  <FaSearch
                    size={12}
                  />
                </button>
              </form>
            </div>
          )}

          {/* MOBILE BOTTOM NAV */}
          <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-200 z-50">
            <div
              className={`grid ${
                user?.role ===
                "admin"
                  ? "grid-cols-6"
                  : "grid-cols-5"
              } py-2`}
            >
              <Link
                to="/"
                className="flex flex-col items-center text-gray-700"
              >
                <FaHome
                  size={20}
                />

                <span className="text-[11px] mt-1">
                  Home
                </span>
              </Link>

              {user && (
                <Link
                  to="/wishlist"
                  className="relative flex flex-col items-center text-gray-700"
                >
                  <AiOutlineHeart
                    size={21}
                  />

                  {wishlistCount >
                    0 && (
                    <span className="absolute top-0 right-6 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] flex items-center justify-center">
                      {
                        wishlistCount
                      }
                    </span>
                  )}

                  <span className="text-[11px] mt-1">
                    Wishlist
                  </span>
                </Link>
              )}

              <button
                onClick={
                  toggleMobileSearch
                }
                className="flex flex-col items-center text-gray-700"
              >
                <FaSearch
                  size={18}
                />

                <span className="text-[11px] mt-1">
                  Search
                </span>
              </button>

              <Link
                to="/cart"
                className="relative flex flex-col items-center text-gray-700"
              >
                <FaShoppingCart
                  size={20}
                />

                {cartCount >
                  0 && (
                  <span className="absolute top-0 right-6 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[9px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}

                <span className="text-[11px] mt-1">
                  Cart
                </span>
              </Link>

              {/* ADMIN */}
              {user?.role ===
                "admin" && (
                <Link
                  to="/admin"
                  className="flex flex-col items-center text-amber-500"
                >
                  <FaBars
                    size={18}
                  />

                  <span className="text-[11px] mt-1">
                    Admin
                  </span>
                </Link>
              )}

              <Link
                to={
                  user
                    ? "/profile"
                    : "/login"
                }
                className="flex flex-col items-center text-gray-700"
              >
                <FaUserAlt
                  size={18}
                />

                <span className="text-[11px] mt-1">
                  {user
                    ? "Profile"
                    : "Login"}
                </span>
              </Link>
            </div>
          </div>

          {/* MOBILE MENU */}
          {openMenu && (
            <div
              ref={menuRef}
              className="fixed inset-0 bg-white z-[100] overflow-y-auto"
            >
              {/* HEADER */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Menu
                  </h2>

                  <p className="text-sm text-gray-500">
                    Explore AdiShop
                  </p>
                </div>

                <button
                  onClick={
                    closeMenu
                  }
                  className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center"
                >
                  <FaTimes
                    size={18}
                  />
                </button>
              </div>

              {/* USER */}
              {user && (
                <div className="m-5 p-5 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl">
                  <h3 className="text-lg font-semibold">
                    Hello,{" "}
                    {
                      user.name
                    }
                  </h3>

                  <p className="text-sm opacity-80 mt-1">
                    {
                      user.email
                    }
                  </p>
                </div>
              )}

              {/* QUICK LINKS */}
              <div className="px-5 mb-6 grid grid-cols-2 gap-4">
                {user?.role ===
                  "admin" && (
                  <Link
                    to="/admin"
                    onClick={
                      closeMenu
                    }
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl p-4 text-center font-medium shadow-lg"
                  >
                    Admin
                  </Link>
                )}

                {user && (
                  <Link
                    to="/myorders"
                    onClick={
                      closeMenu
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 text-center font-medium shadow-lg"
                  >
                    My Orders
                  </Link>
                )}
              </div>

              {/* LINKS */}
              <div className="px-5 space-y-2">
                {navLinks.map(
                  (link) => (
                    <Link
                      key={
                        link.name
                      }
                      to={
                        link.path
                      }
                      onClick={
                        closeMenu
                      }
                      className="block py-4 px-5 rounded-2xl bg-gray-50 hover:bg-indigo-50 text-gray-800 font-medium transition-all duration-300"
                    >
                      {
                        link.name
                      }
                    </Link>
                  )
                )}
              </div>

              {/* LOGOUT */}
              {user && (
                <div className="p-5">
                  <button
                    onClick={() => {
                      logout();

                      closeMenu();
                    }}
                    className="w-full py-4 rounded-2xl bg-red-500 text-white font-medium shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* MOBILE SPACE */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default Navbar;