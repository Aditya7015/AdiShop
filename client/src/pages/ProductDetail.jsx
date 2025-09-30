import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [recommended, setRecommended] = useState([]);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch current product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(res.data);
        setThumbnail(res.data.images?.[0] || "");
        setSelectedColor(res.data.colors?.[0] || "");
        setSelectedSize(res.data.sizes?.[0] || "");
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch recommended products
  // Fetch recommended products
useEffect(() => {
  const fetchRecommended = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      // Remove current product
      const others = res.data.filter((p) => p._id !== id);

      // Shuffle the array
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }

      // Take first 4 random products
      setRecommended(others.slice(0, 4));
    } catch (err) {
      console.error("Error fetching recommended products:", err);
    }
  };
  fetchRecommended();
}, [id]);


  if (!product) return <p className="text-center mt-10">Loading product...</p>;

  const handleAddToCart = () => {
    if (!user?._id) {
      toast.error("Please login to add items to your cart");
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
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
    toast.success("Product added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-32">
      {/* Product Info Section */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Images */}
        <div className="flex gap-4 md:gap-6 md:w-1/2">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                  thumbnail === img ? "border-indigo-500" : "border-gray-300"
                }`}
                onClick={() => setThumbnail(img)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 border border-gray-300 rounded overflow-hidden flex items-center justify-center">
            <img
              src={thumbnail}
              alt="Selected product"
              className="max-w-full max-h-[450px] object-contain"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-yellow-400">★★★★☆</span>
              <span className="text-gray-500 text-sm">(25 Reviews)</span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <p className="text-gray-500 line-through">MRP: ${product.price}</p>
              <p className="text-2xl font-bold text-indigo-600">
                Offer: ${product.offerPrice}
              </p>
            </div>
            <span className="text-gray-400 text-sm">(inclusive of all taxes)</span>

            {/* Color & Size */}
            {product.colors && (
              <div className="mt-6">
                <h2 className="text-md font-medium mb-2">Colors:</h2>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                        selectedColor === color
                          ? "border-indigo-500"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="mt-4">
                <h2 className="text-md font-medium mb-2">Sizes:</h2>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded ${
                        selectedSize === size
                          ? "border-indigo-500 text-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">About Product</h2>
              <ul className="list-disc ml-5 text-gray-600 space-y-1">
                {Array.isArray(product.description)
                  ? product.description.map((desc, i) => <li key={i}>{desc}</li>)
                  : <li>{product.description}</li>}
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              className="w-full md:w-1/2 py-3.5 font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 rounded transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full md:w-1/2 py-3.5 font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {recommended.map((rec) => (
              <div
                key={rec._id}
                className="bg-white rounded-md shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Product Image */}
                <div
                  onClick={() => navigate(`/products/${rec._id}`)}
                  className="cursor-pointer flex-1 flex items-center justify-center p-4"
                >
                  <img
                    src={rec.images?.[0] || "https://via.placeholder.com/300"}
                    alt={rec.name}
                    className="object-contain h-40 w-full"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3 flex flex-col gap-1">
                  <p className="text-sm text-gray-500">{rec.brand || "Brand"}</p>
                  <h3
                    className="font-medium text-gray-800 truncate"
                    title={rec.name}
                  >
                    {rec.name}
                  </h3>
                  <p className="text-gray-900 font-semibold">₹{rec.price}</p>
                </div>

                {/* Buttons */}
                <div className="px-3 pb-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user?._id) return toast.error("Please login first!");
                      dispatch(
                        addToCart({
                          userId: user._id,
                          productId: rec._id,
                          quantity: 1,
                        })
                      );
                      toast.success(`${rec.name} added to cart!`);
                    }}
                    className="flex-1 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded transition text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        addToCart({
                          userId: user._id,
                          productId: rec._id,
                          quantity: 1,
                        })
                      );
                      navigate("/cart");
                    }}
                    className="flex-1 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded transition text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
