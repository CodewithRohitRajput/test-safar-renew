"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'


const HeroSectionCard = ({
  imageUrl,
  title,
  description,
  onButtonClick,
  buttonText = 'Learn More',
  extraClasses = '',
  isActive = false,
  children,
  routeMap
}) => {
    const router = useRouter()

  console.log(imageUrl)

  return (
    <>
      <div
        className={`relative md:block sm:block hidden flex-none w-[50%]   pt-40 pb-5 px-5 rounded-lg bg-cover bg-center transition-transform duration-300 ${
          isActive ? 'transform scale-110 z-50 ' : 'transform'
        } ${extraClasses}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className=" w-full h-full flex flex-col justify-end items-center  rounded-lg">
          <h3 className="text-white text-center text-lg">{title}</h3>
          <button
            onClick={onButtonClick}
            className="text-white text-xs font-bold my-2 flex items-start justify-center"
          >
            {buttonText}
            <div className="ml-[4px] mt-[2px]">
              <FaArrowRight size={13} color="white" />
            </div>
          </button>
        </div>
      </div>
      <div
        onClick={() => router.push(`/itinerary/${routeMap}`)}
        className={`relative md:hidden sm:hidden  py-4 px-2 flex-none w-[55%] h-[20vh] a rounded-lg bg-cover bg-center transition-transform duration-300 ${
          isActive ? 'transform scale-110 z-50 ' : 'transform'
        } ${extraClasses}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className=" w-full h-full  flex flex-col justify-end items-center  rounded-lg">
          {/* <h3 className="text-white text-center text-[8px]">{title}</h3> */}
          {children}
          {/* <button
            onClick={onButtonClick}
            className="text-white text-xs font-bold  flex items-start justify-center"
          >
            {buttonText}
            <div className="">
              <FaArrowRight size={13} color="white" />
            </div>
          </button> */}
        </div>
      </div>
    </>
  )
}

export default HeroSectionCard
