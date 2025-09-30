import React from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero-image.webp";

const Hero = () => {
  return (
    <section
      className="flex flex-col items-center text-center text-white max-md:px-2 bg-cover bg-center"
      style={{
        backgroundImage: `url(${hero})`,
        paddingBottom: "12rem", // extra padding for mobile navbar
      }}
    >
      {/* Community Preview */}
      <div className="flex flex-wrap items-center justify-center p-1.5 mt-24 md:mt-28 rounded-full border border-slate-400 text-xs">
        <div className="flex items-center">
          <img
            className="h-7 w-7 rounded-full border-2 border-white"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
            alt="user1"
          />
          <img
            className="h-7 w-7 rounded-full border-2 border-white -translate-x-2"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
            alt="user2"
          />
          <img
            className="h-7 w-7 rounded-full border-2 border-white -translate-x-4"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
            alt="user3"
          />
        </div>
        <p className="-translate-x-2">Join a community of 1M+ shoppers</p>
      </div>

      {/* Headline */}
      <h1 className="font-berkshire text-[45px]/[52px] md:text-6xl/[65px] mt-6 max-w-4xl">
        Discover the Best Products Online
      </h1>
      <p className="text-base mt-2 max-w-xl">
        Browse our wide selection of electronics, fashion, and home essentials.
      </p>
      <p className="text-base mt-3 md:mt-7 max-w-xl">
        Get exclusive deals and limited-time offers. Shop now and save!
      </p>

      {/* Email / CTA Form */}
      <form className="flex items-center mt-8 max-w-lg h-16 w-full rounded-full border border-slate-50">
        <input
          type="email"
          placeholder="Enter your email for updates & deals"
          className="w-full h-full outline-none bg-transparent pl-6 pr-2 text-white placeholder:text-slate-300 rounded-full"
        />
        <Link
          to="/products"
          className="bg-white text-slate-800 hover:bg-gray-300 text-nowrap px-8 md:px-10 h-12 mr-2 rounded-full font-medium transition flex items-center justify-center"
        >
          Shop Now
        </Link>
      </form>
    </section>
  );
};

export default Hero;
