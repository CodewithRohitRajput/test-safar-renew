"use client"

import React from 'react'
import ItenerereyCard from '../components/ItenerereyCard'

function ExplorePageResult({ itineraries }) {


  return (
    <>
      <div className="md:block hidden px-14 mb-4">
        <div className="grid  grid-cols-4  gap-4">
          {(itineraries || [])?.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              name={itinerary.name}
              id={itinerary.id}
              image={itinerary.view_images[0]}
              title={itinerary.title}
              routeName={itinerary.route_map}
              duration={itinerary.duration}
              location={itinerary.city}
              price={itinerary.startingPrice}
              rating={itinerary.rating}
              description={itinerary.shortDescription}
            />
          ))}
        </div>
      </div>
      <div className="md:hidden block ">
        <div className="flex  overflow-x-auto gap-4">
          {(itineraries || [])?.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              name={itinerary.name}
              id={itinerary.id}
              routeName={itinerary.route_map}
              image={itinerary.view_images[0]}
              title={itinerary.title}
              duration={itinerary.duration}
              location={itinerary.city}
              price={itinerary.startingPrice}
              rating={itinerary.rating}
              description={itinerary.shortDescription}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default ExplorePageResult
