import React from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero-image.jpg";

const Hero = () => {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-screen text-center text-white px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${hero})` }}
    >
      {/* Community Preview */}
      <div className="flex items-center justify-center gap-2 px-3 py-1.5 mt-24 md:mt-28 rounded-full border border-slate-400 text-xs bg-black/30 backdrop-blur-sm">
        <div className="flex -space-x-2">
          <img
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
            alt="user1"
          />
          <img
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
            alt="user2"
          />
          <img
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-white"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50"
            alt="user3"
          />
        </div>
        <p className="whitespace-nowrap text-xs sm:text-sm">
          Join a community of 1M+ shoppers
        </p>
      </div>

      {/* Headline */}
      <h1 className="font-berkshire text-3xl sm:text-4xl md:text-6xl leading-tight mt-6 max-w-3xl px-2">
        Discover the Best Products Online
      </h1>
      <p className="text-sm sm:text-base mt-3 max-w-xl px-2">
        Browse our wide selection of electronics, fashion, and home essentials.
      </p>
      <p className="text-sm sm:text-base mt-2 md:mt-4 max-w-xl px-2">
        Get exclusive deals and limited-time offers. Shop now and save!
      </p>

      {/* Email / CTA Form */}
      <form className="flex flex-col sm:flex-row items-stretch mt-8 w-full max-w-md gap-3">
        <input
          type="email"
          placeholder="Enter your email for updates & deals"
          className="flex-1 h-12 outline-none bg-white/20 px-4 text-white placeholder:text-slate-200 rounded-full sm:rounded-l-full sm:rounded-r-none"
        />
        <Link
          to="/products"
          className="bg-white text-slate-800 hover:bg-gray-300 px-6 h-12 rounded-full sm:rounded-r-full sm:rounded-l-none font-medium transition flex items-center justify-center whitespace-nowrap"
        >
          Shop Now
        </Link>
      </form>
    </section>
  );
};

export default Hero;
