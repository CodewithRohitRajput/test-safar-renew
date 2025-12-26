import React, { useState } from 'react'
import ItenerereyCard from '../components/ItenerereyCard'
import { useSelector } from 'react-redux'

function OtherItineraries() {
  const itineraries =
    useSelector((state) => state.global.trendingItineraries) || []

  const [visibleCount, setVisibleCount] = useState(12)

  const showMoreItineraries = () => {
    setVisibleCount((prevCount) => prevCount + 12)
  }

  const displayedItineraries = itineraries.slice(0, visibleCount)

  return (
    <>
      <div className=" md:block font-titleRegular hidden  w-full my-8  px-14">
        <div className="text-center mx-auto py-5">
          <h2 className="text-5xl font-titleMedium">
            Explore other <span className="text-tertiaryText">Itineraries</span>{' '}
          </h2>
        </div>

        {/* Display Itinerary Cards */}
        <div className=" my-8 grid  grid-cols-4 gap-4">
          {displayedItineraries.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              id={itinerary.id || itinerary._id}
              name={itinerary.name || itinerary.title}
              routeName={itinerary.route_map || itinerary.id || itinerary._id}
              image={(itinerary.view_images && itinerary.view_images[0]) || (itinerary.images && itinerary.images[0]) || ''}
              title={itinerary.title || itinerary.name}
              duration={itinerary.duration}
              location={itinerary.city}
              price={itinerary.startingPrice || itinerary.price}
              description={itinerary.shortDescription || itinerary.description}
            />
          ))}
        </div>

        {/* Show More Button */}
        {visibleCount < itineraries.length && (
          <div className="mt-10 text-center">
            <button
              className="bg-orange-500 text-white py-2 px-6 rounded-full"
              onClick={showMoreItineraries}
            >
              Show More
            </button>
          </div>
        )}
      </div>
      <div className=" md:hidden font-titleRegular block  w-full   px-1">
        <div className="text-center mx-auto mb-5">
          <h2 className="text-2xl ">
            Explore other <span className="text-tertiaryText">Itineraries</span>{' '}
            near Uttarakhand
          </h2>
        </div>

        {/* Display Itinerary Cards */}
        <div className="flex gap-4 overflow-x-auto">
          {displayedItineraries.map((itinerary, index) => (
            <ItenerereyCard
              key={index}
              id={itinerary.id || itinerary._id}
              name={itinerary.name || itinerary.title}
              routeName={itinerary.route_map || itinerary.id || itinerary._id}
              image={(itinerary.view_images && itinerary.view_images[0]) || (itinerary.images && itinerary.images[0]) || ''}
              title={itinerary.title || itinerary.name}
              duration={itinerary.duration}
              location={itinerary.city}
              price={itinerary.startingPrice || itinerary.price}
              description={itinerary.shortDescription || itinerary.description}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default OtherItineraries