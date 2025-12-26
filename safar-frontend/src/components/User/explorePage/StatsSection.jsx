import React from 'react'

const Stats = () => {
  const stats = [
    { id: 1, value: '2000+', label: 'Group Tours(Families)' },
    { id: 2, value: '1,100+', label: '5⭐ Rating' },
    { id: 3, value: '1,000+', label: 'Customized Trips' },
    { id: 4, value: '10,000+', label: 'Happy Travelers' }
  ]

  return (
    <div className="mb-10 bg-white">
      <h2 className="text-center lg:text-5xl md:text-3xl text-2xl  font-titleMedium lg:mb-12  mb-5">
        More about <span className="text-orange-600">trips</span>
      </h2>
      <div className="max-w-5xl px-4 mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center">
            <p className="lg:text-4xl md:text-3xl text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-lg font-titleBold text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
