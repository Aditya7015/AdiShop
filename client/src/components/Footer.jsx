import React from "react";

import { Link } from "react-router-dom";

import logo from "../assets/logo/logo.png";

import {
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCcVisa,
  FaCcPaypal,
  FaCcMastercard,
} from "react-icons/fa";

import {
  ShieldCheck,
  Truck,
  Headphones,
  RotateCcw,
} from "lucide-react";

import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      icon: <FaTwitter size={18} />,
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <FaInstagram size={18} />
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (
        <FaLinkedinIn size={18} />
      ),
    },
  ];

  const features = [
    {
      title:
        "Secure Payments",
      icon: (
        <ShieldCheck
          size={22}
        />
      ),
    },
    {
      title: "Fast Delivery",
      icon: (
        <Truck size={22} />
      ),
    },
    {
      title: "24/7 Support",
      icon: (
        <Headphones
          size={22}
        />
      ),
    },
    {
      title:
        "Easy Returns",
      icon: (
        <RotateCcw
          size={22}
        />
      ),
    },
  ];

  return (
    <footer className="relative bg-[#0b1020] text-gray-300 overflow-hidden">
      {/* BG GLOW */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 blur-[120px]" />

      {/* TRUST SECTION */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          {features.map(
            (
              feature,
              index
            ) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -4,
                }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                  {
                    feature.icon
                  }
                </div>

                <div>
                  <h3 className="font-medium text-white text-sm">
                    {
                      feature.title
                    }
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Premium Service
                  </p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* BRAND */}
          <div className="lg:col-span-2">
            {/* LOGO */}
            <img
              src={logo}
              alt="AdiShop"
              className="h-14 w-auto object-contain"
            />

            <p className="mt-6 text-gray-400 leading-relaxed max-w-md text-sm">
              AdiShop brings
              premium fashion,
              lifestyle and
              trending products
              with modern shopping
              experience and fast
              delivery.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-8">
              {socialLinks.map(
                (
                  link,
                  index
                ) => (
                  <motion.a
                    whileHover={{
                      y: -4,
                      scale: 1.05,
                    }}
                    key={index}
                    href={
                      link.href
                    }
                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-lg"
                  >
                    {link.icon}
                  </motion.a>
                )
              )}
            </div>

            {/* PAYMENTS */}
            <div className="mt-10">
              <h3 className="text-white font-medium mb-4">
                Payment Methods
              </h3>

              <div className="flex items-center gap-4 text-4xl text-gray-400">
                <FaCcVisa />
                <FaCcPaypal />
                <FaCcMastercard />
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h2 className="font-semibold text-white text-lg mb-6">
              Company
            </h2>

            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-all duration-300"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-all duration-300"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/myorders"
                  className="hover:text-white transition-all duration-300"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-white transition-all duration-300"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* SHOP */}
          <div>
            <h2 className="font-semibold text-white text-lg mb-6">
              Shop
            </h2>

            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/shop/mens"
                  className="hover:text-white transition-all duration-300"
                >
                  Men
                </Link>
              </li>

              <li>
                <Link
                  to="/shop/womens"
                  className="hover:text-white transition-all duration-300"
                >
                  Women
                </Link>
              </li>

              <li>
                <Link
                  to="/shop/kids"
                  className="hover:text-white transition-all duration-300"
                >
                  Kids
                </Link>
              </li>

              <li>
                <Link
                  to="/shop/beauty"
                  className="hover:text-white transition-all duration-300"
                >
                  Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h2 className="font-semibold text-white text-lg mb-6">
              Stay Updated
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Subscribe to get
              latest offers,
              trending products &
              exclusive deals.
            </p>

            {/* INPUT */}
            <div className="mt-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg hover:scale-105 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>

            {/* TAG */}
            <div className="mt-5 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-gray-400">
              🔥 12k+ people already
              subscribed
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-14 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-8">
          <p className="text-sm text-gray-500 text-center md:text-left">
            ©{" "}
            {new Date().getFullYear()}{" "}
            AdiShop. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link
              to="/privacy"
              className="hover:text-white transition-all duration-300"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-white transition-all duration-300"
            >
              Terms
            </Link>

            <Link
              to="/contact"
              className="hover:text-white transition-all duration-300"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;