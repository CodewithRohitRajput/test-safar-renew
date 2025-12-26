"use client"

import React from 'react'
import ItenerereyCard from '../components/ItenerereyCard'

function SearchResultItenary({ SearchResults=[] }) {


  return (
    SearchResults.length<=0?<>
    <div className=' w-full text-center font-bold text-xl'>
      <p>Not any result found</p>
    </div>
    </>:<>
      <div className="px-14 md:block hidden mb-4">
        <div className="grid  grid-cols-4 gap-4 ">
          {SearchResults?.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              id={itinerary?.id}
              name={itinerary?.name}
              image={itinerary?.view_images[0]}
              title={itinerary?.title}
              routeName={itinerary?.route_map}
              duration={itinerary?.duration}
              location={itinerary?.city}
              price={itinerary?.starting_price}
              rating={itinerary?.rating}
              description={itinerary?.shortDescription}
            />
          ))}
        </div>
      </div>
      <div className="px-4 my-4 md:hidden block ">
        <div className="flex overflow-x-scroll no-scrollbar">
          {SearchResults.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              id={itinerary?.id}
              name={itinerary?.name}
              routeName={itinerary?.route_map}
              image={itinerary?.view_images[0]}
              title={itinerary?.title}
              duration={itinerary?.duration}
              location={itinerary?.city}
              price={itinerary?.starting_price}
              rating={itinerary?.rating}
              description={itinerary?.shortDescription}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default SearchResultItenary