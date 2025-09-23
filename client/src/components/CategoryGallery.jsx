import React from 'react';
import { Link } from 'react-router-dom';
import category1 from '../assets/Categories/category1.jpg';
import category2 from '../assets/Categories/category2.jpg';
import category3 from '../assets/Categories/category3.jpg';
import category4 from '../assets/Categories/category4.jpg';

// Define the data for your four e-commerce categories
const categoriesData = [
    {
        title: "Men's Wear",
        description: "Explore the latest collection of shirts, jeans, and formal wear for men.",
        imageSrc: category1,
        objectPosition: "object-center",
        link: "mens"
    },
    {
        title: "Women's Fashion",
        description: "Elegant dresses, stylish accessories, and essential items for every woman.",
        imageSrc: category2,
        objectPosition: "object-right",
        link: "womens"
    },
    {
        title: "Kids' Collection",
        description: "Fun and durable clothing, toys, and gear for babies and children of all ages.",
        imageSrc: category3,
        objectPosition: "object-center",
        link: "kids"
    },
    {
        title: "Beauty & Wellness",
        description: "Premium skincare, makeup, and self-care products to elevate your routine.",
        imageSrc: category4,
        objectPosition: "object-center",
        link: "beauty"
    },
];

const CategoryGallery = () => {
    return (
        <section className="py-16">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                    * { font-family: 'Poppins', sans-serif; }
                `}
            </style>
            
            <h1 className="text-3xl font-semibold text-center mx-auto">Shop by Category</h1>
            <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">
                Explore our curated collections for Men, Women, Kids, and Beauty products.
            </p>

            <div className="flex items-center gap-6 h-[400px] w-full max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
                {categoriesData.map((category, index) => (
                    <Link 
                        key={index} 
                        to={`/shop/${category.link}`}
                        className="relative group flex-grow transition-all min-w-[100px] h-[400px] duration-500 hover:w-full"
                    >
                        <img 
                            className={`h-full w-full object-cover ${category.objectPosition}`}
                            src={category.imageSrc}
                            alt={category.title}
                        />
                        <div
                            className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                            <h1 className="text-xl md:text-3xl font-semibold">{category.title}</h1>
                            <p className="text-xs md:text-sm mt-1">{category.description}</p>
                            <button className="mt-3 self-start text-xs font-medium border border-white px-3 py-1 hover:bg-white hover:text-black transition-colors">
                                SHOP NOW
                            </button>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 p-4 text-white bg-black/40 group-hover:hidden transition-opacity">
                            <h2 className="text-lg font-medium">{category.title}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryGallery;
