"use client"

import React, { useState } from 'react'
import TripCard from '../../components/ItenerereyCard'
// import { useNavigate } from 'react-router-dom'
import { useRouter } from 'next/navigation';


const TripsSection = ({ title, trips, background,routeMap }) => {


  const router = useRouter()

  const displayedTrips =  trips// Show only 4 trips unless showAll is true

  return (
    <div
      style={{
        backgroundImage: `url(${background})`
      }}
      className="h-fit bg-cover bg-no-repeat py-5  md:px-14"
    >
      <div className="flex items-center justify-between mb-4 ml-4 py-2 h-full">
        <h3 className="text-3xl font-semibold text-black">{title}</h3>

        {trips.length >= 4 && (
          <button
            className="flex items-center bg-transparent text-black"
            onClick={() => router.push(`explore/${routeMap}`)}
          >
            Show More <span className="ml-2">&rarr;</span>
          </button>
        )}
      </div>

      <div className="hidden lg:grid gap-x-5  md:grid-flow-col    items-center justify-center  ">
        {displayedTrips.map((trip, index) => (
          <TripCard
            key={index}
            id={trip.id}
            title={trip.title}
            routeName={trip.route_map}
            image={trip.view_images[0]} // Use the first image
            duration={trip.duration}
            location={trip.city}
            description={trip.shortDescription}
            price={trip.startingPrice}
          />
        ))}
      </div>
      <div className="grid grid-flow-col gap-x-2   items-center justify-start overflow-x-scroll lg:hidden">
        {displayedTrips.map((trip, index) => (
          <div key={index} className=" ">
            <TripCard
              key={index}
              id={trip.id}
              title={trip.title}
              routeName={trip.route_map}
              image={trip.view_images[0]} // Use the first image
              duration={trip.duration}
              location={trip.city}
              description={trip.shortDescription}
              price={trip.startingPrice}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TripsSection
