import React from 'react'

import Background from "../../../../public/assets/svgs/user/AboutPageBg.png"
import Image from 'next/image'

const ValuesSection = () => {
  return (
    <>
      <section className=" mx-14 my-auto h-[40vh]">
        {/* Title */}
        <div className="  mb-8 mx-auto text-left w-[60%]">
          <h2 className="text-3xl font-bold">Values</h2>
          <p className="text-lg mt-4 w-[65%] ">
            Our values are there to remind us of who we are, and what we want to
            be. They guide everything we do, from our approach to work, to how
            we treat people. They are intentionally aspirational and
            aspirationally intentional.
          </p>
        </div>
      </section>

    
      <div
        className=" bg-contain bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${Background.src})`
        }}
      >
        {/* Images and Captions */}
        <div className=" relative -top-24 flex flex-col lg:flex-row justify-center items-center gap-8 w-[80%] mx-auto">
          {/* First Image */}
          <div className="text-center">
            <img
              className="w-96 h-60 object-cover mx-auto mb-4"
              src="https://picsum.photos/200/300"
              alt="Book your itinerary"
            />
            <p className="text-lg">Book your itinerary </p>
          </div>

          {/* Second Image */}
          <div className="text-center">
            <img
              className="w-96 h-60 object-cover mx-auto mb-4"
              src="https://picsum.photos/200/300"
              alt="We'll Confirm it"
            />
            <p className="text-lg">We'll Confirm it</p>
          </div>

          {/* Third Image */}
          <div className="text-center">
            <img
              className="w-96 h-60 object-cover mx-auto mb-4"
              src="https://picsum.photos/200/300"
              alt="Now, Enjoy!"
            />
            <p className="text-lg">Now, Enjoy!</p>
          </div>
        </div>
        <div className="p-28 w-[70%] mx-auto ">
          <h1 className="text-7xl md:block hidden text-left">
            {/* Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. */}
          </h1>
          <button className="bg-white p-4 rounded-full mt-10">
            Start Your Journy
          </button>
        </div>
      </div>
    </>
  )
}

export default ValuesSection
