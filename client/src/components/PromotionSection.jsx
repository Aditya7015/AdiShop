import React from 'react'

const PromotionSection = () => {
  return (
    <div>
      {/* Top Promo Banner */}
      <div className="w-full py-2.5 font-medium text-sm text-white bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
          <p>🚚 Free Shipping on Orders Above $50</p>
          <span className="hidden sm:inline">|</span>
          <p>🎁 20% OFF on First Purchase</p>
          <span className="hidden sm:inline">|</span>
          <p>🔐 Use Code: <strong>WELCOME10</strong></p>
        </div>
      </div>
    </div>
  )
}

export default PromotionSection
