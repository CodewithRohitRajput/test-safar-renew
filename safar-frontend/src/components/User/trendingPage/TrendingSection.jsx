import React from 'react'
import Feature from '../components/ExplorePageFeature'

const TrendingSection = ({ description, title = '', keyPoints = [] }) => {
  // Function to render the separator (hr)

  const renderSeparator = () => (
    <hr
      className="border-0 col-span-2 h-[1px] mb-10 w-full"
      style={{
        borderTop: '1px',
        borderColor: '#ccc',
        backgroundImage:
          'linear-gradient(to right, #ccc 30px, transparent 30px)',
        backgroundSize: '40px 10px'
      }}
    />
  )

  return (
    <section className="text-center font-titleRegular md:py-10 py-5 bg-white">
      <h2 className="md:text-5xl text-2xl  font-titleMedium mb-4">
        Explore Trending Itineraries
        <span role="img" aria-label="fire" className="ml-2">
          🔥
        </span>
      </h2>
      <p className="md:text-lg text-sm text-center text-gray-600 max-w-xl mx-auto md:mb-12 ">
        These all are our top itineraries you can chose any of it and we promise
        to provide best services and you will enjouy for sure
      </p>


    </section>
  )
}

export default TrendingSection
