import React from 'react';

// This is the main App component that serves as the footer.
// All styles are implemented using Tailwind CSS for a modern and responsive design.
// This single-file component includes all necessary code for a complete footer.
const Footer = () => {
    // A list of social media links to render as icons. You can customize these.
    const socialLinks = [
        { name: 'Twitter', href: '#', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.898-.957-2.179-1.55-3.619-1.55-2.724 0-4.925 2.201-4.925 4.925 0 .385.044.755.127 1.107-4.093-.205-7.728-2.164-10.165-5.132-.423.729-.665 1.579-.665 2.487 0 1.708.868 3.216 2.196 4.092-.806-.026-1.565-.246-2.228-.614v.061c0 2.385 1.693 4.373 3.946 4.827-.412.114-.844.174-1.284.174-.314 0-.616-.03-.912-.088.629 1.956 2.45 3.384 4.63 3.428-1.688 1.328-3.811 2.126-6.102 2.126-.398 0-.79-.023-1.176-.069 2.179 1.398 4.76 2.215 7.55 2.215 9.058 0 14.008-7.498 14.008-14.009 0-.213-.005-.426-.013-.637.961-.694 1.799-1.561 2.463-2.549z" /></svg>
        )},
        { name: 'Instagram', href: '#', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.07 4.85-.07zm0-2.163c-3.633 0-4.06.016-5.474.085-4.521.205-6.845 2.529-7.05 7.05-.069 1.414-.085 1.841-.085 5.474 0 3.633.016 4.06.085 5.474.205 4.522 2.529 6.845 7.05 7.05 1.414.069 1.841.085 5.474.085 3.633 0 4.06-.016 5.474-.085 4.522-.205 6.845-2.529 7.05-7.05.069-1.414.085-1.841.085-5.474 0-3.633-.016-4.06-.085-5.474-.205-4.521-2.529-6.845-7.05-7.05-1.414-.069-1.841-.085-5.474-.085zm0 6.602c-2.75 0-4.998 2.248-4.998 4.998s2.248 4.998 4.998 4.998 4.998-2.248 4.998-4.998-2.248-4.998-4.998-4.998zm0 8.096c-1.71 0-3.098-1.388-3.098-3.098s1.388-3.098 3.098-3.098 3.098 1.388 3.098 3.098-1.388 3.098-3.098 3.098zm6.54-12.016c0 .825-.67 1.494-1.495 1.494s-1.495-.669-1.495-1.494c0-.825.67-1.494 1.495-1.494s1.495.669 1.495 1.494z" /></svg>
        )},
        { name: 'LinkedIn', href: '#', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.766s.784-1.766 1.75-1.766 1.75.79 1.75 1.766-.783 1.766-1.75 1.766zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
        )},
    ];

    // Main footer container with a dark background and responsive padding
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-12 lg:px-24">
            <div className="flex flex-col lg:flex-row justify-between w-full border-b border-gray-700 pb-10 gap-10">
                {/* Brand and Description Section */}
                <div className="lg:max-w-md">
                    <div className="flex items-center space-x-2">
                        {/* Placeholder for your logo. Replace this with your actual logo component or image. */}
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                             <span className="text-xl font-bold text-gray-900">Logo</span>
                        </div>
                        <span className="text-2xl font-semibold text-white">AdiShop</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed">
                        Crafted to provide high-quality components and resources for modern web development.
                    </p>
                    <div className="flex items-center gap-4 mt-6">
                        {/* You can replace these with your app download links and images. */}
                        <a href="#" className="border border-gray-400 rounded-lg p-2 hover:bg-gray-800 transition-colors">
                            <img src="https://placehold.co/120x40/transparent/FFF?text=App+Store" alt="App Store" className="h-8" />
                        </a>
                        <a href="#" className="border border-gray-400 rounded-lg p-2 hover:bg-gray-800 transition-colors">
                            <img src="https://placehold.co/120x40/transparent/FFF?text=Google+Play" alt="Google Play" className="h-8" />
                        </a>
                    </div>
                </div>

                {/* Navigation and Contact Sections */}
                <div className="flex-1 flex flex-col md:flex-row justify-between gap-10 md:gap-20 lg:gap-40">
                    {/* Company Links Section */}
                    <div>
                        <h2 className="font-bold text-lg text-white mb-4">Company</h2>
                        <ul className="text-sm space-y-3">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    {/* Legal Links Section */}
                    <div>
                        <h2 className="font-bold text-lg text-white mb-4">Legal</h2>
                        <ul className="text-sm space-y-3">
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright and Social Icons Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <p className="text-xs text-center md:text-left">
                    Copyright © {new Date().getFullYear()} YourBrand. All Rights Reserved.
                </p>
                <div className="flex items-center space-x-4">
                    {socialLinks.map((link) => (
                        <a key={link.name} href={link.href} aria-label={link.name} className="hover:text-white transition-colors">
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

// Required export for the component to be rendered correctly.
export default Footer;
