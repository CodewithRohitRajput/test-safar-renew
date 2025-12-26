"use client"

import React from 'react'
import Feature from '../components/ExplorePageFeature'

const ExploreTrekking = ({ description, title = '', keyPoints = [] }) => {
  // Function to render the separator (hr)


  const renderSeparator = () => (
    <hr
      className="border-0 col-span-2 h-[1px] md:mb-10 mb-14 w-full"
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
    <section className="text-center py-10 bg-white">
      <h1 className="md:text-4xl text-2xl font-titleMedium md:mb-4 my-2">
        Explore {title}
        <span role="img" aria-label="fire" className="ml-2">
          🔥
        </span>
      </h1>
      <p className="text-lg text-gray-600 font-titleRegular max-w-xl mx-auto mb-12">
        {description}
      </p>

      {/* Key Points Section */}
      {keyPoints.length > 0 && (
        <div className="md:mx-auto mx-10 grid grid-cols-10 font-titleRegular justify-center items-center max-w-6xl">
          {keyPoints.map((point, index) => (
            <React.Fragment key={point.id || index}>
              <Feature title={point.title} imageUrl={point.image} />
              {index < keyPoints.length - 1 && renderSeparator()}
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  )
}

export default ExploreTrekking
