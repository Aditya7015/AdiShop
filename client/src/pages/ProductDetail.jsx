import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { addToCart } from "../redux/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../redux/wishlistSlice";

import { AuthContext } from "../context/AuthContext";

import { toast } from "react-hot-toast";

import {
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import {
  FiTruck,
  FiShield,
  FiRefreshCcw,
  FiStar,
  FiShoppingBag,
} from "react-icons/fi";

import { motion } from "framer-motion";

const BASE_URL =
  import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } =
    useContext(AuthContext);

  const [product, setProduct] =
    useState(null);

  const [thumbnail, setThumbnail] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedSize, setSelectedSize] =
    useState("");

  const [recommended, setRecommended] =
    useState([]);

  const [zoom, setZoom] =
    useState(false);

  const {
    items: wishlistItems,
  } = useSelector(
    (state) => state.wishlist
  );

  const isInWishlist =
    wishlistItems.some(
      (item) => item._id === id
    );

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res =
          await axios.get(
            `${BASE_URL}/products/${id}`
          );

        setProduct(res.data);

        setThumbnail(
          res.data.images?.[0] || ""
        );

        setSelectedColor(
          res.data.colors?.[0] || ""
        );

        setSelectedSize(
          res.data.sizes?.[0] || ""
        );
      } catch (err) {
        toast.error(
          "Failed to load product"
        );
      }
    };

    fetchProduct();
  }, [id]);

  // FETCH RECOMMENDED
  useEffect(() => {
    const fetchRecommended =
      async () => {
        try {
          const res =
            await axios.get(
              `${BASE_URL}/products`
            );

          const others =
            res.data.filter(
              (p) => p._id !== id
            );

          for (
            let i =
              others.length - 1;
            i > 0;
            i--
          ) {
            const j = Math.floor(
              Math.random() *
                (i + 1)
            );

            [
              others[i],
              others[j],
            ] = [
              others[j],
              others[i],
            ];
          }

          setRecommended(
            others.slice(0, 4)
          );
        } catch (err) {
          console.log(err);
        }
      };

    fetchRecommended();
  }, [id]);

  // FETCH WISHLIST
  useEffect(() => {
    if (user?.token) {
      dispatch(
        fetchWishlist(user.token)
      );
    }
  }, [user, dispatch]);

  // CART
  const handleAddToCart = () => {
    if (!user?._id) {
      toast.error(
        "Please login first"
      );

      return;
    }

    dispatch(
      addToCart({
        userId: user._id,
        productId: product._id,
        quantity: 1,
        color: selectedColor,
        size: selectedSize,
      })
    );

    toast.success(
      "Added to cart!"
    );
  };

  // BUY
  const handleBuyNow = () => {
    handleAddToCart();

    navigate("/cart");
  };

  // WISHLIST
  const handleWishlistToggle =
    async () => {
      if (!user) {
        toast.error(
          "Please login first"
        );

        return;
      }

      try {
        if (!isInWishlist) {
          await dispatch(
            addToWishlist({
              productId:
                product._id,
              token:
                user.token,
            })
          ).unwrap();

          toast.success(
            "Added to wishlist!"
          );
        } else {
          await dispatch(
            removeFromWishlist({
              productId:
                product._id,
              token:
                user.token,
            })
          ).unwrap();

          toast.success(
            "Removed from wishlist!"
          );
        }
      } catch (err) {
        toast.error(
          "Wishlist update failed"
        );
      }
    };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl font-bold">
        Loading Product...
      </div>
    );
  }

  const discount =
    product.offerPrice
      ? Math.round(
          ((product.price -
            product.offerPrice) /
            product.price) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="flex gap-5"
          >
            {/* THUMBNAILS */}
            <div className="flex flex-col gap-4">
              {product.images?.map(
                (img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    onClick={() =>
                      setThumbnail(
                        img
                      )
                    }
                    className={`w-24 h-24 object-cover rounded-2xl cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                      thumbnail ===
                      img
                        ? "border-black shadow-xl"
                        : "border-gray-200"
                    }`}
                  />
                )
              )}
            </div>

            {/* MAIN IMAGE */}
            <div
              className="flex-1 bg-white rounded-[32px] overflow-hidden relative shadow-2xl"
              onMouseEnter={() =>
                setZoom(true)
              }
              onMouseLeave={() =>
                setZoom(false)
              }
            >
              {/* DISCOUNT */}
              {discount > 0 && (
                <div className="absolute top-5 left-5 z-20 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse shadow-xl">
                  {discount}% OFF
                </div>
              )}

              {/* WISHLIST */}
              <button
                onClick={
                  handleWishlistToggle
                }
                className="absolute top-5 right-5 z-20 bg-white/80 backdrop-blur-xl p-3 rounded-full shadow-xl hover:scale-110 transition"
              >
                {isInWishlist ? (
                  <AiFillHeart
                    size={24}
                    className="text-pink-500"
                  />
                ) : (
                  <AiOutlineHeart
                    size={24}
                    className="text-black"
                  />
                )}
              </button>

              <img
                src={thumbnail}
                alt=""
                className={`w-full h-[650px] object-cover transition-all duration-700 ${
                  zoom
                    ? "scale-110"
                    : "scale-100"
                }`}
              />

              {/* HOT LABEL */}
              <div className="absolute bottom-5 left-5 bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
                🔥 Best Seller
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            {/* BRAND */}
            <p className="uppercase tracking-[4px] text-gray-500 font-semibold">
              {product.brand ||
                "AdiShop"}
            </p>

            {/* NAME */}
            <h1 className="text-5xl font-black mt-3 leading-tight">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="flex items-center gap-3 mt-5">
              <div className="bg-green-600 text-white px-3 py-1 rounded-xl font-bold flex items-center gap-1">
                <FiStar />
                {product.rating ||
                  4.8}
              </div>

              <p className="text-gray-500">
                2.4k Reviews
              </p>

              <p className="text-green-600 font-semibold">
                In Stock
              </p>
            </div>

            {/* PRICE */}
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <span className="text-5xl font-black">
                ₹
                {product.offerPrice ||
                  product.price}
              </span>

              {product.offerPrice && (
                <>
                  <span className="line-through text-2xl text-gray-400">
                    ₹
                    {product.price}
                  </span>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                    Save ₹
                    {product.price -
                      product.offerPrice}
                  </span>
                </>
              )}
            </div>

            {/* URGENCY */}
            <div className="mt-5 bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-red-600 font-bold">
                ⚡ Hurry! Only 3 left
                in stock
              </p>

              <p className="text-sm text-gray-500 mt-1">
                124 people viewed
                this today
              </p>
            </div>

            {/* COLORS */}
            {product.colors?.length >
              0 && (
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">
                  Select Color
                </h3>

                <div className="flex gap-4">
                  {product.colors.map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        style={{
                          backgroundColor:
                            color,
                        }}
                        className={`w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 ${
                          selectedColor ===
                          color
                            ? "border-black scale-110"
                            : "border-gray-200"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* SIZES */}
            {product.sizes?.length >
              0 && (
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(
                    (size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize(
                            size
                          )
                        }
                        className={`px-6 py-3 rounded-2xl font-bold border transition-all duration-300 ${
                          selectedSize ===
                          size
                            ? "bg-black text-white border-black scale-105"
                            : "bg-white border-gray-200 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="bg-white rounded-3xl p-5 shadow-lg text-center">
                <FiTruck className="mx-auto text-2xl mb-2" />
                <p className="font-bold text-sm">
                  Free Delivery
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-lg text-center">
                <FiShield className="mx-auto text-2xl mb-2" />
                <p className="font-bold text-sm">
                  Secure Payment
                </p>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-lg text-center">
                <FiRefreshCcw className="mx-auto text-2xl mb-2" />
                <p className="font-bold text-sm">
                  Easy Returns
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-10 bg-white rounded-[32px] p-8 shadow-xl">
              <h2 className="text-2xl font-black mb-5">
                Product Details
              </h2>

              <ul className="space-y-3 text-gray-600">
                {Array.isArray(
                  product.description
                ) ? (
                  product.description.map(
                    (
                      desc,
                      i
                    ) => (
                      <li
                        key={i}
                        className="flex gap-3"
                      >
                        <span>
                          •
                        </span>
                        <span>
                          {desc}
                        </span>
                      </li>
                    )
                  )
                ) : (
                  <li>
                    {
                      product.description
                    }
                  </li>
                )}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={
                  handleAddToCart
                }
                className="flex-1 py-5 rounded-3xl bg-gray-100 hover:bg-gray-200 font-bold text-lg transition-all duration-300"
              >
                Add To Cart
              </button>

              <button
                onClick={
                  handleBuyNow
                }
                className="flex-1 py-5 rounded-3xl bg-gradient-to-r from-black via-gray-900 to-black text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-2xl"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* RECOMMENDED */}
        {recommended.length >
          0 && (
          <div className="mt-28">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black">
                  You May Also Like
                </h2>

                <p className="text-gray-500 mt-2">
                  Premium picks for
                  you
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl">
                <FiShoppingBag />
                Trending Collection
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommended.map(
                (item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{
                      y: -10,
                    }}
                    onClick={() =>
                      navigate(
                        `/products/${item._id}`
                      )
                    }
                    className="bg-white rounded-[32px] overflow-hidden shadow-xl cursor-pointer group"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={
                          item
                            .images?.[0]
                        }
                        alt=""
                        className="w-full h-80 object-cover group-hover:scale-110 transition-all duration-700"
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-gray-500 text-sm uppercase">
                        {item.brand ||
                          "AdiShop"}
                      </p>

                      <h3 className="font-bold text-xl mt-2 line-clamp-1">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-2xl font-black">
                          ₹
                          {item.offerPrice ||
                            item.price}
                        </span>

                        <div className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                          ⭐ 4.8
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* STICKY BUY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-200 p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4">
            <img
              src={thumbnail}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover"
            />

            <div>
              <h3 className="font-bold">
                {product.name}
              </h3>

              <p className="text-2xl font-black">
                ₹
                {product.offerPrice ||
                  product.price}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={
                handleAddToCart
              }
              className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 font-bold"
            >
              Add To Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-black text-white font-bold hover:scale-[1.02] transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;