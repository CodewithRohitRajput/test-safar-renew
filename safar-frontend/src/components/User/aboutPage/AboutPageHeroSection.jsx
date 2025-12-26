import React from 'react'
import groupTraking from '@/_assets/images/unsplash_7BjmDICVloE.png'
import invertedComma from '@/_assets/svgs/user/invetedComma.svg'
import Image from 'next/image'

const AboutPaageHeroSection = () => {
  return (
    <section className="md:block hidden text-center py-16 bg-white">
      <h1 className="text-4xl font-bold  mb-4">
        About <span className="text-orange-600"> Safar Wandarlust</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Embark on thrilling trekking adventures through diverse landscapes, from
        rugged mountains to lush forests, and experience nature's beauty up
        close.
      </p>
      {/* Left: Image */}
      <div className="w-[90%] flex items-center justify-center  mx-28 my-10">
        <div className="w-[40%] h-[50vh] ">
          <Image
            src={groupTraking}
            alt="Group of people trekking"
            className="w-[30vw] h-[60vh] object-fill"
          />
        </div>
        <div className="w-[40%] h-[45vh]  text-left">
          <div className='mb-4'>
            <Image src={invertedComma} alt="" className="w-[7vw] h-[7vh] object-fill"/>
          </div>
          <p className="mb-4">
            Safar Wanderlust offers a unique travel experience by crafting
            personalized itineraries that cater to your individual interests and
            preferences. We specialize in creating memorable adventures with a
            focus on exceptional service and local insights. From seamless
            planning to on-ground support, our expert team ensures every aspect
            of your trip is meticulously handled, providing a hassle-free
            journey.
          </p>
          <p className="mb-4">
            Whether you seek cultural immersion, thrilling adventures, or serene
            escapes, Safar Wanderlust delivers tailored experiences that exceed
            expectations.
          </p>
          <p>
            With our commitment to quality and attention to detail, we turn your
            travel dreams into reality. Explore diverse destinations with
            confidence, knowing that every detail is taken care of by our
            dedicated professionals, ensuring a truly unforgettable adventure.
          </p>
        </div>
      </div>
    </section>
  )
}

export default AboutPaageHeroSection
