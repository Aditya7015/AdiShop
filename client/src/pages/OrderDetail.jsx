import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AiOutlineArrowLeft, AiOutlineShopping, AiOutlineCheckCircle, AiOutlineTruck, AiOutlineHome } from "react-icons/ai";

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        
        // First, try to fetch all user orders
        const res = await fetch(`${API_URL}/orders/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await res.json();
        
        // Find the specific order from the list
        const foundOrder = data.orders?.find(order => 
          order._id === orderId || order.orderId === orderId
        );
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          throw new Error('Order not found');
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, user]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <AiOutlineCheckCircle className="text-green-500" />;
      case 'shipped':
        return <AiOutlineTruck className="text-blue-500" />;
      case 'processing':
        return <AiOutlineShopping className="text-yellow-500" />;
      default:
        return <AiOutlineShopping className="text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view order details</p>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => navigate('/myorders')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const totalItems = order.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/myorders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <AiOutlineArrowLeft />
            Back to My Orders
          </button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
              <p className="text-gray-600 mt-1">
                Order #{order.orderId || order._id}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status || 'Processing'}</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                Payment: {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {order.products?.map((item, index) => {
                  const product = item.product || {};
                  return (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/80"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                        {item.color && (
                          <p className="text-sm text-gray-600">Color: {item.color}</p>
                        )}
                        {item.size && (
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        )}
                        <p className="text-lg font-semibold text-gray-900 mt-2">
                          ₹{((product.offerPrice || product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Order Information */}
          <div className="space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-800">Order Placed</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {order.status === 'processing' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Processing</p>
                      <p className="text-sm text-gray-500">Your order is being prepared</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'shipped' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Shipped</p>
                      <p className="text-sm text-gray-500">Your order is on the way</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'delivered' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Delivered</p>
                      <p className="text-sm text-gray-500">Your order has been delivered</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Price ({totalItems} items)</span>
                  <span>₹{order.amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">-₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{(order.amount * 0.18).toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>₹{(order.amount * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span>{order.orderId || order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="capitalize">{order.paymentMethod || 'Online'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;