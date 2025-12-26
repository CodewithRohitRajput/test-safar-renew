"use client"

import ItenerereyCard from '../../components/ItenerereyCard'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { fetchCategoriesAndItineraries } from '../../../../redux/thunks/fetchCategoriesAndItineraries '

const ItineraryPSection = () => {
    const fetchedcategories = useSelector((state) =>
      (state.global.categories || []))


    const categories= fetchedcategories.filter(
        (category) => category?.itineraries?.length > 0
      )
    // Filter categories with itineraries only

  const categoryScrollRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const dispatch = useDispatch()
  const cardsScrollRef = useRef(null)

  useEffect(() => {
    // if (fetchedcategories.length == 0) {
    //   dispatch(fetchCategoriesAndItineraries())
    // }
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]) // Select the first category with itineraries
    }
  }, [dispatch, categories, selectedCategory])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setCurrentPage(0) // Reset page when category changes
  }

  const scrollLeft = () => {
    categoryScrollRef.current.scrollBy({
      left: -200, // Adjust the scroll amount
      behavior: 'smooth'
    })
  }

  const scrollRight = () => {
    categoryScrollRef.current.scrollBy({
      left: 200, // Adjust the scroll amount
      behavior: 'smooth'
    })
  }

  // Filter itineraries based on selected category
  const filteredItineraries = selectedCategory
    ? selectedCategory.itineraries
    : []

  // Chunk the itineraries for pagination
  const chunkedItineraries = chunkArray(filteredItineraries, 12)

  return (
    <div className="md:px-14 md:py-0">
      <h2 className="mb-10 text-center font-titleMedium text-2xl md:text-5xl">
        Explore all <span className="text-orange-500">Packages</span>
      </h2>

      {/* Category Scroll Section */}
      <div className="mb-10 flex items-center justify-between">
        <div
          ref={categoryScrollRef}
          className="no-scrollbar flex space-x-4 overflow-x-auto"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className={`cursor-pointer text-nowrap rounded-xl border border-gray-400 px-8 py-2 text-center text-black ${
                selectedCategory && selectedCategory?.id === category?.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </div>
          ))}
        </div>

        {/* Scroll Buttons */}
        <div className="ml-8 hidden shrink-0 items-center justify-between md:flex">
          <div
            className="z-10 mr-2 flex size-8 items-center justify-center rounded-full border border-black p-2"
            onClick={scrollLeft}
          >
            <button>&lt;</button>
          </div>
          <div
            className="z-10 ml-2 flex size-8 items-center justify-center rounded-full border border-black p-2"
            onClick={scrollRight}
          >
            <button>&gt;</button>
          </div>
        </div>
      </div>

      {/* Itinerary Cards */}
      <div className="hidden h-auto lg:block">
        <div
          className={`grid h-auto  gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
            chunkedItineraries.length > 4
              ? chunkedItineraries.length > 8
                ? 'grid-rows-3'
                : 'grid-rows-2'
              : 'grid-rows-1'
          }`}
        >
          {chunkedItineraries[currentPage]?.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              id={itinerary.id}
              title={itinerary.title}
              routeName={itinerary.route_map}
              image={itinerary.view_images[0]} // Use the first image
              duration={itinerary.duration}
              location={itinerary.city}
              description={itinerary.shortDescription}
              price={itinerary.startingPrice}
              is_customize={ itinerary.is_customize === true || itinerary.is_customize === "true" || itinerary.is_customize === 1}
              showMoreButton={
                <button
                  onClick={() => {
                    // Navigate to the itinerary details page
                    window.location.href = `/itinerary/${itinerary.id}`
                  }}
                  className="mt-2 text-blue-500 underline"
                >
                  View All →
                </button>
              }
            />
          ))}
        </div>
      </div>
      <div className="mb-4 block h-auto lg:hidden">
        <div
          ref={cardsScrollRef}
          className={`flex h-auto gap-4 overflow-x-auto whitespace-nowrap`}
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}
        >
          {chunkedItineraries[currentPage]?.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              id={itinerary.id}
              routeName={itinerary.route_map}
              title={itinerary.title}
              image={itinerary.view_images[0]} // Use the first image
              duration={itinerary.duration}
              location={itinerary.city}
              description={itinerary.shortDescription}
              price={itinerary.startingPrice}
              is_customize={ itinerary.is_customize === true || itinerary.is_customize === "true" || itinerary.is_customize === 1}
            />
          ))}
        </div>
      </div>
      {chunkedItineraries[currentPage]?.length >= 12 && (
        <div className="mt-10 text-center md:block hidden">
          <button
            onClick={() =>
              (window.location.href = `/explore/${selectedCategory.route_map}`)
            }
            className="bg-orange-500 text-white py-2 px-6 rounded-full"
          >
            View All →
          </button>
        </div>
      )}
    </div>  
  )
}

// Utility function to chunk the array
const chunkArray = (array, size) => {
  const chunkedArr = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size))
  }
  return chunkedArr
}

export default ItineraryPSection
