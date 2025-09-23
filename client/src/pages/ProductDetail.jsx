import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        setThumbnail(res.data.images?.[0] || "");
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading product...</p>;

  const handleAddToCart = () => {
    if (!user?._id) {
      alert("Please login to add items to your cart");
      return;
    }

    dispatch(addToCart({
      userId: user._id,
      productId: product._id,
      quantity: 1,
    }));
  };

  return (
    <div className="max-w-6xl w-full px-6 mx-auto">
      <p className="text-gray-500 text-sm">
        <span>Home</span> / <span>Products</span> / <span>{product.category}</span> /{" "}
        <span className="text-indigo-500">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* Thumbnails + Main Image */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.images?.map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className="border max-w-24 border-gray-300 rounded overflow-hidden cursor-pointer"
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="border border-gray-300 max-w-100 rounded overflow-hidden">
            <img
              src={thumbnail}
              alt="Selected product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="mt-6">
            <p className="text-gray-500/70 line-through">MRP: ${product.price}</p>
            <p className="text-2xl font-medium">Offer: ${product.offerPrice}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {Array.isArray(product.description)
              ? product.description.map((desc, index) => <li key={index}>{desc}</li>)
              : <li>{product.description}</li>}
          </ul>

          {/* Buttons */}
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button className="w-full py-3.5 font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
