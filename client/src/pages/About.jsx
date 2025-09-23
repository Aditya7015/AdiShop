import React from 'react';
import img13 from '../assets/img13.jpg'

const About = () => {
    return (
        <div className="bg-gray-100 py-12 font-sans text-gray-800">
            {/* Main Header Section */}
            <div className="container mx-auto px-4 py-8 text-center max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Our Story</h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                    AdiShop was founded on a simple belief: that quality fashion should be accessible to everyone. We're more than just a store—we're a community built around style, comfort, and authenticity.
                </p>
            </div>
            
            {/* Content Section with Image */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 p-4">
                        <img 
                            src={img13}
                            alt="Stylish clothes on display in a modern store" 
                            className="rounded-3xl shadow-2xl w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    
                    {/* Text Content */}
                    <div className="w-full md:w-1/2 p-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                        <p className="mb-4 leading-relaxed text-lg">
                            We curate a collection of timeless pieces and modern essentials, focusing on high-quality materials and sustainable practices. Each item is chosen with care, ensuring it meets our standards for durability and design. Our goal is to help you build a wardrobe that feels effortless, stylish, and uniquely yours.
                        </p>
                        <p className="leading-relaxed text-lg">
                            From the initial design to the final delivery, we are committed to transparency and exceptional customer service. We believe in building trust with our customers by providing a seamless shopping experience and products you'll love for years to come.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Values Section */}
            <div className="bg-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Value Card 1 */}
                        <div className="p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                            <span className="text-5xl mb-4 inline-block">✨</span>
                            <h3 className="text-xl font-bold mb-2">Quality Craftsmanship</h3>
                            <p className="text-gray-600">Every product is made with attention to detail and a commitment to excellence.</p>
                        </div>
                        {/* Value Card 2 */}
                        <div className="p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                            <span className="text-5xl mb-4 inline-block">🌱</span>
                            <h3 className="text-xl font-bold mb-2">Sustainable Style</h3>
                            <p className="text-gray-600">We prioritize eco-friendly materials and ethical production methods.</p>
                        </div>
                        {/* Value Card 3 */}
                        <div className="p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                            <span className="text-5xl mb-4 inline-block">🤝</span>
                            <h3 className="text-xl font-bold mb-2">Customer First</h3>
                            <p className="text-gray-600">Your satisfaction is our top priority. We're here to help every step of the way.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="container mx-auto px-4 py-12 text-center max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the AdiShop Family</h2>
                <p className="text-lg text-gray-600 mb-6">
                    We invite you to explore our latest collections and find your new favorite pieces.
                </p>
                <button className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform duration-200 hover:scale-105">
                    Shop Now
                </button>
            </div>
        </div>
    );
};

export default About;
