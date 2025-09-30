import React from 'react';

const Contact = () => {
    return (
        <div className="bg-gray-100 font-sans text-gray-800">

            {/* Hero Section */}
            <div className="text-center py-16 bg-gradient-to-r from-indigo-50 via-white to-pink-50 rounded-b-3xl shadow-md">
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4">Get In Touch</h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                    We'd love to hear from you. Whether you have a question about our products, a partnership inquiry, or just want to say hello.
                </p>
            </div>

            {/* Form & Contact Section */}
            <div className="container mx-auto px-4 py-16 max-w-6xl flex flex-col md:flex-row gap-12">
                
                {/* Contact Form */}
                <div className="flex-1 bg-white p-8 md:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <h2 className="text-3xl font-bold text-indigo-900 mb-6">Send Us a Message</h2>
                    <form className="space-y-6">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-900 focus:ring-1 focus:ring-indigo-900 transition duration-300"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-900 focus:ring-1 focus:ring-indigo-900 transition duration-300"
                        />
                        <textarea
                            rows="5"
                            placeholder="Your Message..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-900 focus:ring-1 focus:ring-indigo-900 transition duration-300"
                        ></textarea>
                        <button
                            type="submit"
                            className="w-full bg-indigo-900 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                        <h2 className="text-3xl font-bold text-indigo-900 mb-6">Our Details</h2>
                        <div className="space-y-4 text-lg text-gray-700">
                            <div className="flex items-center gap-3">
                                <span className="text-indigo-900 text-xl">📧</span>
                                <a href="mailto:contact@adishop.com" className="hover:underline">contact@adishop.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-indigo-900 text-xl">📞</span>
                                <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-indigo-900 text-xl">📍</span>
                                <p>
                                    123 Fashion Blvd,<br/>
                                    Suite 100,<br/>
                                    Style City, ST 90210
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-white p-6 rounded-3xl shadow-2xl hover:shadow-3xl flex items-center justify-center gap-6 transition-shadow duration-300">
                        <a href="#" className="text-indigo-900 text-2xl hover:text-indigo-700 transition-colors">🐦</a>
                        <a href="#" className="text-indigo-900 text-2xl hover:text-indigo-700 transition-colors">📸</a>
                        <a href="#" className="text-indigo-900 text-2xl hover:text-indigo-700 transition-colors">💼</a>
                    </div>
                </div>
            </div>

            {/* Call-to-Action */}
            <div className="bg-indigo-900 py-16 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore Our Collections?</h2>
                <p className="text-lg mb-6">Discover your next favorite outfit at AdiShop!</p>
                <button className="bg-white text-indigo-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 hover:bg-gray-100 transition-transform">
                    Shop Now
                </button>
            </div>
        </div>
    );
};

export default Contact;
