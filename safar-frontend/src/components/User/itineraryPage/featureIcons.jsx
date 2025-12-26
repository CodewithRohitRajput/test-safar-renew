"use client"

import React from 'react'
import { FaRegClock, FaMountain, FaBinoculars, FaStar } from 'react-icons/fa'

const FeaturesIcons = ({ duration, altitude, cultural_sites, scenery }) => {
  return (
    <>
      <div className=" md:flex hidden max-w-6xl   justify-around items-center mx-auto my-10 space-x-4">
        {/* Duration */}
        <div className="flex items-center space-x-2">
          <FaRegClock className="text-gray-600 w-6 h-6" />
          <div>
            <p className="font-titleMedium text-gray-700">Duration</p>
            <p className="text-gray-500 font-titleRegular">{duration} Days</p>
          </div>
        </div>

        {/* Altitude */}
        <div className="flex items-center space-x-2">
          <FaMountain className="text-gray-600 w-6 h-6" />
          <div>
            <p className="font-titleMedium text-gray-700">Altitude</p>
            <p className="text-gray-500 font-titleRegular">{altitude}</p>
          </div>
        </div>

        {/* Scenery */}
        <div className="flex items-center space-x-2">
          <FaBinoculars className="text-gray-600 w-6 h-6" />
          <div>
            <p className="font-titleMedium text-gray-700">Scenery</p>
            <p className="text-gray-500 font-titleRegular">{scenery}</p>
          </div>
        </div>

        {/* Cultural Sites */}
        <div className="flex items-center space-x-2">
          <FaStar className="text-gray-600 w-6 h-6" />
          <div>
            <p className="font-titleMedium text-gray-700">Cultural Sites</p>
            <p className="text-gray-500 font-titleRegular">{cultural_sites}</p>
          </div>
        </div>
      </div>
      <div className=" md:hidden grid grid-cols-2 gap-4 w-fit mx-auto text-xs px-10 py-4 items-center ">
        {/* Duration */}
        <div className="flex items-center space-x-2">
          <FaRegClock className="text-gray-600  h-5 w-5 " />
          <div>
            <p className="font-titleMedium text-gray-700">Duration</p>
            <p className="text-gray-500 font-titleRegular">{duration} Days</p>
          </div>
        </div>

        {/* Altitude */}
        <div className="flex items-center space-x-2">
          <FaMountain className="text-gray-600 h-5 w-5" />
          <div>
            <p className="font-titleMedium text-gray-700">Altitude</p>
            <p className="text-gray-500 font-titleRegular">{altitude}</p>
          </div>
        </div>

        {/* Scenery */}
        <div className="flex items-center space-x-2">
          <FaBinoculars className="text-gray-600 h-5 w-5" />
          <div>
            <p className="font-titleMedium text-gray-700">Scenery</p>
            <p className="text-gray-500 font-titleRegular">{scenery}</p>
          </div>
        </div>

        {/* Cultural Sites */}
        <div className="flex items-center space-x-2">
          <FaStar className="text-gray-600 h-5 w-5 " />
          <div>
            <p className="font-titleMedium  text-gray-700">Cultural Sites</p>
            <p className="text-gray-500 font-titleRegular  ">
              {cultural_sites}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeaturesIcons
