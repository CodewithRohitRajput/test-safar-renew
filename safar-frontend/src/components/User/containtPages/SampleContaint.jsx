import React from 'react'

function SampleContent({ title, subtitle, listPoints }) {
  return (
    <div className="m-10 space-y-6 shadow-lg p-3 mb-5 bg-white rounded">
      <h1 className="md:text-4xl text-3xl text-black font-titleMedium w-full text-center">
        {title}
      </h1>
      {subtitle && (
        <p className="text-center text-lg font-titleRegular text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
      <ol className="list-decimal list-inside mx-auto space-y-2 text-gray-700 text-left max-w-6xl">
        {listPoints.map((point, index) => (
          <li key={index} className="text-base md:text-lg">
            {point}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default SampleContent
