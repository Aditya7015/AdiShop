// PREMIUM ENHANCED PROFILE PAGE
// FULL COPY-PASTE CODE

import React, {
  useState,
  useEffect,
  useContext,
} from "react";

import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  removeFromWishlist,
  fetchWishlist,
} from "../redux/wishlistSlice";

import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineShopping,
  AiOutlineHeart,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlinePlus,
} from "react-icons/ai";

import {
  ShoppingBag,
  MapPin,
  Package,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import default_icon from "../assets/users/default_icon.jpg";

const ProfilePage = () => {
  const { user } =
    useContext(AuthContext);

  const token =
    user?.token;

  const dispatch =
    useDispatch();

  const BASE_URL =
    import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] =
    useState("overview");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [orders, setOrders] =
    useState([]);

  const [avatar, setAvatar] =
    useState(null);

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      phone: "",
      bio: "",
      avatarUrl: "",
      addresses: [],
      joinedAt: "",
    });

  const {
    items: wishlist,
  } = useSelector(
    (state) => state.wishlist
  );

  // FETCH PROFILE
  const fetchProfile =
    async () => {
      try {
        const res =
          await fetch(
            `${BASE_URL}/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setProfile({
          name: data.name,
          email: data.email,
          phone:
            data.phone ||
            "",
          bio:
            data.bio || "",
          avatarUrl:
            data.avatarUrl ||
            "",
          addresses:
            data.addresses ||
            [],
          joinedAt:
            new Date(
              data.createdAt
            ).toLocaleDateString(),
        });
      } catch (err) {
        console.log(err);
      }
    };

  // FETCH ORDERS
  const fetchOrders =
    async () => {
      try {
        const res =
          await fetch(
            `${BASE_URL}/orders/user/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setOrders(
          data.orders || []
        );
      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    if (token) {
      fetchProfile();

      dispatch(
        fetchWishlist(token)
      );

      fetchOrders();
    }
  }, [token]);

  // UPDATE PROFILE
  const handleChange = (
    e
  ) => {
    setProfile({
      ...profile,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleAvatarChange =
    (e) => {
      setAvatar(
        e.target.files[0]
      );
    };

  const handleUpdateProfile =
    async (e) => {
      e.preventDefault();

      setLoading(true);

      setMessage("");

      try {
        const formData =
          new FormData();

        formData.append(
          "name",
          profile.name
        );

        formData.append(
          "phone",
          profile.phone
        );

        formData.append(
          "bio",
          profile.bio
        );

        formData.append(
          "addresses",
          JSON.stringify(
            profile.addresses
          )
        );

        if (avatar) {
          formData.append(
            "avatar",
            avatar
          );
        }

        const res =
          await fetch(
            `${BASE_URL}/users/profile`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );

        const data =
          await res.json();

        if (data.user) {
          setProfile(
            (prev) => ({
              ...prev,
              ...data.user,
            })
          );

          setMessage(
            "Profile updated successfully!"
          );
        } else {
          setMessage(
            "Update failed"
          );
        }
      } catch (err) {
        console.log(err);

        setMessage(
          "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  const removeWishlistItem =
    async (id) => {
      try {
        await dispatch(
          removeFromWishlist(
            {
              productId: id,
              token,
            }
          )
        ).unwrap();
      } catch (err) {
        console.log(err);
      }
    };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <AiOutlineUser />
      ),
    },
    {
      id: "orders",
      label: "Orders",
      icon: (
        <AiOutlineShopping />
      ),
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: (
        <AiOutlineHeart />
      ),
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: (
        <AiOutlineHome />
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <AiOutlineSetting />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HERO */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 shadow-2xl"
        >
          {/* GLOW */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 blur-[120px]" />

          <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
            {/* AVATAR */}
            <div className="relative">
              <img
                src={
                  profile.avatarUrl ||
                  default_icon
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-2xl"
              />

              <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <AiOutlineEdit className="text-indigo-600 text-lg" />
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tight">
                  {
                    profile.name
                  }
                </h1>

                <div className="bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-sm">
                  Premium Member
                </div>
              </div>

              <p className="mt-3 text-white/80 text-lg">
                {
                  profile.email
                }
              </p>

              <p className="mt-2 text-white/70 max-w-2xl">
                {profile.bio ||
                  "Welcome to your AdiShop account dashboard."}
              </p>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">
                  <p className="text-sm text-white/70">
                    Orders
                  </p>

                  <h3 className="text-2xl font-semibold">
                    {
                      orders.length
                    }
                  </h3>
                </div>

                <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">
                  <p className="text-sm text-white/70">
                    Wishlist
                  </p>

                  <h3 className="text-2xl font-semibold">
                    {
                      wishlist.length
                    }
                  </h3>
                </div>

                <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl">
                  <p className="text-sm text-white/70">
                    Addresses
                  </p>

                  <h3 className="text-2xl font-semibold">
                    {
                      profile
                        .addresses
                        .length
                    }
                  </h3>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() =>
                setActiveTab(
                  "settings"
                )
              }
              className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-medium shadow-xl hover:scale-105 transition-all duration-300"
            >
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* TABS */}
        <div className="mt-8 bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id
                  )
                }
                className={`flex items-center gap-3 px-6 py-5 transition-all duration-300 min-w-max ${
                  activeTab ===
                  tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">
                  {tab.icon}
                </span>

                <span className="font-medium">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-8 bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8">
          {/* OVERVIEW */}
          {activeTab ===
            "overview" && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-lg">
                  <Sparkles size={22} />
                </div>

                <div>
                  <h2 className="text-3xl font-semibold text-gray-900">
                    Account Overview
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Manage your
                    AdiShop account
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6"
                >
                  <Package className="text-indigo-600 mb-4" />

                  <h3 className="text-lg font-semibold text-gray-900">
                    Orders
                  </h3>

                  <p className="text-4xl font-semibold text-indigo-600 mt-4">
                    {
                      orders.length
                    }
                  </p>

                  <p className="text-gray-500 mt-2">
                    Total Orders
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-3xl p-6"
                >
                  <AiOutlineHeart className="text-pink-600 text-3xl mb-4" />

                  <h3 className="text-lg font-semibold text-gray-900">
                    Wishlist
                  </h3>

                  <p className="text-4xl font-semibold text-pink-600 mt-4">
                    {
                      wishlist.length
                    }
                  </p>

                  <p className="text-gray-500 mt-2">
                    Saved Products
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-6"
                >
                  <MapPin className="text-green-600 mb-4" />

                  <h3 className="text-lg font-semibold text-gray-900">
                    Addresses
                  </h3>

                  <p className="text-4xl font-semibold text-green-600 mt-4">
                    {
                      profile
                        .addresses
                        .length
                    }
                  </p>

                  <p className="text-gray-500 mt-2">
                    Saved Addresses
                  </p>
                </motion.div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab ===
            "orders" && (
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                My Orders
              </h2>

              {orders.length >
              0 ? (
                <div className="space-y-6">
                  {orders.map(
                    (
                      order
                    ) => (
                      <div
                        key={
                          order._id
                        }
                        className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Order ID
                            </p>

                            <h3 className="font-semibold text-gray-900">
                              {order._id}
                            </h3>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">
                              Amount
                            </p>

                            <h3 className="font-semibold text-indigo-600">
                              ₹
                              {
                                order.amount
                              }
                            </h3>
                          </div>
                        </div>

                        <div className="p-6">
                          {order.products?.map(
                            (
                              p,
                              idx
                            ) => (
                              <div
                                key={
                                  idx
                                }
                                className="flex items-center gap-5 border-b last:border-0 py-5"
                              >
                                <img
                                  src={
                                    p
                                      .product
                                      ?.images?.[0]
                                  }
                                  alt=""
                                  className="w-24 h-24 rounded-2xl object-cover"
                                />

                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">
                                    {
                                      p
                                        .product
                                        ?.name
                                    }
                                  </h3>

                                  <p className="text-gray-500 mt-2">
                                    Qty:{" "}
                                    {
                                      p.quantity
                                    }
                                  </p>
                                </div>

                                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                  Delivered
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <ShoppingBag className="mx-auto text-gray-300 mb-5" size={60} />

                  <h3 className="text-2xl font-semibold text-gray-900">
                    No Orders Yet
                  </h3>

                  <p className="text-gray-500 mt-3">
                    Start shopping now
                  </p>

                  <Link
                    to="/products"
                    className="inline-flex mt-8 px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg"
                  >
                    Explore Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {activeTab ===
            "wishlist" && (
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                Wishlist
              </h2>

              {wishlist.length >
              0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlist.map(
                    (
                      item
                    ) => (
                      <motion.div
                        whileHover={{
                          y: -5,
                        }}
                        key={
                          item._id
                        }
                        className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={
                            item
                              .images?.[0]
                          }
                          alt=""
                          className="w-full h-64 object-cover"
                        />

                        <div className="p-5">
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                            {
                              item.name
                            }
                          </h3>

                          <p className="text-indigo-600 text-2xl font-semibold mt-4">
                            ₹
                            {
                              item.price
                            }
                          </p>

                          <div className="flex gap-3 mt-5">
                            <Link
                              to={`/products/${item._id}`}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl text-center font-medium"
                            >
                              View Product
                            </Link>

                            <button
                              onClick={() =>
                                removeWishlistItem(
                                  item._id
                                )
                              }
                              className="w-14 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 transition-all duration-300"
                            >
                              <AiOutlineDelete size={20} className="mx-auto" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <AiOutlineHeart className="mx-auto text-gray-300 text-6xl mb-5" />

                  <h3 className="text-2xl font-semibold text-gray-900">
                    Wishlist Empty
                  </h3>
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES */}
          {activeTab ===
            "addresses" && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
                <h2 className="text-3xl font-semibold text-gray-900">
                  Saved Addresses
                </h2>

                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                  <AiOutlinePlus />

                  Add Address
                </button>
              </div>

              {profile.addresses
                .length >
              0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.addresses.map(
                    (
                      addr,
                      idx
                    ) => (
                      <motion.div
                        whileHover={{
                          y: -4,
                        }}
                        key={
                          idx
                        }
                        className="border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium capitalize">
                              {
                                addr.label
                              }
                            </div>

                            <p className="text-gray-700 mt-5 leading-relaxed">
                              {
                                addr.line1
                              }
                              ,{" "}
                              {
                                addr.city
                              }
                              ,{" "}
                              {
                                addr.state
                              }
                            </p>

                            <p className="text-gray-500 mt-2">
                              {
                                addr.phone
                              }
                            </p>
                          </div>

                          <button className="text-indigo-600">
                            <AiOutlineEdit size={20} />
                          </button>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <MapPin className="mx-auto text-gray-300 mb-5" size={60} />

                  <h3 className="text-2xl font-semibold text-gray-900">
                    No Saved Addresses
                  </h3>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeTab ===
            "settings" && (
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                Edit Profile
              </h2>

              {message && (
                <div className="mb-6 px-5 py-4 rounded-2xl bg-green-50 text-green-700 border border-green-100">
                  {message}
                </div>
              )}

              <form
                onSubmit={
                  handleUpdateProfile
                }
                className="space-y-6 max-w-3xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    value={
                      profile.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Full Name"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={
                      profile.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Phone Number"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <textarea
                  rows="5"
                  name="bio"
                  value={
                    profile.bio
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Tell us about yourself..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleAvatarChange
                  }
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200"
                />

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  {loading
                    ? "Updating..."
                    : "Update Profile"}
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