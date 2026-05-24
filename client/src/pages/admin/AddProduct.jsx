import React, {
  useState,
} from "react";

import axios from "axios";

import imageCompression from "browser-image-compression";

import toast from "react-hot-toast";

import {
  Upload,
  ImagePlus,
  Sparkles,
  IndianRupee,
  Package,
  BadgePercent,
} from "lucide-react";

import { motion } from "framer-motion";

const BASE_URL =
  import.meta.env.VITE_API_URL;

const AddProduct = () => {
  const [images, setImages] =
    useState([
      null,
      null,
      null,
      null,
    ]);

  const [
    productName,
    setProductName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [category, setCategory] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [
    offerPrice,
    setOfferPrice,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const categories = [
    "Mens Wear",
    "Womens Wear",
    "Kids Wear",
    "Beauty Products",
  ];

  // IMAGE COMPRESS
  const handleImageChange =
    async (index, file) => {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile =
          await imageCompression(
            file,
            options
          );

        const updatedImages = [
          ...images,
        ];

        updatedImages[index] =
          compressedFile;

        setImages(
          updatedImages
        );

        toast.success(
          "Image uploaded"
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to compress image"
        );
      }
    };

  // SUBMIT
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setLoading(true);

      try {
        const formData =
          new FormData();

        formData.append(
          "name",
          productName
        );

        formData.append(
          "description",
          description
        );

        formData.append(
          "category",
          category
        );

        formData.append(
          "price",
          price
        );

        formData.append(
          "offerPrice",
          offerPrice
        );

        images.forEach(
          (img) =>
            img &&
            formData.append(
              "images",
              img
            )
        );

        const token =
          localStorage.getItem(
            "userToken"
          );

        await axios.post(
          `${BASE_URL}/products`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Product added successfully!"
        );

        // RESET
        setProductName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");

        setImages([
          null,
          null,
          null,
          null,
        ]);
      } catch (error) {
        console.error(error);

        toast.error(
          "Error adding product!"
        );
      } finally {
        setLoading(false);
      }
    };

  // DISCOUNT %
  const discount =
    price &&
    offerPrice &&
    Number(price) >
      Number(offerPrice)
      ? Math.round(
          ((price -
            offerPrice) /
            price) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
          {/* FORM */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8"
          >
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg">
                <Package size={26} />
              </div>

              <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                  Add New Product
                </h1>

                <p className="text-gray-500 mt-1">
                  Upload and manage
                  your ecommerce
                  products
                </p>
              </div>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-8"
            >
              {/* IMAGE SECTION */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <ImagePlus className="text-indigo-600" />

                  <h2 className="text-lg font-semibold text-gray-900">
                    Product Images
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {Array(4)
                    .fill("")
                    .map(
                      (
                        _,
                        index
                      ) => (
                        <motion.label
                          whileHover={{
                            y: -4,
                          }}
                          key={
                            index
                          }
                          htmlFor={`image${index}`}
                          className="relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer hover:border-indigo-400 transition-all duration-300"
                        >
                          <input
                            accept="image/*"
                            type="file"
                            id={`image${index}`}
                            hidden
                            onChange={(
                              e
                            ) =>
                              handleImageChange(
                                index,
                                e
                                  .target
                                  .files[0]
                              )
                            }
                          />

                          {images[
                            index
                          ] ? (
                            <img
                              src={URL.createObjectURL(
                                images[
                                  index
                                ]
                              )}
                              alt={`upload${index}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                              <Upload
                                size={
                                  30
                                }
                              />

                              <p className="mt-3 text-sm font-medium">
                                Upload
                              </p>
                            </div>
                          )}
                        </motion.label>
                      )
                    )}
                </div>
              </div>

              {/* PRODUCT NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Enter premium product name..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  value={
                    productName
                  }
                  onChange={(
                    e
                  ) =>
                    setProductName(
                      e.target
                        .value
                    )
                  }
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Product Description
                </label>

                <textarea
                  rows={5}
                  placeholder="Write a premium product description..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  value={
                    description
                  }
                  onChange={(
                    e
                  ) =>
                    setDescription(
                      e.target
                        .value
                    )
                  }
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Category
                </label>

                <select
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  value={
                    category
                  }
                  onChange={(
                    e
                  ) =>
                    setCategory(
                      e.target
                        .value
                    )
                  }
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (
                      item,
                      index
                    ) => (
                      <option
                        key={
                          index
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* PRICES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PRICE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Original Price
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={
                        price
                      }
                      onChange={(
                        e
                      ) =>
                        setPrice(
                          e.target
                            .value
                        )
                      }
                      required
                    />
                  </div>
                </div>

                {/* OFFER PRICE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Offer Price
                  </label>

                  <div className="relative">
                    <BadgePercent
                      size={18}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={
                        offerPrice
                      }
                      onChange={(
                        e
                      ) =>
                        setOfferPrice(
                          e.target
                            .value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={
                  loading
                }
                className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
              >
                {loading
                  ? "Uploading Product..."
                  : "Add Product"}
              </button>
            </form>
          </motion.div>

          {/* SIDEBAR */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="space-y-6"
          >
            {/* SUMMARY */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg">
                  <Sparkles size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Product Preview
                  </h2>

                  <p className="text-sm text-gray-500">
                    Live product info
                  </p>
                </div>
              </div>

              {/* IMAGE */}
              <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 mb-6">
                {images[0] ? (
                  <img
                    src={URL.createObjectURL(
                      images[0]
                    )}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Preview
                  </div>
                )}
              </div>

              {/* DETAILS */}
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                {productName ||
                  "Product Name"}
              </h3>

              <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                {description ||
                  "Your premium product description will appear here."}
              </p>

              {/* PRICE */}
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <span className="text-3xl font-semibold text-indigo-600">
                  ₹
                  {offerPrice ||
                    price ||
                    0}
                </span>

                {offerPrice &&
                  price && (
                    <>
                      <span className="text-gray-400 line-through">
                        ₹{price}
                      </span>

                      <span className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                        {discount}
                        % OFF
                      </span>
                    </>
                  )}
              </div>

              {/* CATEGORY */}
              {category && (
                <div className="mt-5 inline-flex px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                  {category}
                </div>
              )}
            </div>

            {/* TIPS */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[80px]" />

              <div className="relative z-10">
                <h2 className="text-2xl font-semibold">
                  Pro Tips 🚀
                </h2>

                <ul className="mt-6 space-y-4 text-sm text-white/90">
                  <li>
                    • Use
                    high-quality
                    product images
                  </li>

                  <li>
                    • Keep product
                    titles concise
                    and attractive
                  </li>

                  <li>
                    • Add discounts
                    to boost
                    conversions
                  </li>

                  <li>
                    • Write engaging
                    product
                    descriptions
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;