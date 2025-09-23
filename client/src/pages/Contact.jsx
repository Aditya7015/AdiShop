import React from 'react';

const Contact = () => {
    return (
        <div className="bg-gray-100 py-12 font-sans text-gray-800">
            {/* Main Header Section */}
            <div className="container mx-auto px-4 py-8 text-center max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Get In Touch</h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                    We'd love to hear from you. Whether you have a question about our products, a partnership inquiry, or just want to say hello, we're here to help.
                </p>
            </div>
            
            {/* Contact Form and Info Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-start gap-12 max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
                    {/* Contact Form Section */}
                    <div className="w-full md:w-2/3">
                        <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="your-email@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors duration-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Message
                                </label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows="5" 
                                    placeholder="Type your message here..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors duration-300"
                                ></textarea>
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-gray-900 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Details Section */}
                    <div className="w-full md:w-1/3">
                        <h2 className="text-3xl font-bold mb-6">Our Details</h2>
                        <div className="space-y-4 text-lg">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600">📧</span>
                                <a href="mailto:contact@adishop.com" className="text-gray-800 hover:underline">contact@adishop.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600">📞</span>
                                <a href="tel:+1234567890" className="text-gray-800 hover:underline">+1 (234) 567-890</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-gray-600">📍</span>
                                <p className="text-gray-800">123 Fashion Blvd,<br/>Suite 100,<br/>Style City, ST 90210</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
