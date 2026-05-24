// src/pages/Products.jsx

import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  FiFilter,
  FiShoppingBag,
} from "react-icons/fi";

const BASE_URL =
  import.meta.env.VITE_API_URL;

const Products = () => {
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

  const [mobileFilters, setMobileFilters] =
    useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 8;

  const [filters, setFilters] =
    useState({
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
    beauty:
      "Beauty Products",
  };

  // URL CATEGORY
  useEffect(() => {
    if (
      category &&
      categoryMap[category]
    ) {
      setFilters((prev) => ({
        ...prev,
        category:
          categoryMap[
            category
          ],
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
    const fetchProducts =
      async () => {
        try {
          const res =
            await axios.get(
              `${BASE_URL}/products`
            );

          const availableProducts =
            res.data.filter(
              (
                product
              ) =>
                product.inStock !==
                false
            );

          setProducts(
            availableProducts
          );

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
      dispatch(
        fetchWishlist(token)
      );
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
          (
            p.category || ""
          ).toLowerCase() ===
          filters.category.toLowerCase()
      );
    }

    // PRICE
    result = result.filter(
      (p) => {
        const price =
          Number(
            p.price || 0
          );

        return (
          price >=
            filters.minPrice &&
          price <=
            filters.maxPrice
        );
      }
    );

    // STOCK
    if (filters.inStock) {
      result = result.filter(
        (p) =>
          p.inStock === true
      );
    }

    // SORTING
    if (
      filters.sortBy ===
      "lowToHigh"
    ) {
      result.sort(
        (a, b) =>
          Number(
            a.price || 0
          ) -
          Number(
            b.price || 0
          )
      );
    } else if (
      filters.sortBy ===
      "highToLow"
    ) {
      result.sort(
        (a, b) =>
          Number(
            b.price || 0
          ) -
          Number(
            a.price || 0
          )
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

  const paginate = (pageNumber) =>
    setCurrentPage(pageNumber);

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

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
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
    const handleBuyNow = (
      e
    ) => {
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
              "Added to wishlist!"
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
          setCurrentImage(
            image
          )
        }
        className="group relative overflow-hidden rounded-[28px] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
      >
        {/* BADGES */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
              {discount}% OFF
            </span>
          )}

          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow">
            🔥 Trending
          </span>
        </div>

        {/* WISHLIST */}
        <button
          onClick={
            handleWishlistToggle
          }
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
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

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />

          {/* QUICK ACTIONS */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-10 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
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
                className="bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl"
              >
                Buy Now
              </button>
            )}

            <button className="bg-white text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium shadow-xl">
              Quick View
            </button>
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

          <div className="flex items-center gap-2 mt-3">
            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-lg font-medium">
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
            <span className="text-2xl font-semibold text-gray-900">
              ₹{product.price}
            </span>

            {product.originalPrice && (
              <>
                <span className="line-through text-gray-400 text-sm">
                  ₹
                  {
                    product.originalPrice
                  }
                </span>

                <span className="text-green-600 text-sm font-medium">
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* MOBILE FILTER BUTTON */}
      <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          AdiShop
        </h2>

        <button
          onClick={() =>
            setMobileFilters(
              !mobileFilters
            )
          }
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-2xl shadow-lg"
        >
          <FiFilter size={20} />
        </button>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`${
            mobileFilters
              ? "translate-x-0"
              : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-0 left-0 z-50 md:z-0 h-screen md:h-auto w-[320px] bg-white border-r border-gray-100 shadow-xl p-6 transition-all duration-500 overflow-y-auto`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-2xl shadow-lg">
              <FiShoppingBag size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                Filters
              </h2>

              <p className="text-sm text-gray-500">
                Customize Products
              </p>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-10">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
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
                  className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    filters.category ===
                    cat
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="mb-10">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Price Range
            </h3>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-5 border border-gray-100">
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
                className="w-full accent-indigo-500 cursor-pointer"
              />

              <div className="flex justify-between mt-4">
                <span className="font-semibold text-base text-gray-800">
                  ₹
                  {
                    filters.minPrice
                  }
                </span>

                <span className="font-semibold text-base text-gray-800">
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
            <h3 className="text-base font-semibold text-gray-900 mb-4">
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
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div>
                <p className="font-medium">
                  In Stock Only
                </p>

                <p className="text-sm opacity-70 mt-1">
                  Show available
                  products
                </p>
              </div>

              <div
                className={`w-14 h-8 rounded-full flex items-center p-1 transition-all duration-300 ${
                  filters.inStock
                    ? "bg-white/30 justify-end"
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
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            Reset Filters
          </button>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1 p-6 md:p-10">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
            <div>
              <h1 className="text-4xl md:text-[42px] font-semibold tracking-tight text-gray-900">
                {filters.category ===
                "All"
                  ? "Explore Products"
                  : filters.category}
              </h1>

              <p className="text-gray-500 mt-2 text-[15px]">
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
              className="bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            {currentProducts.map(
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
                        onClick={() => {
                          paginate(
                            page
                          );

                          window.scrollTo(
                            {
                              top: 0,
                              behavior:
                                "smooth",
                            }
                          );
                        }}
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

          {/* EMPTY */}
          {filteredProducts.length ===
            0 && (
            <div className="text-center mt-20">
              <h2 className="text-2xl font-semibold text-gray-800">
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