"use client"

import React from 'react'
import Image from 'next/image'
import Logo from '@/_assets/svgs/logo/Safar Wanderlust (1).png'

const CheckWebsiteButton = ({ onClick }) => {
  return (
    <div className="mb-8 flex justify-center">
      <button
        onClick={onClick}
        className="w-full sm:w-auto bg-gray-100 hover:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-between transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {/* Left: Safar Logo */}
        <Image
          src={Logo}
          alt="Safar Wanderlust"
          className="w-8 h-8 object-contain"
        />

        {/* Middle: Text */}
        <span className="text-black mx-auto">Check Website</span>

        {/* Right: Paper Plane Icon */}
        <svg
          className="w-6 h-6 text-black"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/>
        </svg>
      </button>
    </div>
  )
}

export default CheckWebsiteButton
