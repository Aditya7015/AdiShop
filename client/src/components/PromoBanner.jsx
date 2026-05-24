import React from 'react'

const PromoBanner = () => {
    return (
        <div className="md:grid md:grid-cols-2 max-w-4xl bg-white mx-4 md:mx-auto rounded-xl mb-12">
            <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/promotional/image.png"
                alt="promotional" className="hidden md:block w-full max-w-lg rounded-l-xl" />
            <div className="relative flex items-center justify-center">
                <button className="absolute top-6 right-6 bg-gray-200 rounded-full p-2.5" aria-label="Close">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2 2 13M2 2l11 11" stroke="#1F2937" strokeOpacity=".7" strokeWidth="3"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="max-md:py-20 px-6 md:px-10 text-center">
                    <h1 className="text-3xl font-bold">
                        <span className="text-blue-600">Don't miss out</span> on our discounted products.
                    </h1>
                    <p className="mt-4 text-gray-500">
                        Don't miss out on amazing discounts—shop now before they're gone!
                    </p>
                    <button className="rounded-lg bg-blue-600 text-sm px-14 py-3 mt-4 text-white">
                        Check out the products
                    </button>
                    <button className="px-8 py-3 mt-4 text-sm text-gray-800">
                        No thanks, I don't want the discounts.
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromoBanner