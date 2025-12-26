"use client"

import React from 'react'

const LocationCircles = ({ locations, selectedLocation, onLocationChange }) => {
  return (
    <div className="mb-6">
       <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1 px-2 pt-2 -mx-2">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onLocationChange(location.id)}
            className={`flex flex-col items-center group transition-all duration-200 flex-shrink-0 ${
              selectedLocation === location.id ? 'opacity-100' : 'opacity-100 hover:opacity-90'
            }`}
          >
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200 ${
              selectedLocation === location.id
                ? 'border-orange-500 shadow-lg transform scale-110'
                : 'border-gray-300 group-hover:border-orange-300'
            }`}>
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/svgs/images/default-location.jpg'
                }}
              />
            </div>
            <span className={`text-xs mt-2 font-medium whitespace-nowrap ${
              selectedLocation === location.id ? 'text-orange-600 font-bold' : 'text-gray-600'
            }`}>
              {location.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LocationCircles  