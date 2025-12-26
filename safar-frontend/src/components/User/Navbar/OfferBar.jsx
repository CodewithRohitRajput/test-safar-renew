"use client"

// import { PAGES } from '@/constants/PagesName';
import React from 'react'
// import { FaArrowRight } from 'react-icons/fa'
import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'


const OfferBar = () => {
  // const navigate = useNavigate();
    const offerText = useSelector((state) => state.global.OfferHeading) || ''
  return (
    
    (offerText !='')?(<>
      <div className="w-full border-gray-300 border-b px-20 sm:block md:block hidden">
        <div className="h-14 flex items-center justify-end">
          <div className="text-center mx-auto">
            {offerText}
          </div>
          {/* <div
            onClick={() => navigate(PAGES.LOGIN)}
            className="text-left w-[9%] font-bold flex items-center"
          >
            <span className="mr-1">Explore</span>
            <FaArrowRight size={17} />
          </div> */}
        </div>
      </div>
      <div className="sm:hidden md:hidden w-full flex px-4">

          <div className="text-center mx-auto">
            {offerText}
          </div>

      </div>
      </>):<div></div>
    
  )
}

export default OfferBar