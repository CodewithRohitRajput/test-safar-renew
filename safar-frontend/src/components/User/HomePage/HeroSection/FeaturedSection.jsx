"use client"

import React, { useState } from 'react'
import Carousel from './HorizontalScrollCardTest'
import AboutSectionInFeature from './AboutSectionInFeature'
import { useSelector } from 'react-redux'

const FeaturedSection = () => {
  // State to track the active index of the Carousel
  const [activeIndexM, setActiveIndexM] = useState(0)

  const HeroItineraries =
    useSelector((state) => state.global.HeroItineraries) || []

  const activeItinerary = HeroItineraries[activeIndexM] || {}



  return (
    <>
      <div className=" items-center justify-around flex-shrink-0 h-1/2 bg-gray py-5 px-20 sm:flex md:flex hidden">
        {/* Pass the active itinerary data to AboutSectionInFeature */}
        <div className="">
          <AboutSectionInFeature
            routeMap={activeItinerary.route_map}
            id={activeItinerary.id}
            title={activeItinerary.title}
            description={activeItinerary.short_description}
            activeIndexM={activeIndexM}
          />
        </div>

        {/* Pass the activeIndex setter to Carousel */}
        <div className="w-[50%]">
          <Carousel setActiveIndexM={setActiveIndexM} />
        </div>
      </div>
      <div className=" items-center justify-around flex-shrink-0 h-1/2 bg-gray  sm:hidden md:hidden flex flex-col">
        {/* Pass the active itinerary data to AboutSectionInFeature */}

        {/* Pass the activeIndex setter to Carousel */}
        <div className="w-full">
          <Carousel setActiveIndexM={setActiveIndexM} />
        </div>
        <div className="">
          <AboutSectionInFeature
            id={activeItinerary.id}
            routeMap={activeItinerary.route_map}   
            title={activeItinerary.title}
            description={activeItinerary.short_description}
            activeIndexM={activeIndexM}
          />
        </div>
      </div>
    </>
  )
}

export default FeaturedSection
