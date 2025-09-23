import React from 'react'
import Hero from '../components/Hero'
import FeaturedCategories from '../components/CategoryGallery'
import NewArrivals from '../components/NewArrival'
import ReviewSection from '../components/ReviewSection'

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      
    </div>
  )
}

export default Home
