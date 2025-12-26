"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInstaLinkData } from '@/lib/thunks/fetchInstaLinkData'
import CategoryChips from './CategoryChips'
import LocationCircles from './LocationCircles'
import CheckWebsiteButton from './CheckWebsiteButton'
import ItineraryCard from './ItineraryCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { FaInstagram, FaWhatsapp} from 'react-icons/fa'

const InstaLinkPage = () => {
  const dispatch = useDispatch()
  const { categories, locations, itineraries, total, loading, error } = useSelector((state) => state.global.instaLinkData || {})
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  // Debug logging
  console.log('Current filters:', { selectedCategory, selectedLocation })
  console.log('InstaLink Data:', { categories, locations, itineraries, total, loading, error })

  useEffect(() => {
    console.log('Dispatching fetchInstaLinkData with params:', {
      category: selectedCategory,
      city: selectedLocation,
      limit: 1000,
      offset: 0
    })
    
    dispatch(fetchInstaLinkData({
      category: selectedCategory,
      city: selectedLocation,
      limit: 1000,
      offset: 0
    }))
  }, [dispatch, selectedCategory, selectedLocation])

  const handleCategoryChange = (categoryId) => {
    console.log('Category changed to:', categoryId)
    setSelectedCategory(categoryId)
  }

  const handleLocationChange = (locationId) => {
    console.log('Location changed to:', locationId)
    setSelectedLocation(locationId)
  }

  const handleCheckWebsite = () => {
    window.open('https://safarwanderlust.com', '_blank')
  }

  // Show error if there's one
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-white-50">
      <div className="container mx-auto px-4 py-8">
        {/* Brand Section with Social Media Icons */}
        <div className="text-center mb-12">
          {/* Brand Name */}
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            <span className="text-orange-500">Safar</span> Wanderlust
          </h1>
          
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-8">
            <a 
              href="https://www.instagram.com/safar_wanderlust/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110"
              title="Follow us on Instagram"
            >
              <FaInstagram className="w-8 h-8" />
            </a>
            <a 
              href="https://wa.me/918818931020" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110"
              title="WhatsApp us"
            >
              <FaWhatsapp className="w-8 h-8" />
            </a>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <CategoryChips
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <LocationCircles
          locations={locations || []}
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
        />

        <CheckWebsiteButton onClick={handleCheckWebsite} />

        {/* Itinerary Cards */}
        <div className="mt-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itineraries?.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
              />
            ))}
          </div>

          {/* No results message */}
          {itineraries?.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No itineraries found for the selected filters.</p>
              <p className="text-gray-400 text-sm mt-2">
                Try selecting different categories or locations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstaLinkPage