"use client"

import React from 'react'

const NavBarFeature = ({ title, imageUrl }) => (
  <>
    <div className="h-32  flex flex-col items-center">
      
        <div className="md:min-h-10 md:min-w-10 h-7 w-7 rounded-full bg-gray-500 mb-1"></div>

      <h3 className="text text-center md:text-xs text-[8px]  text-gray-800">
        {title}
      </h3>
    </div>
  </>
)

export default NavBarFeature
