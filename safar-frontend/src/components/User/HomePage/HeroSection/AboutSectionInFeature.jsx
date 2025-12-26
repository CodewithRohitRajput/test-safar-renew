"use client"

import { USERS_PAGE } from '@/constants/PagesName'
import { useRouter } from 'next/navigation'
import React from 'react'

const AboutSectionInFeature = ({ title, description, activeIndexM, id, routeMap }) => {
  const router = useRouter()

  return (
    <>
      {/* === Desktop View === */}
      <div className="sm:flex md:flex hidden items-center justify-center flex-shrink-0 min-h-[320px]">
        {/* Steps */}
        <div className="flex flex-col items-center justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-500 ${
                  activeIndexM + 1 === step ? 'bg-gray-500/30' : ''
                }`}
              >
                {step}
              </div>
              {step !== 3 && <div className="h-[70px] w-px bg-gray-500" />}
            </div>
          ))}
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-start justify-center p-8 w-[70%] min-h-[300px]">
          <h2 className="text-3xl font-titleRegular text-white mb-2 line-clamp-2 leading-tight">
            <span className="font-titleMedium">{title}</span>
          </h2>
          <p className="text-white text-sm mb-6 line-clamp-3 max-w-xl leading-relaxed">
            {description}
          </p>
          <button
            onClick={() => router.push(`${USERS_PAGE.ITINERARY}/${routeMap}`)}
            className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-md hover:bg-tertiaryText hover:text-white"
          >
            Explore Now
          </button>
        </div>
      </div>

      {/* === Mobile View === */}
      <div className="flex sm:hidden md:hidden flex-col items-center justify-center flex-shrink-0 p-6 min-h-[280px]">
        <h2 className="text-xl text-white font-nunitoregular400 text-center mb-2 line-clamp-2 leading-snug">
          {title}
        </h2>
        <p className="text-white text-xs text-center mb-4 line-clamp-3 leading-snug max-w-xs">
          {description}
        </p>
        <button
          onClick={() => router.push(`${USERS_PAGE.ITINERARY}/${routeMap}`)}
          className="px-6 py-2 bg-white text-black text-sm rounded-full shadow-md hover:bg-tertiaryText hover:text-white"
        >
          Explore Now
        </button>
      </div>
    </>
  )
}

export default AboutSectionInFeature
