import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import hero from "../assets/hero-image.webp";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <section
      className="flex flex-col items-center text-center text-white max-md:px-2 bg-cover bg-center"
      style={{
        backgroundImage: `url(${hero})`,
        paddingBottom: "12rem",
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

      {/* Main Search Bar - Fixed Alignment */}
      <form 
        onSubmit={handleSearch} 
        className="mt-8 w-full max-w-2xl px-4"
      >
        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full overflow-hidden hover:border-white/50 transition-colors duration-200">
          <div className="pl-5 pr-3 flex items-center justify-center">
            <FaSearch size={20} className="text-white/70" />
          </div>
          <input
            type="text"
            placeholder="Search for products, brands, and categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 py-4 bg-transparent text-white placeholder:text-white/70 focus:outline-none text-base md:text-lg"
          />
          <button
            type="submit"
            className="bg-white text-slate-800 hover:bg-gray-100 px-6 md:px-8 py-4 font-medium transition-colors duration-200 whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {["Smartphones", "Laptops", "Shoes", "Watches", "Headphones", "Cameras"].map((item) => (
          <button
            key={item}
            onClick={() => {
              navigate(`/search?q=${encodeURIComponent(item)}`);
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-colors duration-200 border border-white/30"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Shop Now Button */}
      <button
        onClick={() => navigate('/products')}
        className="mt-8 bg-white text-slate-800 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors duration-200"
      >
        Browse All Products
      </button>
    </section>
  );
};

export default Hero;