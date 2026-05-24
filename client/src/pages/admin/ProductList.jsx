import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  Search,
  Package,
  CheckCircle2,
  XCircle,
  Sparkles,
  IndianRupee,
} from "lucide-react";

import { motion } from "framer-motion";

const ProductList = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    stockFilter,
    setStockFilter,
  ] = useState("all");

  const BASE_URL =
    import.meta.env.VITE_API_URL;

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "userToken"
            );

          if (!token) {
            console.error(
              "No token found"
            );

            setLoading(false);

            return;
          }

          const res =
            await fetch(
              `${BASE_URL}/products/owner/me`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          if (!res.ok) {
            console.error(
              "Failed to fetch products"
            );

            setLoading(false);

            return;
          }

          const data =
            await res.json();

          setProducts(data);
        } catch (err) {
          console.error(
            "Error fetching products:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, []);

  // TOGGLE STOCK
  const toggleStock =
    async (id) => {
      try {
        const token =
          localStorage.getItem(
            "userToken"
          );

        const res =
          await fetch(
            `${BASE_URL}/products/${id}/toggle-stock`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (!res.ok)
          throw new Error(
            "Failed to update stock"
          );

        const data =
          await res.json();

        setProducts((prev) =>
          prev.map((p) =>
            p._id ===
            data.product._id
              ? data.product
              : p
          )
        );
      } catch (err) {
        console.error(
          "Error toggling stock:",
          err
        );
      }
    };

  // FILTERED PRODUCTS
  const filteredProducts =
    useMemo(() => {
      return products.filter(
        (product) => {
          const matchesSearch =
            product.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStock =
            stockFilter ===
            "all"
              ? true
              : stockFilter ===
                "instock"
              ? product.inStock
              : !product.inStock;

          return (
            matchesSearch &&
            matchesStock
          );
        }
      );
    }, [
      products,
      search,
      stockFilter,
    ]);

  // STATS
  const totalProducts =
    products.length;

  const inStockProducts =
    products.filter(
      (p) => p.inStock
    ).length;

  const outOfStockProducts =
    totalProducts -
    inStockProducts;

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-xl">
            <Package size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
              Product Inventory
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and track all
              your store products
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* SEARCH BAR */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full sm:w-80 bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* FILTER */}
          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(
                e.target.value
              )
            }
            className="bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="all">
              All Products
            </option>

            <option value="instock">
              In Stock
            </option>

            <option value="outofstock">
              Out Of Stock
            </option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* TOTAL */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Total Products
              </p>

              <h2 className="text-4xl font-semibold text-gray-900 mt-3">
                {
                  totalProducts
                }
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg">
              <Package size={24} />
            </div>
          </div>
        </motion.div>

        {/* IN STOCK */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                In Stock
              </p>

              <h2 className="text-4xl font-semibold text-green-600 mt-3">
                {
                  inStockProducts
                }
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </motion.div>

        {/* OUT OF STOCK */}
        <motion.div
          whileHover={{
            y: -4,
          }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                Out Of Stock
              </p>

              <h2 className="text-4xl font-semibold text-red-500 mt-3">
                {
                  outOfStockProducts
                }
              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <XCircle size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* EMPTY */}
      {!filteredProducts.length ? (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm py-24 text-center">
          <Sparkles
            size={60}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-3xl font-semibold text-gray-900 mt-6">
            No Products Found
          </h2>

          <p className="text-gray-500 mt-3">
            Try changing your
            search or filters.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                {/* HEAD */}
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-800">
                      Product
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-800">
                      Category
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-800">
                      Price
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-800">
                      Status
                    </th>

                    <th className="px-6 py-5 text-left text-sm font-semibold text-gray-800">
                      Stock
                    </th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {filteredProducts.map(
                    (
                      product
                    ) => (
                      <tr
                        key={
                          product._id
                        }
                        className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-300"
                      >
                        {/* PRODUCT */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                product
                                  .images[0]
                              }
                              alt={
                                product.name
                              }
                              className="w-20 h-20 rounded-2xl object-cover border border-gray-100"
                            />

                            <div>
                              <h3 className="font-semibold text-gray-900 line-clamp-1">
                                {
                                  product.name
                                }
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                ID:{" "}
                                {product._id.slice(
                                  0,
                                  10
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-6 py-5">
                          <div className="inline-flex px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                            {
                              product.category
                            }
                          </div>
                        </td>

                        {/* PRICE */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1 text-2xl font-semibold text-gray-900">
                            <IndianRupee size={18} />

                            {product.offerPrice ||
                              product.price}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-5">
                          {product.inStock ? (
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              In Stock
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              Out Of Stock
                            </div>
                          )}
                        </td>

                        {/* TOGGLE */}
                        <td className="px-6 py-5">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={
                                product.inStock
                              }
                              onChange={() =>
                                toggleStock(
                                  product._id
                                )
                              }
                            />

                            <div className="w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all duration-300"></div>

                            <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></span>
                          </label>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map(
              (
                product
              ) => (
                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  key={
                    product._id
                  }
                  className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* IMAGE */}
                  <div className="relative">
                    <img
                      src={
                        product
                          .images[0]
                      }
                      alt={
                        product.name
                      }
                      className="w-full h-64 object-cover"
                    />

                    {/* BADGE */}
                    <div
                      className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium ${
                        product.inStock
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {product.inStock
                        ? "In Stock"
                        : "Out Of Stock"}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                      {
                        product.name
                      }
                    </h3>

                    <div className="mt-3 inline-flex px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                      {
                        product.category
                      }
                    </div>

                    <div className="mt-5 flex items-center gap-1 text-3xl font-semibold text-indigo-600">
                      <IndianRupee size={20} />

                      {product.offerPrice ||
                        product.price}
                    </div>

                    {/* TOGGLE */}
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Product Stock
                      </p>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={
                            product.inStock
                          }
                          onChange={() =>
                            toggleStock(
                              product._id
                            )
                          }
                        />

                        <div className="w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 transition-all duration-300"></div>

                        <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;