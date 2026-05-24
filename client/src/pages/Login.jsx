// PREMIUM ENHANCED LOGIN PAGE
// MODERN + CLEAN + MATCHES YOUR ADISHOP DESIGN
// FULL COPY-PASTE CODE

import React, {
  useContext,
  useState,
} from "react";

import demo_image from "../assets/demo_image.jpg";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  AuthContext,
} from "../context/AuthContext";

import toast from "react-hot-toast";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const apiUrl =
  import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const navigate =
    useNavigate();

  const { login } =
    useContext(AuthContext);

  // LOGIN
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setLoading(true);

      try {
        const response =
          await axios.post(
            `${apiUrl}/users/login`,
            {
              email,
              password,
            }
          );

        login(response.data);

        toast.success(
          "Login successful!"
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
            "Login failed"
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
          src={demo_image}
          alt="login"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />

        {/* CONTENT */}
        <div className="absolute bottom-12 left-12 text-white max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles size={16} />

            Premium Shopping
            Experience
          </div>

          <h1 className="text-5xl font-semibold leading-tight">
            Welcome Back To
            AdiShop
          </h1>

          <p className="mt-5 text-white/80 text-lg leading-relaxed">
            Sign in to continue
            exploring premium
            collections, exclusive
            offers and your
            personalized shopping
            experience.
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
                <ShieldCheck size={24} />
              </div>

              <h2 className="text-4xl font-semibold text-gray-900 tracking-tight mt-6">
                Sign In
              </h2>

              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Login to access your
                AdiShop account and
                continue shopping
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-10 space-y-5"
            >
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
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

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
                    placeholder="Enter your password"
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

              {/* REMEMBER */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-indigo-600 w-4 h-4"
                  />

                  Remember me
                </label>

                <div className="text-xs text-gray-400">
                  Secure Login
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
                  ? "Signing In..."
                  : "Sign In"}
              </motion.button>
            </form>

            {/* FOOTER */}
            <p className="text-center text-gray-500 text-sm mt-7">
              Don’t have an
              account?
              <Link
                to="/signup"
                className="text-indigo-600 font-medium hover:underline ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;