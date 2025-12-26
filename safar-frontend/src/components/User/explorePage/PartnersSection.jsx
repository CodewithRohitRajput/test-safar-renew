import React from 'react'

const PartnersSection = () => {
  const partners = [
    {
      id: 1,
      name: 'Tanishq Holidays',
      logo: 'katana-logo.png',
      textColor: 'text-orange-600'
    }, // Replace with actual logo paths
    {
      id: 2,
      name: 'TravaClan',
      logo: 'travava-logo.png',
      textColor: 'text-gray-200'
    },
    {
      id: 3,
      name: 'Kabila Camp',
      logo: 'bigui-logo.png',
      textColor: 'text-gray-400'
    },
    {
      id: 4,
      name: 'MakeMyTrip',
      logo: 'booking-logo.png',
      textColor: 'text-red-600'
    },
    {
      id: 5,
      name: 'Trekzy.in',
      logo: 'jakmaen-logo.png',
      textColor: 'text-blue-600'
    }
  ]

  return (
    <div className=" md:py-16 py-8 w-full bg-gray-900">
      <h2 className="text-center md:text-3xl text-2xl font-titleMedium text-white md:mb-6 ">
        Our Trusted Travel Partners
      </h2>
      <p className="text-center md:text-base text-sm mx-4 font-titleRegular md:mx-auto text-gray-400 md:mb-12 mb-4">
        At Safar Wanderlust, we believe group travel is all about shared
        memories and new adventures. <br />
        That’s why we’ve partnered with some of the most reliable and passionate
        travel experts in the industry. Together, <br />
        we create journeys that bring people closer, with every trip designed to
        make your experience smooth, fun, and unforgettable.
      </p>
      <div className="md:max-w-5xl  flex flex-wrap  justify-between mx-5 md:mx-auto ">
        {partners.map((partner) => (
          <div key={partner.id} className="text-center">
            <p
              className={`lg:text-3xl sm:text-sm xs:text-sm text-[8px] font-bold ${partner.textColor}`}
            >
              {partner.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnersSection
