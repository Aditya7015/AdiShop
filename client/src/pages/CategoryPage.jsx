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
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

const BASE_URL =
  import.meta.env.VITE_API_URL;

const CategoryPage = () => {
  const { category } =
    useParams();

  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const { user } =
    useContext(AuthContext);

  const token =
    user?.token;

  const {
    items: wishlistItems,
  } = useSelector(
    (state) => state.wishlist
  );

  const [products, setProducts] =
    useState([]);

  const [
    filteredProducts,
    setFilteredProducts,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 6;

  const [filters, setFilters] =
    useState({
      brand: "",
      minPrice: 0,
      maxPrice: 100000,
      inStock: false,
      sortBy: "relevance",
    });

  // CATEGORY MAP
  const categoryMap = {
    mens: "Mens Wear",
    womens: "Womens Wear",
    kids: "Kids Wear",
    beauty:
      "Beauty Products",
  };

  const categoryName =
    categoryMap[category] ||
    "Products";

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);

          const res =
            await axios.get(
              `${BASE_URL}/products`
            );

          const filtered =
            res.data.filter(
              (p) =>
                p.category?.toLowerCase() ===
                categoryName.toLowerCase()
            );

          setProducts(filtered);

          setFilteredProducts(
            filtered
          );
        } catch (err) {
          console.error(err);

          setError(
            "Failed to load products."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [categoryName]);

  // FETCH WISHLIST
  useEffect(() => {
    if (user && token) {
      dispatch(
        fetchWishlist(token)
      );
    }
  }, [user, token, dispatch]);

  // FILTERS
  useEffect(() => {
    let result = [...products];

    // BRAND
    if (filters.brand) {
      result = result.filter(
        (p) =>
          p.brand
            ?.toLowerCase()
            .includes(
              filters.brand.toLowerCase()
            )
      );
    }

    // PRICE
    result = result.filter(
      (p) =>
        (p.offerPrice ||
          p.price) >=
          filters.minPrice &&
        (p.offerPrice ||
          p.price) <=
          filters.maxPrice
    );

    // STOCK
    if (filters.inStock) {
      result = result.filter(
        (p) => p.inStock
      );
    }

    // SORTING
    if (
      filters.sortBy ===
      "lowToHigh"
    ) {
      result.sort(
        (a, b) =>
          (a.offerPrice ||
            a.price) -
          (b.offerPrice ||
            b.price)
      );
    } else if (
      filters.sortBy ===
      "highToLow"
    ) {
      result.sort(
        (a, b) =>
          (b.offerPrice ||
            b.price) -
          (a.offerPrice ||
            a.price)
      );
    } else if (
      filters.sortBy ===
      "newest"
    ) {
      result.sort(
        (a, b) =>
          new Date(
            b.createdAt ||
              Date.now()
          ) -
          new Date(
            a.createdAt ||
              Date.now()
          )
      );
    }

    setCurrentPage(1);

    setFilteredProducts(result);
  }, [filters, products]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredProducts.length /
      productsPerPage
  );

  const indexOfLastProduct =
    currentPage *
    productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct -
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);

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

    const [
      currentImage,
      setCurrentImage,
    ] = useState(image);

    const [
      addedToCart,
      setAddedToCart,
    ] = useState(false);

    const isInWishlist =
      wishlistItems.some(
        (item) =>
          item._id ===
          product._id
      );

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

    // ADD TO CART
    const handleAddToCart =
      async (e) => {
        e.stopPropagation();

        if (!user) {
          return toast.error(
            "Please login first!"
          );
        }

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
            `${product.name} added to cart`
          );

          setAddedToCart(true);
        } catch {
          toast.error(
            "Failed to add product"
          );
        }
      };

    // BUY NOW
    const handleBuyNow = (
      e
    ) => {
      e.stopPropagation();

      navigate("/cart");
    };

    // WISHLIST
    const handleWishlist =
      async (e) => {
        e.stopPropagation();

        if (!user) {
          return toast.error(
            "Please login first!"
          );
        }

        try {
          if (
            !isInWishlist
          ) {
            await dispatch(
              addToWishlist(
                {
                  productId:
                    product._id,
                  token,
                }
              )
            ).unwrap();

            toast.success(
              "Added to wishlist"
            );
          } else {
            await dispatch(
              removeFromWishlist(
                {
                  productId:
                    product._id,
                  token,
                }
              )
            ).unwrap();

            toast.success(
              "Removed from wishlist"
            );
          }
        } catch {
          toast.error(
            "Wishlist update failed"
          );
        }
      };

    return (
      <motion.div
        whileHover={{
          y: -6,
        }}
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
          setCurrentImage(
            image
          )
        }
        className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group"
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* BADGES */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount >
              0 && (
              <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
                {discount}% OFF
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow">
              🔥 Trending
            </div>
          </div>

          {/* WISHLIST */}
          <button
            onClick={
              handleWishlist
            }
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            {isInWishlist ? (
              <AiFillHeart
                size={22}
                className="text-pink-500"
              />
            ) : (
              <AiOutlineHeart
                size={22}
                className="text-gray-700"
              />
            )}
          </button>

          {/* QUICK ACTION */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            {!addedToCart ? (
              <button
                onClick={
                  handleAddToCart
                }
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl"
              >
                Add To Cart
              </button>
            ) : (
              <button
                onClick={
                  handleBuyNow
                }
                className="bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl"
              >
                Buy Now
              </button>
            )}
          </div>
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

          {/* RATING */}
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm font-medium">
              ⭐{" "}
              {product.rating ||
                4.5}
            </div>

            <span className="text-sm text-gray-500">
              2k+ sold
            </span>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="text-2xl font-semibold text-gray-900">
              ₹
              {displayPrice}
            </span>

            {originalPrice && (
              <span className="text-gray-400 line-through">
                ₹
                {
                  originalPrice
                }
              </span>
            )}
          </div>

          {/* DELIVERY */}
          <p className="text-sm text-gray-500 mt-3">
            🚚 Free Delivery
            Available
          </p>
        </div>
      </motion.div>
    );
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <Sparkles size={22} />
              </div>

              <div>
                <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                  {categoryName}
                </h1>

                <p className="text-gray-500 mt-1">
                  {
                    filteredProducts.length
                  }{" "}
                  products found
                </p>
              </div>
            </div>
          </div>

          {/* SORT */}
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
            <SlidersHorizontal
              size={18}
              className="text-gray-500"
            />

            <select
              value={
                filters.sortBy
              }
              onChange={(
                e
              ) =>
                setFilters(
                  (
                    prev
                  ) => ({
                    ...prev,
                    sortBy:
                      e
                        .target
                        .value,
                  })
                )
              }
              className="bg-transparent outline-none text-gray-700 text-sm font-medium"
            >
              <option value="relevance">
                Relevance
              </option>

              <option value="newest">
                Newest First
              </option>

              <option value="lowToHigh">
                Price: Low to High
              </option>

              <option value="highToLow">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* SIDEBAR */}
          <aside className="bg-white rounded-[32px] border border-gray-100 shadow-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">
              Filters
            </h2>

            {/* PRICE */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-800 mb-4 uppercase tracking-wide">
                Price Range
              </h3>

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={
                    filters.minPrice
                  }
                  onChange={(
                    e
                  ) =>
                    setFilters(
                      (
                        prev
                      ) => ({
                        ...prev,
                        minPrice:
                          Number(
                            e
                              .target
                              .value
                          ),
                      })
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  value={
                    filters.maxPrice
                  }
                  onChange={(
                    e
                  ) =>
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
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* BRAND */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-800 mb-4 uppercase tracking-wide">
                Brand
              </h3>

              <input
                type="text"
                placeholder="Search brand"
                value={
                  filters.brand
                }
                onChange={(
                  e
                ) =>
                    setFilters(
                      (
                        prev
                      ) => ({
                        ...prev,
                        brand:
                          e
                            .target
                            .value,
                      })
                    )
                }
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* STOCK */}
            <div className="mb-8">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">
                    In Stock Only
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Show available
                    products
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    filters.inStock
                  }
                  onChange={(
                    e
                  ) =>
                    setFilters(
                      (
                        prev
                      ) => ({
                        ...prev,
                        inStock:
                          e
                            .target
                            .checked,
                      })
                    )
                  }
                  className="w-5 h-5 accent-indigo-500"
                />
              </label>
            </div>

            {/* RESET */}
            <button
              onClick={() =>
                setFilters({
                  brand: "",
                  minPrice: 0,
                  maxPrice: 100000,
                  inStock: false,
                  sortBy:
                    "relevance",
                })
              }
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl font-medium shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Reset Filters
            </button>
          </aside>

          {/* PRODUCTS */}
          <main>
            {filteredProducts.length ===
            0 ? (
              <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-14 text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  No Products Found
                </h2>

                <p className="text-gray-500 mt-3">
                  Try changing your
                  filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                  {currentProducts.map(
                    (
                      product
                    ) => (
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

                {/* PAGINATION */}
                {filteredProducts.length >
                  productsPerPage && (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-5 mt-14">
                    {/* INFO */}
                    <div className="text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-medium text-gray-800">
                        {indexOfFirstProduct +
                          1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-gray-800">
                        {Math.min(
                          indexOfLastProduct,
                          filteredProducts.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-gray-800">
                        {
                          filteredProducts.length
                        }
                      </span>{" "}
                      products
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
                              {
                                page
                              }
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;