import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import category1 from "../assets/Categories/category1.jpg";
import category2 from "../assets/Categories/category2.jpg";
import category3 from "../assets/Categories/category3.jpg";
import category4 from "../assets/Categories/category4.jpg";

const categoriesData = [
  {
    title: "Men's Wear",
    description: "Explore the latest collection of shirts, jeans, and formal wear for men.",
    imageSrc: category1,
    link: "mens",
  },
  {
    title: "Women's Fashion",
    description: "Elegant dresses, stylish accessories, and essential items for every woman.",
    imageSrc: category2,
    link: "womens",
  },
  {
    title: "Kids' Collection",
    description: "Fun and durable clothing, toys, and gear for babies and children of all ages.",
    imageSrc: category3,
    link: "kids",
  },
  {
    title: "Beauty & Wellness",
    description: "Premium skincare, makeup, and self-care products to elevate your routine.",
    imageSrc: category4,
    link: "beauty",
  },
];

const CategoryGallery = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect for mobile
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Duplicate items for seamless infinite scroll
    const items = Array.from(container.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      container.appendChild(clone);
    });

    const scrollSpeed = 0.7; // medium speed
    let requestId;

    const animateScroll = () => {
      if (!isPaused) {
        container.scrollLeft -= scrollSpeed;

        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth / 2;
        }
      }
      requestId = requestAnimationFrame(animateScroll);
    };

    requestId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(requestId);
  }, [isPaused]);

  return (
    <section className="py-16">
      <h1 className="text-3xl font-semibold text-center mx-auto">
        Shop by Category
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
        Explore our curated collections for Men, Women, Kids, and Beauty products.
      </p>

      {/* Desktop / Tablet Layout */}
      <div className="hidden md:flex items-center gap-6 h-[400px] w-full max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
        {categoriesData.map((category, index) => (
          <Link
            key={index}
            to={`/shop/${category.link}`}
            className="relative group flex-grow min-w-[200px] h-[400px] overflow-hidden rounded-lg transition-all duration-500 hover:w-full"
          >
            <img
              className="h-full w-full object-cover"
              src={category.imageSrc}
              alt={category.title}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <h1 className="text-xl md:text-2xl font-semibold">{category.title}</h1>
              <p className="text-xs md:text-sm mt-1">{category.description}</p>
              <button className="mt-3 px-3 py-1 border border-white text-xs font-medium hover:bg-white hover:text-black transition-colors">
                SHOP NOW
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Layout with auto-scroll */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex md:hidden gap-4 overflow-hidden px-4 mt-8"
      >
        {categoriesData.map((category, index) => (
          <Link
            key={index}
            to={`/shop/${category.link}`}
            className="min-w-[250px] max-w-[250px] flex-shrink-0 relative rounded-lg overflow-hidden"
          >
            <img
              className="h-48 w-full object-cover"
              src={category.imageSrc}
              alt={category.title}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
              <h2 className="text-lg font-semibold">{category.title}</h2>
              <p className="text-xs mt-1">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGallery;
