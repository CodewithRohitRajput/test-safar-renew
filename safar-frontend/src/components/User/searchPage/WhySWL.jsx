import React from 'react'
import Icon2 from '@/_assets/svgs/user/seamless_experience.svg'
import Icon3 from '@/_assets/svgs/user/seamless_experience.svg'
import Icon4 from '@/_assets/svgs/user/unforgettable_memories.svg'
import Icon1 from '@/_assets/svgs/user/personalized_itineraries.svg'
const WhySafarWandarLust = () => {
  const benefits1 = [
    {
      title: 'Hassle-Free Experience',
      description:
        'We take care of everything, ensuring a hassle-free and enjoyable travel experience.',
      icon: Icon1
    },
    {
      title: '5-Star Rating',
      description:
        'Our clients love us and we give them unforgettable travel memories.',
      icon: Icon2
    },
    
    {
      title: 'New Friendships & Unforgettable Memories',
      description:
        'Travel tours are a great way to meet like-minded people and make lifelong friends.',
      icon: Icon4
    },
    {
      title: 'Competitive Pricing with No Hidden Costs',
      description:
        'We offer transparent pricing with all inclusions and exclusions.',
      icon: Icon4
    }
  ]
  
  const benefits2 = [
    {
      title: 'Quality Service',
      description:
        'We strive for total client satisfaction with verified hotels, reliable transport, and individual customer support.',
      icon: Icon4
    },
    {
      title: 'Safety',
      description:
        'Our emergency procedure provides 24x7 support and immediate assistance if any issue arises.',
      icon: Icon4
    },
    {
      title: 'Expert Trip Planning',
      description:
        'Our team meticulously plans every detail, ensuring a seamless and unforgettable journey.',
      icon: Icon4
    },
    {
      title: 'Solo Female Traveler Safety',
      description:
        'We prioritize client safety, especially for solo female travelers.',
      icon: Icon4
    }
  ]
  

  return (
    <>
      <div className="py-10 md:block sm:hidden hidden bg-white text-center">
        <h2 className="text-5xl font-titleMedium mb-10">
          Why Choose <span className="text-orange-500">Safar Wandarlust</span>
        </h2>
        <div className="border rounded-2xl mx-32 w-[85%]">
          <div className=" flex justify-center items-center mx-auto  flex-shrink-0  px-5 py-5 ">
            {(benefits1 || [])?.map((benefit, index) => (
              <React.Fragment key={index}>
                <div
                  key={index}
                  className="flex w-[25%] flex-col items-start justify-center text-left p-5 "
                >
                  <img src={benefit?.icon||'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='} alt="" />
                  <h3 className="text-xl font-bold mt-3 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
                {index != 3 && (
                  <div>
                    <div className="w-[1px] h-[25vh] mx-2 bg-buttonBackground"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <hr />
          <div className=" flex justify-center rounded-2xl items-center mx-auto  flex-shrink-0  px-5 py-5 mt-4 ">
            {(benefits2 || [])?.map((benefit, index) => (
              <React.Fragment key={index}>
                <div
                  key={index}
                  className="flex w-[25%] flex-col items-start justify-center text-left p-5 "
                >
                  <img src={benefit?.icon} alt="" />
                  <h3 className="text-xl font-bold mt-3 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
                {index != 3 && (
                  <div>
                    <div className="w-[1px] h-[25vh] mx-2 bg-buttonBackground"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default WhySafarWandarLust;
