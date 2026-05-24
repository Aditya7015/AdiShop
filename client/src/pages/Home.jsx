import React from 'react'
import Hero from '../components/Hero'
import FeaturedCategories from '../components/CategoryGallery'
import NewArrivals from '../components/NewArrival'
import ReviewSection from '../components/ReviewSection'
import PromoBanner from '../components/PromoBanner'
import TrustedBrands from '../components/TrustedBrands'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      <PromoBanner />
      <TrustedBrands />
      <NewsLetter />
    </div>
  )
}

export default Home
