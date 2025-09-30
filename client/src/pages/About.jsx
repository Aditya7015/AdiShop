import React from 'react';
import img13 from '../assets/img13.jpg';

const About = () => {
  return (
    <div className="bg-gray-100 font-sans text-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 text-center max-w-4xl bg-gradient-to-r from-indigo-50 via-white to-pink-50 rounded-3xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">Our Story</h1>
        <p className="text-indigo-600 text-lg mb-4 italic">Fashion, comfort, and style for everyone.</p>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          AdiShop was founded on a simple belief: that quality fashion should be accessible to everyone. 
          We're more than just a store—we're a community built around style, comfort, and authenticity.
        </p>
      </div>

      {/* Image + Mission Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          <div className="w-full md:w-1/2 p-4 relative">
            <img 
              src={img13} 
              alt="Stylish clothes on display" 
              className="rounded-3xl shadow-2xl w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              500+ Products
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 p-4 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Mission</h2>
            <p className="leading-relaxed text-lg">
              We curate a collection of timeless pieces and modern essentials, focusing on high-quality materials and sustainable practices. 
              Each item is chosen with care, ensuring it meets our standards for durability and design.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>High-quality, stylish clothing for everyone</li>
              <li>Ethically sourced and eco-friendly materials</li>
              <li>Comfort and inclusivity in every product</li>
            </ul>
            <p className="leading-relaxed text-lg">
              From the design to delivery, we are committed to transparency and exceptional customer service. 
              We believe in building trust by providing a seamless shopping experience.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-transform transform hover:scale-105">
              <span className="text-6xl mb-4 inline-block text-indigo-500">✨</span>
              <h3 className="text-xl font-bold mb-2">Quality Craftsmanship</h3>
              <p className="text-gray-600">Every product is made with attention to detail and a commitment to excellence.</p>
            </div>
            <div className="p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-transform transform hover:scale-105">
              <span className="text-6xl mb-4 inline-block text-green-500">🌱</span>
              <h3 className="text-xl font-bold mb-2">Sustainable Style</h3>
              <p className="text-gray-600">We prioritize eco-friendly materials and ethical production methods.</p>
            </div>
            <div className="p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-transform transform hover:scale-105">
              <span className="text-6xl mb-4 inline-block text-yellow-500">🤝</span>
              <h3 className="text-xl font-bold mb-2">Customer First</h3>
              <p className="text-gray-600">Your satisfaction is our top priority. We're here to help every step of the way.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Founder</h2>
        <p className="text-lg text-gray-600 mb-6">
          AdiShop was built and founded by <span className="font-semibold text-indigo-600">Aditya Tiwari</span>, who envisioned a platform 
          that combines style, quality, and accessibility for all fashion lovers.
        </p>
      </div>

      {/* Call to Action Section */}
      <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the AdiShop Family</h2>
        <p className="text-lg text-gray-600 mb-2">
          Explore our latest collections and find your new favorite pieces.
        </p>
        <p className="text-sm text-gray-400 mb-6">Join 10,000+ happy shoppers today</p>
        <button className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-indigo-700">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default About;
