// pages/admin/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast'; // ✅ import toast

const AddProduct = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Mens Wear', 'Womens Wear', 'Kids Wear', 'Beauty Products'];

  const handleImageChange = async (index, file) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const updatedImages = [...images];
      updatedImages[index] = compressedFile;
      setImages(updatedImages);
    } catch (error) {
      console.error("Error compressing the image:", error);
      toast.error("Failed to compress image. Try a smaller file."); // ✅ toast for compression error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('offerPrice', offerPrice);

      images.forEach((img) => {
        if (img) formData.append('images', img);
      });

      const token = localStorage.getItem("userToken");

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product added successfully!"); // ✅ toast success
      setProductName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setOfferPrice("");
      setImages([null, null, null, null]);
    } catch (error) {
      console.error(error);
      toast.error("Error adding product!"); // ✅ toast error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg mx-auto">
        {/* Images */}
        <div>
          <p className="text-base font-medium">Product Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4).fill('').map((_, index) => (
              <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                <input
                  accept="image/*"
                  type="file"
                  id={`image${index}`}
                  hidden
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                />
                <img
                  className="max-w-24 border p-1 rounded"
                  src={images[index] ? URL.createObjectURL(images[index]) : 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png'}
                  alt={`uploadArea${index}`}
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">Category</label>
          <select
            id="category"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Prices */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded hover:opacity-90 transition"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
