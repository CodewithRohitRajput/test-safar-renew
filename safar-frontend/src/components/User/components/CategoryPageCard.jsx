'use client';
import React from 'react'
// import { Helmet } from 'react-helmet-async'
// import { useNavigate } from 'react-router-dom'
import { useRouter } from 'next/navigation';


const CategoryPageCard = ({
  id,
  title,
  description,
  image,
  imageLoaded,
  handleImageLoaded,
  index,
  route_map
}) => {
  const navigate = useRouter()
  return (
    <div
      onClick={() => navigate.push(`/explore/${route_map}`)}
      className={`relative group flex-none    rounded-md  shadow-lg`}
    >
      {/* <Helmet> */}
        {/* <title>{`${title} - Explore Travel Options`}</title> */}
        {/* <meta name="description" content={`${description}`} />
        <meta name="keywords" content={`${title}, travel, category, explore`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={`/explore/${route_map}`} />
        <meta property="og:type" content="article" /> */}
      {/* </Helmet> */}
      {/* Show Skeleton if image hasn't loaded */}
      {!imageLoaded ? (
        <div className="animate-pulse bg-gray-300 w-full h-full"></div>
      ) : (
        <div
          className=" sm:h-[25rem] h-[20rem] w-[15rem] sm:w-auto  bg-cover bg-center rounded-md"
          style={{
            backgroundImage: `url(${image})`
          }}
        >
          <div className=" absolute bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 h-full w-full"></div>
          <div className="relative z-10 flex flex-col justify-end items-center text-center h-full ">
            <div className="text-white p-2 bg-black w-full">
              <h3 className="text-xl font-titleRegular  mx-auto  text-center">
                {title}
              </h3>
              {/* <p className="text-xs  mb-4">{description}</p> */}
            </div>
            {/* <div>
              <button
                className="text-sm font-titleRegular text-white bg-transparent hover:border-b-2  hover:border-orange-500 hover:text-orange-500 transition duration-300"
                onClick={() => navigate(`/explore/${route_map}`)}
              >
                Itinerary &rarr;
              </button>
            </div> */}
          </div>
        </div>
      )}
      <img
        src={image}
        alt={title}
        className="hidden" // Hide actual img tag, only use for loading event
       onLoad={() => handleImageLoaded?.(index)}
      />
    </div>
  )
}

export default CategoryPageCard
