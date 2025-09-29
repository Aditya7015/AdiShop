import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { fetchCart, removeFromCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);

  // Fetch cart on load
  useEffect(() => {
    if (userId) dispatch(fetchCart(userId));
  }, [userId, dispatch]);

  const handleRemove = async (productId) => {
    if (!userId) return;
    try {
      await dispatch(removeFromCart({ userId, productId })).unwrap();
      toast.success('Item removed from cart!');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const calculateSubtotal = (product, quantity) =>
    (product?.offerPrice || product?.price || 0) * quantity;

  const calculateTotalPrice = () =>
    items.reduce((acc, item) => acc + calculateSubtotal(item.productId, item.quantity), 0);

  const handleBuyNow = () => {
    if (items.length === 0) return;
    toast('Buy Now clicked!'); // Placeholder, replace with Stripe checkout later
  };

  if (loading) return <p className="text-center mt-20">Loading cart...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      {/* Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-indigo-500">{items.length} Items</span>
        </h1>

        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          items.map((item) => {
            const product = item.productId;
            return (
              <div
                key={item._id}
                className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
              >
                <div className="flex items-center md:gap-6 gap-3">
                  <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                    <img
                      className="max-w-full h-full object-cover"
                      src={product?.images?.[0] || 'https://placehold.co/150x150?text=No+Image'}
                      alt={product?.name || 'Product'}
                    />
                  </div>
                  <div>
                    <p className="hidden md:block font-semibold">{product?.name}</p>
                    <div className="font-normal text-gray-500/70">
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
                <p className="text-center">
                  ${calculateSubtotal(product, item.quantity).toFixed(2)}
                </p>
                <button
                  className="cursor-pointer mx-auto text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(product._id)}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>${calculateTotalPrice().toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>${(calculateTotalPrice() * 0.02).toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>${(calculateTotalPrice() * 1.02).toFixed(2)}</span>
          </p>
        </div>

        {/* Buy Now Button */}
        <button
          className={`w-full mt-5 text-white py-3 rounded text-lg font-medium transition-all ${
            items.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handleBuyNow}
          disabled={items.length === 0}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
