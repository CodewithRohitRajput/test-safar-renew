"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/navigation';
import { putBanner } from '@/lib/thunks/updateClickCount';

// import { fetchBanner } from '../../../../redux/thunks/fetchBanner'

// Mock API call to fetch banners

const BannerSlider = () => {
  const banners = useSelector((state) => state.global.banners) || []
  const [currentBanner, setCurrentBanner] = useState(0)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    // if (banners.length === 0) dispatch(fetchBanner())

    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) =>
        prevBanner === banners.length - 1 ? 0 : prevBanner + 1
      )
    }, 15000) // Change slide every 3 seconds
    return () => clearInterval(interval) // Cleanup on unmount
  }, [banners, dispatch])

  if (banners.length === 0) {
    return <div></div>
  }

  return (
    banners.length > 0 && (
      <div className="relative   mx-4 my-8 md:mx-0 md:my-10 ">
        {/* Banner Image */}
        <img
          onClick={() => {
            dispatch(
              putBanner(banners[currentBanner], banners[currentBanner].id)
            )
            router.push(`/explore/${banners[currentBanner].route_map}`)
          }}
          src={banners[currentBanner]?.image}
          alt={banners[currentBanner]?.title}
          className="h-40 w-full rounded-lg object-contain px-0 md:h-[250px] md:w-full md:rounded-none md:px-10"
        />

        {/* Dots for Slider Navigation */}
        {/* <div className="absolute bottom-4 w-full flex justify-center space-x-2">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`w-3 h-3  rounded-full ${
              index === currentBanner ? 'bg-white' : 'bg-gray-400'
            }`}
          ></div>
        ))}
      </div> */}
      </div>
    )
  )
}

export default BannerSlider
