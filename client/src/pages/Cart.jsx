import React, {
  useEffect,
  useContext,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { AuthContext } from "../context/AuthContext";

import {
  fetchCart,
  removeFromCart,
} from "../redux/cartSlice";

import toast from "react-hot-toast";

import {
  FiTrash2,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiGift,
  FiArrowRight,
} from "react-icons/fi";

import { motion } from "framer-motion";

const Cart = () => {
  const { user } =
    useContext(AuthContext);

  const userId = user?._id;

  const dispatch = useDispatch();

  const {
    items,
    loading,
    error,
  } = useSelector(
    (state) => state.cart
  );

  const [coupon, setCoupon] =
    useState("");

  // FETCH CART
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [userId, dispatch]);

  // REMOVE
  const handleRemove = async (
    productId
  ) => {
    try {
      await dispatch(
        removeFromCart({
          userId,
          productId,
        })
      ).unwrap();

      toast.success(
        "Removed from cart!"
      );
    } catch (err) {
      toast.error(
        "Failed to remove item"
      );
    }
  };

  // PRICE
  const calculateSubtotal = (
    product,
    quantity
  ) =>
    (product?.offerPrice ||
      product?.price ||
      0) * quantity;

  const calculateTotalPrice =
    () =>
      items.reduce(
        (acc, item) =>
          acc +
          calculateSubtotal(
            item.productId,
            item.quantity
          ),
        0
      );

  const subtotal =
    calculateTotalPrice();

  const tax = subtotal * 0.02;

  const total = subtotal + tax;

  const API_URL =
    import.meta.env.VITE_API_URL;

  // STRIPE
  const handleBuyNow =
    async () => {
      if (items.length === 0)
        return;

      try {
        const res =
          await fetch(
            `${API_URL}/stripe/checkout`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                userId,
              }),
            }
          );

        const data =
          await res.json();

        if (data.url) {
          window.location.href =
            data.url;
        }
      } catch (err) {
        toast.error(
          "Payment failed"
        );
      }
    };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-black">
        Loading Your Cart...
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-black">
              Shopping Cart
            </h1>

            <p className="text-gray-500 mt-2">
              {items.length} Items
              Added
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-black text-white px-5 py-3 rounded-2xl shadow-xl">
            <FiShoppingBag />
            Premium Checkout
          </div>
        </div>

        {items.length === 0 ? (
          // EMPTY STATE
          <div className="bg-white rounded-[40px] shadow-2xl p-16 text-center">
            <div className="w-28 h-28 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <FiShoppingBag className="text-5xl text-gray-400" />
            </div>

            <h2 className="text-4xl font-black mt-8">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Looks like you
              haven’t added
              anything yet.
            </p>

            <button
              className="mt-8 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
              onClick={() =>
                window.history.back()
              }
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
            {/* LEFT */}
            <div className="space-y-6">
              {items.map(
                (item, index) => {
                  const product =
                    item.productId;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.1,
                      }}
                      className="bg-white rounded-[32px] p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* IMAGE */}
                        <div className="relative">
                          <img
                            src={
                              product
                                ?.images?.[0] ||
                              "https://placehold.co/300x300"
                            }
                            alt=""
                            className="w-full md:w-44 h-44 object-cover rounded-3xl"
                          />

                          <div className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                            🔥 Hot
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="uppercase tracking-[3px] text-gray-400 text-sm font-semibold">
                              {product?.brand ||
                                "AdiShop"}
                            </p>

                            <h2 className="text-2xl font-black mt-2">
                              {
                                product?.name
                              }
                            </h2>

                            <div className="flex items-center gap-3 mt-3">
                              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                ⭐ 4.8
                              </span>

                              <span className="text-gray-500">
                                In Stock
                              </span>
                            </div>

                            <div className="mt-5 flex items-center gap-4 flex-wrap">
                              <span className="text-3xl font-black">
                                ₹
                                {(
                                  product?.offerPrice ||
                                  product?.price
                                ).toFixed(
                                  2
                                )}
                              </span>

                              {product?.offerPrice && (
                                <span className="line-through text-gray-400 text-lg">
                                  ₹
                                  {
                                    product?.price
                                  }
                                </span>
                              )}
                            </div>
                          </div>

                          {/* FOOTER */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-5">
                            {/* QUANTITY */}
                            <div className="flex items-center gap-4">
                              <div className="bg-gray-100 px-5 py-3 rounded-2xl font-bold">
                                Qty:{" "}
                                {
                                  item.quantity
                                }
                              </div>

                              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-2xl text-sm font-semibold">
                                Free Delivery
                              </div>
                            </div>

                            {/* REMOVE */}
                            <button
                              onClick={() =>
                                handleRemove(
                                  product._id
                                )
                              }
                              className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-5 py-3 rounded-2xl font-bold transition-all duration-300"
                            >
                              <FiTrash2 />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>

            {/* RIGHT SUMMARY */}
            <div className="sticky top-10 h-fit">
              <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-black">
                  Order Summary
                </h2>

                {/* TRUST */}
                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <FiTruck className="mx-auto text-xl mb-2" />
                    <p className="text-xs font-bold">
                      Free Delivery
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <FiShield className="mx-auto text-xl mb-2" />
                    <p className="text-xs font-bold">
                      Secure
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <FiGift className="mx-auto text-xl mb-2" />
                    <p className="text-xs font-bold">
                      Offers
                    </p>
                  </div>
                </div>

                {/* COUPON */}
                <div className="mt-8">
                  <p className="font-bold mb-3">
                    Apply Coupon
                  </p>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter coupon"
                      value={coupon}
                      onChange={(e) =>
                        setCoupon(
                          e.target
                            .value
                        )
                      }
                      className="flex-1 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-black"
                    />

                    <button
                      className="bg-black text-white px-5 rounded-2xl font-bold"
                      onClick={() =>
                        toast.success(
                          "Coupon Applied!"
                        )
                      }
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* PRICE DETAILS */}
                <div className="mt-10 space-y-5">
                  <div className="flex justify-between text-gray-500">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      ₹
                      {subtotal.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>
                      Shipping
                    </span>

                    <span className="text-green-600 font-bold">
                      FREE
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Tax</span>

                    <span>
                      ₹
                      {tax.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-2xl font-black">
                    <span>Total</span>

                    <span>
                      ₹
                      {total.toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>

                {/* DELIVERY PROGRESS */}
                <div className="mt-10 bg-green-50 rounded-3xl p-5">
                  <p className="text-green-700 font-bold">
                    🎉 Your order is
                    eligible for FREE
                    Express Delivery
                  </p>

                  <div className="w-full bg-green-200 h-3 rounded-full mt-4 overflow-hidden">
                    <div className="w-full h-full bg-green-600 rounded-full" />
                  </div>
                </div>

                {/* CHECKOUT */}
                <button
                  onClick={
                    handleBuyNow
                  }
                  className="w-full mt-10 bg-gradient-to-r from-black via-gray-900 to-black text-white py-5 rounded-3xl font-black text-lg hover:scale-[1.02] transition-all duration-300 shadow-2xl flex items-center justify-center gap-3"
                >
                  Proceed To Checkout
                  <FiArrowRight />
                </button>

                {/* SAFE CHECKOUT */}
                <p className="text-center text-sm text-gray-400 mt-5">
                  🔒 100% Secure
                  Checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STICKY MOBILE CHECKOUT */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-200 p-4 z-50 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Total
              </p>

              <h3 className="text-2xl font-black">
                ₹
                {total.toFixed(2)}
              </h3>
            </div>

            <button
              onClick={handleBuyNow}
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;