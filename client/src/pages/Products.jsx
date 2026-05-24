// src/pages/Products.jsx

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { AuthContext } from "../context/AuthContext";

import { addToCart } from "../redux/cartSlice";

import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../redux/wishlistSlice";

import toast from "react-hot-toast";

import {
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import {
  FiFilter,
  FiShoppingBag,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const { category } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { user } = useContext(AuthContext);

  const token = user?.token;

  const { items: wishlistItems } = useSelector(
    (state) => state.wishlist
  );

  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [mobileFilters, setMobileFilters] =
    useState(false);

  const [filters, setFilters] = useState({
    category: "All",
    minPrice: 0,
    maxPrice: 10000,
    inStock: false,
    sortBy: "recommended",
  });

  const categoryMap = {
    mens: "Mens Wear",
    womens: "Womens Wear",
    kids: "Kids Wear",
    beauty: "Beauty Products",
  };

  // URL CATEGORY
  useEffect(() => {
    if (category && categoryMap[category]) {
      setFilters((prev) => ({
        ...prev,
        category: categoryMap[category],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        category: "All",
      }));
    }
  }, [category]);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/products`
        );

        const availableProducts =
          res.data.filter(
            (product) =>
              product.inStock !== false
          );

        setProducts(availableProducts);

        setFilteredProducts(
          availableProducts
        );

        setLoading(false);
      } catch (err) {
        console.log(err);

        setError(
          "Failed to load products."
        );

        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // FETCH WISHLIST
  useEffect(() => {
    if (user && token) {
      dispatch(fetchWishlist(token));
    }
  }, [user, token, dispatch]);

  // FILTERS
  useEffect(() => {
    let result = [...products];

    // CATEGORY
    if (
      filters.category &&
      filters.category !== "All"
    ) {
      result = result.filter(
        (p) =>
          (p.category || "").toLowerCase() ===
          filters.category.toLowerCase()
      );
    }

    // PRICE
    result = result.filter((p) => {
      const price = Number(
        p.price || 0
      );

      return (
        price >= filters.minPrice &&
        price <= filters.maxPrice
      );
    });

    // STOCK
    if (filters.inStock) {
      result = result.filter(
        (p) => p.inStock === true
      );
    }

    // SORTING
    if (filters.sortBy === "lowToHigh") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    } else if (
      filters.sortBy === "highToLow"
    ) {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    } else if (
      filters.sortBy === "newest"
    ) {
      result.sort(
        (a, b) =>
          new Date(
            b.createdAt || Date.now()
          ) -
          new Date(
            a.createdAt || Date.now()
          )
      );
    }

    setFilteredProducts(result);
  }, [filters, products]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl font-bold">
        Loading Amazing Products...
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

  // PRODUCT CARD
  const ProductCard = ({
    product,
  }) => {
    const image =
      product.images?.[0] ||
      "https://via.placeholder.com/300";

    const hoverImage =
      product.images?.[1] ||
      image;

    const [currentImage, setCurrentImage] =
      useState(image);

    const [addedToCart, setAddedToCart] =
      useState(false);

    const isInWishlist =
      wishlistItems.some(
        (item) =>
          item._id === product._id
      );

    const discount =
      product.originalPrice
        ? Math.round(
            ((product.originalPrice -
              product.price) /
              product.originalPrice) *
              100
          )
        : 0;

    // CART
    const handleAddToCart = async (
      e
    ) => {
      e.stopPropagation();

      if (!user) {
        return toast.error(
          "Please login first!"
        );
      }

      try {
        await dispatch(
          addToCart({
            userId: user._id,
            productId: product._id,
            quantity: 1,
          })
        ).unwrap();

        toast.success(
          `${product.name} added to cart!`
        );

        setAddedToCart(true);
      } catch (err) {
        toast.error(
          "Failed to add product"
        );
      }
    };

    // BUY NOW
    const handleBuyNow = (e) => {
      e.stopPropagation();

      navigate("/cart");
    };

    // WISHLIST
    const handleWishlistToggle =
      async (e) => {
        e.stopPropagation();

        if (!user) {
          return toast.error(
            "Please login first!"
          );
        }

        try {
          if (!isInWishlist) {
            await dispatch(
              addToWishlist({
                productId:
                  product._id,
                token,
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
                token,
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

    return (
      <div
        onClick={() =>
          navigate(
            `/products/${product._id}`
          )
        }
        onMouseEnter={() =>
          setCurrentImage(
            hoverImage
          )
        }
        onMouseLeave={() =>
          setCurrentImage(image)
        }
        className="group relative overflow-hidden rounded-[32px] bg-white border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 cursor-pointer"
      >
        {/* BADGES */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
              {discount}% OFF
            </span>
          )}

          <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
            🔥 Hot
          </span>
        </div>

        {/* WISHLIST */}
        <button
          onClick={
            handleWishlistToggle
          }
          className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-xl hover:scale-110 transition"
        >
          {isInWishlist ? (
            <AiFillHeart
              size={22}
              className="text-pink-500"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="text-black"
            />
          )}
        </button>

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

          {/* QUICK ACTIONS */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-10 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            {!addedToCart ? (
              <button
                onClick={
                  handleAddToCart
                }
                className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold shadow-xl"
              >
                Add To Cart
              </button>
            ) : (
              <button
                onClick={
                  handleBuyNow
                }
                className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-xl"
              >
                Buy Now
              </button>
            )}

            <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold shadow-xl">
              Quick View
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
            {product.brand ||
              "AdiShop"}
          </p>

          <h3 className="mt-2 text-xl font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-3">
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md">
              ⭐{" "}
              {product.rating ||
                4.5}
            </span>

            <span className="text-gray-500 text-sm">
              3k+ sold
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-black text-black">
              ₹{product.price}
            </span>

            {product.originalPrice && (
              <>
                <span className="line-through text-gray-400">
                  ₹
                  {
                    product.originalPrice
                  }
                </span>

                <span className="text-green-600 text-sm font-bold">
                  Save ₹
                  {product.originalPrice -
                    product.price}
                </span>
              </>
            )}
          </div>

          {/* DELIVERY */}
          <p className="mt-3 text-sm text-gray-500">
            🚚 Free Delivery
            Available
          </p>

          {/* CTA */}
          <button
            onClick={
              addedToCart
                ? handleBuyNow
                : handleAddToCart
            }
            className={`mt-5 w-full py-3 rounded-2xl font-bold transition-all duration-300 ${
              addedToCart
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-gradient-to-r from-black via-gray-900 to-black text-white hover:scale-[1.02]"
            }`}
          >
            {addedToCart
              ? "Proceed To Checkout"
              : "Add To Cart"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-2xl font-black">
          AdiShop
        </h2>

        <button
          onClick={() =>
            setMobileFilters(
              !mobileFilters
            )
          }
          className="bg-black text-white p-3 rounded-xl"
        >
          <FiFilter size={20} />
        </button>
      </div>

      <div className="flex">
        {/* FILTER SIDEBAR */}
        <aside
          className={`${
            mobileFilters
              ? "translate-x-0"
              : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-0 left-0 z-50 md:z-0 h-screen md:h-auto w-[320px] bg-white/70 backdrop-blur-2xl border-r border-white/30 shadow-2xl p-6 transition-all duration-500 overflow-y-auto`}
        >
          {/* TITLE */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-black text-white p-3 rounded-2xl">
              <FiShoppingBag size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Filters
              </h2>

              <p className="text-sm text-gray-500">
                Customize Products
              </p>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4">
              Categories
            </h3>

            <div className="flex flex-wrap gap-3">
              {[
                "All",
                "Mens Wear",
                "Womens Wear",
                "Kids Wear",
                "Beauty Products",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setFilters(
                      (
                        prev
                      ) => ({
                        ...prev,
                        category:
                          cat,
                      })
                    )
                  }
                  className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    filters.category ===
                    cat
                      ? "bg-black text-white shadow-2xl scale-105"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4">
              Price Range
            </h3>

            <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
              <input
                type="range"
                min="0"
                max="10000"
                value={
                  filters.maxPrice
                }
                onChange={(e) =>
                  setFilters(
                    (
                      prev
                    ) => ({
                      ...prev,
                      maxPrice:
                        Number(
                          e
                            .target
                            .value
                        ),
                    })
                  )
                }
                className="w-full accent-black cursor-pointer"
              />

              <div className="flex justify-between mt-4">
                <span className="font-bold text-lg">
                  ₹
                  {
                    filters.minPrice
                  }
                </span>

                <span className="font-bold text-lg">
                  ₹
                  {
                    filters.maxPrice
                  }
                </span>
              </div>
            </div>
          </div>

          {/* STOCK */}
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4">
              Availability
            </h3>

            <div
              onClick={() =>
                setFilters(
                  (
                    prev
                  ) => ({
                    ...prev,
                    inStock:
                      !prev.inStock,
                  })
                )
              }
              className={`flex items-center justify-between p-5 rounded-3xl cursor-pointer transition-all duration-300 ${
                filters.inStock
                  ? "bg-black text-white shadow-2xl"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div>
                <p className="font-bold">
                  In Stock Only
                </p>

                <p className="text-sm opacity-70">
                  Show available
                  products
                </p>
              </div>

              <div
                className={`w-14 h-8 rounded-full flex items-center p-1 transition-all duration-300 ${
                  filters.inStock
                    ? "bg-green-500 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* RESET */}
          <button
            onClick={() =>
              setFilters({
                category: "All",
                minPrice: 0,
                maxPrice: 10000,
                inStock: false,
                sortBy:
                  "recommended",
              })
            }
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-black via-gray-900 to-black text-white font-bold hover:scale-[1.02] transition-all duration-300"
          >
            Reset Filters
          </button>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1 p-6 md:p-10">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
                {filters.category ===
                "All"
                  ? "Explore Products"
                  : filters.category}
              </h1>

              <p className="text-gray-500 mt-2">
                Discover premium
                collections
              </p>
            </div>

            {/* SORT */}
            <select
              value={
                filters.sortBy
              }
              onChange={(e) =>
                setFilters(
                  (
                    prev
                  ) => ({
                    ...prev,
                    sortBy:
                      e.target
                        .value,
                  })
                )
              }
              className="bg-white shadow-xl border border-gray-200 rounded-2xl px-5 py-4 font-semibold focus:outline-none"
            >
              <option value="recommended">
                Recommended
              </option>

              <option value="lowToHigh">
                Price: Low to High
              </option>

              <option value="highToLow">
                Price: High to Low
              </option>

              <option value="newest">
                Newest First
              </option>
            </select>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product._id
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>

          {/* EMPTY */}
          {filteredProducts.length ===
            0 && (
            <div className="text-center mt-20">
              <h2 className="text-3xl font-black text-gray-800">
                No Products Found
              </h2>

              <p className="text-gray-500 mt-3">
                Try changing filters
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;