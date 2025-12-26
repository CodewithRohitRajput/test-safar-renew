"use client"
import React from 'react'
// import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';


const HomeCategoryCard = ({
  id,
  title,
  description,
  image,
  blurLevel,
  imageLoaded,
  handleImageLoaded,
  index,
  route_map
}) => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/explore/${route_map}`)}
      className={`relative group flex-none w-[250px] h-[400px] font-titleRegular rounded-md overflow-hidden shadow-lg ${
        index % 2 === 0 ? 'mt-16' : 'mb-16'
      }`}
      style={{
        filter: `blur(${blurLevel ? blurLevel * 5 : 0}px)`,
        opacity: `${1 - (blurLevel || 0)}`,
        transform: `scale(${1 - (blurLevel || 0) * 0.1})`,
        transition: 'filter 0.3s, opacity 0.3s, transform 0.3s'
      }}
    >
      {/* Show Skeleton if image hasn't loaded */}
      {!imageLoaded ? (
        <div className="animate-pulse bg-gray-300 w-full h-full"></div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`
          }}
        ></div>
      )}
      <img
        src={image}
        alt={title}
        className="hidden" // Hide actual img tag, only use for loading event
        onLoad={() => handleImageLoaded(index)}
      />

      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      <div className="relative z-10  flex flex-col items-start justify-end h-full ">
        <div className="">
          <h3 className="text-base  ">{title}</h3>
          {/* <p className="text-xs pl-5 pr-5 mb-4">{description}</p> */}
        </div>
        <div>
          <button
            className="text-sm font-titleMedium text-white bg-transparent hover:border-b-2  hover:border-orange-500 hover:text-orange-500 transition duration-300"
            onClick={() => router.push(`/explore/${route_map}`)}
          >
            {/* Itinerary &rarr; */}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeCategoryCard;
