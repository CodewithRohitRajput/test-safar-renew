import React from 'react'

const WhyChooseSection = () => {
  const services = [
    {
      icon: '👥', // Replace with your icons (use an icon font or import SVG)
      title: 'Best Service',
      description:
        'Safar Wanderlust offers a unique travel experience by crafting personalized itineraries that cater to your individual interests and preferences.'
    },
    {
      icon: '💲',
      title: 'Price Guarantee',
      description:
        'Safar Wanderlust offers a unique travel experience by crafting personalized itineraries that cater to your individual interests and preferences.'
    },
    {
      icon: '🏆',
      title: 'Handpicked Hotels',
      description:
        'Safar Wanderlust offers a unique travel experience by crafting personalized itineraries that cater to your individual interests and preferences.'
    },
    {
      icon: '🏆',
      title: 'Handpicked Hotels',
      description:
        'Safar Wanderlust offers a unique travel experience by crafting personalized itineraries that cater to your individual interests and preferences.'
    }
  ]

  return (
    <section className="my-10">
      <div className="text-center my-12 ">
        <h2 className="text-4xl font-bold  ">
          Why <span className="text-orange-600">Choose</span> us?
        </h2>
      </div>
      <div
        className="bg-cover bg-center py-16"
        style={{
          // backgroundImage: `url(${backgroundImage})`
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 ">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-left"
            >
              <div className="text-6xl mb-4">{service.icon}</div>{' '}
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection
