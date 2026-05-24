import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { addToCart } from "../redux/cartSlice";

import {
  removeFromWishlist,
  fetchWishlist,
} from "../redux/wishlistSlice";

import {
  AiOutlineHeart,
} from "react-icons/ai";

import {
  ShoppingBag,
  Heart,
} from "lucide-react";

import toast from "react-hot-toast";

import { motion } from "framer-motion";

const WishlistPage = () => {
  const { user } =
    useContext(AuthContext);

  const token =
    user?.token;

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const [
    addedToCartMap,
    setAddedToCartMap,
  ] = useState({});

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  // REDUX
  const {
    items: wishlist,
    loading,
  } = useSelector(
    (state) => state.wishlist
  );

  // FETCH WISHLIST
  useEffect(() => {
    if (token) {
      dispatch(
        fetchWishlist(token)
      );
    }
  }, [token, dispatch]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(
    wishlist.length /
      itemsPerPage
  );

  const indexOfLastItem =
    currentPage *
    itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem -
    itemsPerPage;

  const currentWishlist =
    wishlist.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  const paginate = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const nextPage = () => {
    if (
      currentPage < totalPages
    ) {
      setCurrentPage(
        currentPage + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(
        currentPage - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ADD TO CART
  const handleAddToCart =
    async (product) => {
      if (!user)
        return toast.error(
          "Please login first!"
        );

      try {
        await dispatch(
          addToCart({
            userId:
              user._id,
            productId:
              product._id,
            quantity: 1,
          })
        ).unwrap();

        toast.success(
          `${product.name} added to cart!`
        );

        setAddedToCartMap(
          (prev) => ({
            ...prev,
            [product._id]:
              true,
          })
        );
      } catch (err) {
        toast.error(
          "Failed to add product to cart"
        );
      }
    };

  // BUY NOW
  const handleBuyNow = () => {
    navigate("/cart");
  };

  // REMOVE
  const handleRemoveFromWishlist =
    async (
      productId,
      productName
    ) => {
      try {
        await dispatch(
          removeFromWishlist(
            {
              productId,
              token,
            }
          )
        ).unwrap();

        toast.success(
          `${productName} removed from wishlist!`
        );
      } catch (err) {
        toast.error(
          "Failed to remove from wishlist"
        );
      }
    };

  // CARD
  const WishlistProductCard =
    ({ product }) => {
      const [
        addedToCart,
        setAddedToCart,
      ] = useState(
        addedToCartMap[
          product._id
        ] || false
      );

      const image =
        product.images?.[0] ||
        "https://via.placeholder.com/300";

      const displayPrice =
        product.offerPrice ||
        product.price;

      const originalPrice =
        product.offerPrice
          ? product.price
          : null;

      const discount =
        originalPrice
          ? Math.round(
              ((originalPrice -
                displayPrice) /
                originalPrice) *
                100
            )
          : 0;

      const handleCardAddToCart =
        async (e) => {
          e.stopPropagation();

          await handleAddToCart(
            product
          );

          setAddedToCart(true);
        };

      const handleCardBuyNow =
        (e) => {
          e.stopPropagation();

          handleBuyNow();
        };

      const handleRemove = (
        e
      ) => {
        e.stopPropagation();

        handleRemoveFromWishlist(
          product._id,
          product.name
        );
      };

      return (
        <motion.div
          whileHover={{
            y: -5,
          }}
          onClick={() =>
            navigate(
              `/products/${product._id}`
            )
          }
          className="bg-white rounded-[28px] shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer group transition-all duration-500"
        >
          {/* IMAGE */}
          <div className="relative overflow-hidden">
            <img
              src={image}
              alt={product.name}
              className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* REMOVE */}
            <button
              onClick={
                handleRemove
              }
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
            >
              <AiOutlineHeart
                size={22}
                className="text-pink-500"
              />
            </button>

            {/* BADGE */}
            {discount >
              0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-5">
            <p className="text-sm uppercase tracking-wide text-gray-500 font-medium">
              {product.brand ||
                "AdiShop"}
            </p>

            <h3 className="mt-2 text-lg font-medium text-gray-900 line-clamp-1">
              {product.name}
            </h3>

            {/* PRICE */}
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-semibold text-gray-900">
                ₹
                {displayPrice}
              </span>

              {originalPrice && (
                <>
                  <span className="line-through text-gray-400 text-sm">
                    ₹
                    {
                      originalPrice
                    }
                  </span>

                  <span className="text-green-600 text-sm font-medium">
                    Save ₹
                    {originalPrice -
                      displayPrice}
                  </span>
                </>
              )}
            </div>

            {/* RATING */}
            {product.rating && (
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-lg font-medium">
                  ⭐{" "}
                  {
                    product.rating
                  }
                </span>

                <span className="text-gray-500 text-sm">
                  Popular Choice
                </span>
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={
                addedToCart
                  ? handleCardBuyNow
                  : handleCardAddToCart
              }
              className={`mt-5 w-full py-3 rounded-2xl font-medium transition-all duration-300 ${
                addedToCart
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.01]"
              }`}
            >
              {addedToCart
                ? "Proceed To Checkout"
                : "Add To Cart"}
            </button>
          </div>
        </motion.div>
      );
    };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <Heart size={26} />
            </div>

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                My Wishlist
              </h1>

              <p className="text-gray-500 mt-1">
                Your favorite items
                saved for later
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 rounded-2xl shadow-lg font-medium">
              {wishlist.length}{" "}
              Items
            </div>

            <Link
              to="/products"
              className="bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* EMPTY */}
        {wishlist.length ===
        0 ? (
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-28 h-28 mx-auto rounded-full bg-pink-50 flex items-center justify-center">
              <Heart
                size={52}
                className="text-pink-500"
              />
            </div>

            <h2 className="mt-8 text-3xl font-semibold text-gray-900">
              Your Wishlist is Empty
            </h2>

            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              Save products you
              love and revisit them
              anytime.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShoppingBag
                size={18}
              />
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentWishlist.map(
                (item) => (
                  <WishlistProductCard
                    key={item._id}
                    product={item}
                  />
                )
              )}
            </div>

            {/* PAGINATION */}
            {wishlist.length >
              itemsPerPage && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-5 mt-14">
                {/* INFO */}
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-800">
                    {indexOfFirstItem +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-800">
                    {Math.min(
                      indexOfLastItem,
                      wishlist.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-800">
                    {
                      wishlist.length
                    }
                  </span>{" "}
                  items
                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* PREV */}
                  <button
                    onClick={
                      prevPage
                    }
                    disabled={
                      currentPage ===
                      1
                    }
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      currentPage ===
                      1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:shadow-md hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  {/* PAGE NUMBERS */}
                  {[
                    ...Array(
                      totalPages
                    ),
                  ].map(
                    (
                      _,
                      index
                    ) => {
                      const page =
                        index +
                        1;

                      return (
                        <button
                          key={
                            page
                          }
                          onClick={() =>
                            paginate(
                              page
                            )
                          }
                          className={`w-11 h-11 rounded-2xl text-sm font-medium transition-all duration-300 ${
                            currentPage ===
                            page
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  {/* NEXT */}
                  <button
                    onClick={
                      nextPage
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                      currentPage ===
                      totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:shadow-md hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;