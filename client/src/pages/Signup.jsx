// PREMIUM ENHANCED SIGNUP PAGE
// MODERN + CLEAN + MATCHES YOUR ADISHOP DESIGN
// FULL COPY-PASTE CODE

import React, {
  useState,
  useContext,
} from "react";

import demo_image2 from "../assets/demo_image2.jpg";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  toast,
} from "react-hot-toast";

import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";

const apiUrl =
  import.meta.env.VITE_API_URL;

const Signup = () => {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("customer");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const { login } =
    useContext(AuthContext);

  // SUBMIT
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setLoading(true);

      try {
        const response =
          await axios.post(
            `${apiUrl}/users/register`,
            {
              name,
              email,
              password,
              role,
            }
          );

        localStorage.setItem(
          "userData",
          JSON.stringify(
            response.data
          )
        );

        localStorage.setItem(
          "userToken",
          response.data.token
        );

        login(response.data);

        toast.success(
          "Account created successfully!"
        );

        navigate("/");
      } catch (err) {
        console.error(
          err.response?.data
            ?.message ||
            err.message
        );

        toast.error(
          err.response?.data
            ?.message ||
            "Signup failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex overflow-hidden">
      {/* LEFT IMAGE */}
      <div className="hidden lg:block lg:w-[52%] relative overflow-hidden">
        <img
          className="h-full w-full object-cover"
          src={demo_image2}
          alt="signup"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        {/* CONTENT */}
        <div className="absolute bottom-12 left-12 text-white max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles size={16} />

            Premium Shopping
            Experience
          </div>

          <h1 className="text-5xl font-semibold leading-tight">
            Discover Fashion
            That Defines You
          </h1>

          <p className="mt-5 text-white/80 text-lg leading-relaxed">
            Join AdiShop and
            explore premium
            collections, trending
            styles and exclusive
            offers.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="w-full max-w-md"
        >
          {/* CARD */}
          <div className="bg-white rounded-[34px] border border-gray-100 shadow-xl p-8 md:p-10">
            {/* HEADER */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                <Sparkles size={24} />
              </div>

              <h2 className="text-4xl font-semibold text-gray-900 tracking-tight mt-6">
                Create Account
              </h2>

              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Join AdiShop and
                start your premium
                shopping experience
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-10 space-y-5"
            >
              {/* NAME */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    required
                    value={name}
                    onChange={(
                      e
                    ) =>
                      setName(
                        e.target
                          .value
                      )
                    }
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    required
                    value={email}
                    onChange={(
                      e
                    ) =>
                      setEmail(
                        e.target
                          .value
                      )
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create password"
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    required
                    value={
                      password
                    }
                    onChange={(
                      e
                    ) =>
                      setPassword(
                        e.target
                          .value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Account Type
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 appearance-none"
                    value={role}
                    onChange={(
                      e
                    ) =>
                      setRole(
                        e.target
                          .value
                      )
                    }
                  >
                    <option value="customer">
                      Customer
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                type="submit"
                disabled={
                  loading
                }
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 mt-3"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </motion.button>
            </form>

            {/* LOGIN */}
            <p className="text-center text-gray-500 text-sm mt-7">
              Already have an
              account?
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;