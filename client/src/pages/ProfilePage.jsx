import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist, fetchWishlist } from "../redux/wishlistSlice";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineShopping, AiOutlineHeart, AiOutlineUser, AiOutlineHome, AiOutlineSetting, AiOutlinePlus } from "react-icons/ai";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
    addresses: [],
    joinedAt: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    label: "home",
    isDefault: false
  });

  const BASE_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  // Use Redux for wishlist instead of local state
  const { items: wishlist } = useSelector((state) => state.wishlist);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProfile({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        bio: data.bio || "",
        avatarUrl: data.avatarUrl || "https://i.pravatar.cc/150?img=12",
        addresses: data.addresses || [],
        joinedAt: new Date(data.createdAt).toLocaleDateString(),
      });
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      dispatch(fetchWishlist(token)); // Use Redux to fetch wishlist
      fetchOrders();
    }
  }, [token, dispatch]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("phone", profile.phone);
      formData.append("bio", profile.bio);
      
      // Add addresses as JSON string - this is what your backend expects
      formData.append("addresses", JSON.stringify(profile.addresses));
      
      if (avatar) formData.append("avatar", avatar);

      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.user) {
        setProfile((prev) => ({ ...prev, ...data.user }));
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setMessage("Update failed, try again");
    } finally {
      setLoading(false);
    }
  };

  // Address management functions
  const handleAddAddress = () => {
    setEditingAddressIndex(null);
    setAddressForm({
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      label: "home",
      isDefault: profile.addresses.length === 0 // Set as default if no addresses exist
    });
    setShowAddressForm(true);
  };

  const handleEditAddress = (index) => {
    setEditingAddressIndex(index);
    setAddressForm(profile.addresses[index]);
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    const newAddresses = [...profile.addresses];
    
    // If setting as default, remove default from all other addresses
    if (addressForm.isDefault) {
      newAddresses.forEach(addr => addr.isDefault = false);
    }

    if (editingAddressIndex !== null) {
      // Update existing address
      newAddresses[editingAddressIndex] = addressForm;
    } else {
      // Add new address
      newAddresses.push(addressForm);
    }

    setProfile(prev => ({ ...prev, addresses: newAddresses }));
    setShowAddressForm(false);
    setEditingAddressIndex(null);
    setAddressForm({
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      label: "home",
      isDefault: false
    });
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = profile.addresses.filter((_, i) => i !== index);
    setProfile(prev => ({ ...prev, addresses: newAddresses }));
  };

  const handleSetDefaultAddress = (index) => {
    const newAddresses = profile.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    setProfile(prev => ({ ...prev, addresses: newAddresses }));
  };

  const removeFromWishlistHandler = async (productId) => {
    try {
      await dispatch(removeFromWishlist({ productId, token })).unwrap();
    } catch (err) {
      console.error("Remove from wishlist error:", err);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <AiOutlineUser /> },
    { id: "orders", label: "Orders", icon: <AiOutlineShopping /> },
    { id: "wishlist", label: "Wishlist", icon: <AiOutlineHeart /> },
    { id: "addresses", label: "Addresses", icon: <AiOutlineHome /> },
    { id: "settings", label: "Settings", icon: <AiOutlineSetting /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
              />
              <div className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-1">
                <AiOutlineEdit className="text-white text-sm" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-gray-600 mt-1">{profile.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                Member since {profile.joinedAt}
              </p>
              {profile.bio && (
                <p className="text-gray-700 mt-2 max-w-md">{profile.bio}</p>
              )}
            </div>
            
            <button
              onClick={() => setActiveTab("settings")}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              <AiOutlineEdit />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 min-w-max transition-colors duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50 font-semibold"
                    : "border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Full Name</span>
                    <span className="text-gray-800">{profile.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Email</span>
                    <span className="text-gray-800">{profile.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Phone</span>
                    <span className="text-gray-800">{profile.phone || "Not provided"}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-semibold text-indigo-600">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wishlist Items</span>
                      <span className="font-semibold text-indigo-600">{wishlist.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saved Addresses</span>
                      <span className="font-semibold text-indigo-600">{profile.addresses.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">My Orders</h3>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-100">
                        <div>
                          <p className="text-sm text-gray-600">
                            ORDER ID:{" "}
                            <span className="font-medium text-gray-800">
                              {order.orderId || order._id}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-800">
                            ₹{order.amount?.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              order.paymentStatus === "paid"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        {order.products?.map((p, idx) => {
                          const product = p.product || {};
                          const image =
                            product.images?.[0] ||
                            product.image ||
                            "https://via.placeholder.com/100";

                          return (
                            <div
                              key={idx}
                              className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-5 border-b last:border-0"
                            >
                              {/* Product Info */}
                              <div className="flex items-center gap-5 w-full md:w-2/3">
                                <img
                                  src={image}
                                  alt={product.name || "Product"}
                                  className="w-24 h-24 object-cover rounded-md border"
                                />
                                <div className="flex flex-col justify-center">
                                  <p className="font-medium text-gray-900 text-base">
                                    {product.name || "Product Name"}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Quantity: {p.quantity}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    ₹{product.offerPrice || product.price}
                                  </p>
                                </div>
                              </div>

                              {/* Status & Actions */}
                              <div className="text-center md:text-right w-full md:w-1/3">
                                <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                  Delivered
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  Delivered on {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <Link
                                  to={`/order/${order._id}`}
                                  className="inline-block mt-3 px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  View Details
                                </Link>

                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AiOutlineShopping className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    <AiOutlineShopping />
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab - UPDATED to use Redux */}
          {activeTab === "wishlist" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">My Wishlist</h3>
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex gap-4">
                        <img
                          src={item.images?.[0] || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                          <p className="text-lg font-semibold text-indigo-600 mt-1">₹{item.price}</p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-sm text-gray-500 line-through">₹{item.originalPrice}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link
                          to={`/products/${item._id}`}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium text-center"
                        >
                          View Product
                        </Link>
                        <button
                          onClick={() => removeFromWishlistHandler(item._id)}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AiOutlineHeart className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                  <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                  >
                    <AiOutlineHeart />
                    Explore Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Saved Addresses</h3>
                <button
                  onClick={handleAddAddress}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <AiOutlinePlus />
                  Add New Address
                </button>
              </div>

              {showAddressForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                      <input
                        type="text"
                        name="line1"
                        value={addressForm.line1}
                        onChange={handleAddressFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                      <input
                        type="text"
                        name="line2"
                        value={addressForm.line2}
                        onChange={handleAddressFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                      <select
                        name="label"
                        value={addressForm.label}
                        onChange={handleAddressFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressFormChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Set as default address</label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveAddress}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {profile.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.addresses.map((addr, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 relative">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-semibold text-gray-800 capitalize">{addr.label}</span>
                        <div className="flex gap-2">
                          {addr.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Default
                            </span>
                          )}
                          <button
                            onClick={() => handleEditAddress(idx)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <AiOutlineEdit />
                          </button>
                          <button
                            onClick={() => handleRemoveAddress(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {addr.line1}, {addr.line2 && `${addr.line2}, `}
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">Phone: {addr.phone}</p>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(idx)}
                          className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AiOutlineHome className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600">No saved addresses</p>
                  <p className="text-gray-500 text-sm mt-1">Add your first address above</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h3>
              {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                  message.includes("successfully") 
                    ? "bg-green-100 text-green-800 border border-green-200" 
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile} className="max-w-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;