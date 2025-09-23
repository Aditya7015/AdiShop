import React from 'react';

// Data for the testimonial cards, tailored for an e-commerce website.
const cardsData = [
    {
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
        name: 'Briar Martin',
        handle: '@neilstellar',
        quote: 'The quality of the t-shirts is incredible. Fast shipping and fantastic customer service. I\'m a customer for life!',
    },
    {
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        name: 'Avery Johnson',
        handle: '@averywrites',
        quote: 'My new jacket is perfect! It fits like a glove and the denim is so soft. AdiShop has the best selection.',
    },
    {
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
        name: 'Jordan Lee',
        handle: '@jordantalks',
        quote: 'I was looking for a specific style of jeans and found them here. The sizing guide was very accurate, and they arrived quickly.',
    },
    {
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
        name: 'Chris Taylor',
        handle: '@christech',
        quote: 'My favorite new sweatshirt! It\'s so comfortable and looks great. The pricing is very fair for the quality you get.',
    },
    {
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60',
        name: 'Leslie Knope',
        handle: '@pawneeparks',
        quote: 'Absolutely lovely polo shirt. It\'s my new go-to for casual Fridays. The fabric feels very high-end.',
    },
    {
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?w=200&auto=format&fit=crop&q=60',
        name: 'Ben Wyatt',
        handle: '@coneofdunshire',
        quote: 'I purchased a belt and it\'s exactly what I needed. The photos on the site were very accurate, which I appreciate.',
    },
    {
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=60',
        name: 'Adam Scott',
        handle: '@swordsman',
        quote: 'The checkout process was a breeze, and my order was confirmed instantly. It felt secure and reliable.',
    },
    {
        image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936791?w=200&auto=format&fit=crop&q=60',
        name: 'Marta Diaz',
        handle: '@mdiazfits',
        quote: 'Fantastic selection of clothes. I could spend all day browsing! The categories are well organized.',
    },
    {
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca14?w=200&auto=format&fit=crop&q=60',
        name: 'James Wilson',
        handle: '@jwilsonstyle',
        quote: 'My order came in perfect condition. The packaging was eco-friendly which is a huge plus for me!',
    },
    {
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60',
        name: 'Carlos Rivera',
        handle: '@carlos_looks',
        quote: 'I had a question about sizing, and customer support was incredibly helpful and quick to respond. Thanks!',
    },
];

// Reusable Star Rating SVG component
const StarRating = () => (
    <div className="flex gap-0.5 text-yellow-500">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.243L12 18.04l-7.416 3.738 1.48-8.243L.0 9.306l8.332-1.151z"/>
            </svg>
        ))}
    </div>
);

// Product Card Component with the same styling but using props
const CreateCard = ({ card }) => (
    <div className="p-5 rounded-xl mx-4 shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 w-80 shrink-0">
        {/* User Info and Verification */}
        <div className="flex gap-3 items-center mb-3">
            <img className="size-12 rounded-full object-cover" src={card.image} alt={card.name} />
            <div className="flex flex-col">
                <div className="flex items-center gap-1">
                    <p className="font-semibold text-gray-900">{card.name}</p>
                    {/* Verified Badge */}
                    <svg className="mt-0.5 fill-blue-500" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247-.56-.743.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                    </svg>
                </div>
                <span className="text-xs text-slate-500">{card.handle}</span>
            </div>
        </div>
        
        {/* Rating and Quote */}
        <StarRating />
        <p className="text-sm pt-3 pb-2 text-gray-800 leading-relaxed">{card.quote}</p>
    </div>
);

const ReviewSection = () => {
    // Duplicate the data to ensure the seamless scrolling effect
    const fullMarqueeData = [...cardsData, ...cardsData, ...cardsData];

    return (
        <div className="bg-gray-100 py-12 font-sans">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800">What Our Customers Say</h2>
            
            {/* CSS Keyframes for Marquee Effect */}
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-inner {
                    animation: marqueeScroll 60s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>

            {/* First Marquee Row (Left to Right) */}
            <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative">
                {/* Gradient Fades for Start and End of Row */}
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-100 to-transparent"></div>
                
                {/* Marquee Content */}
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {fullMarqueeData.slice(0, 10).map((card, index) => (
                        <CreateCard key={`top-${index}`} card={card} />
                    ))}
                </div>
                
                <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-gray-100 to-transparent"></div>
            </div>

            {/* Second Marquee Row (Right to Left) */}
            <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative">
                {/* Gradient Fades for Start and End of Row */}
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-100 to-transparent"></div>
                
                {/* Marquee Content (Reversed animation) */}
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {fullMarqueeData.slice(10, 20).map((card, index) => (
                        <CreateCard key={`bottom-${index}`} card={card} />
                    ))}
                </div>
                
                <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-gray-100 to-transparent"></div>
            </div>

            {/* Third Marquee Row (Left to Right) */}
            <div className="marquee-row w-full mx-auto max-w-7xl overflow-hidden relative">
                {/* Gradient Fades for Start and End of Row */}
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-gray-100 to-transparent"></div>
                
                {/* Marquee Content */}
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {fullMarqueeData.slice(20, 30).map((card, index) => (
                        <CreateCard key={`third-${index}`} card={card} />
                    ))}
                </div>
                
                <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-gray-100 to-transparent"></div>
            </div>
        </div>
    );
};

export default ReviewSection;
