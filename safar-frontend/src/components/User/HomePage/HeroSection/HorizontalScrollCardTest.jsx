"use client"

import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import HeroSectionCard from '../../components/HeroSectionCard'

const Carousel = ({ setActiveIndexM }) => {
  const carouselRef = useRef(null)
  const mobileCarouselRef = useRef(null) // Separate ref for the mobile carousel
  const [activeIndex, setActiveIndex] = useState(1)
  const [isJumping, setIsJumping] = useState(false) // Flag to manage smooth scrolling

  // Fetch hero itineraries from the Redux store
  const HeroItineraries = useSelector((state) => state.global.HeroItineraries) || []
  const global = useSelector((state) => state.global)
  // console.log('Hero itineraries', HeroItineraries)
  // console.log('Global', global)


  const router = useRouter()

  // Duplicate the itineraries array
  const duplicatedItineraries = [...HeroItineraries, ...HeroItineraries]
  const totalImages = duplicatedItineraries.length
    //{ADD BY YUVRAJ}
  useEffect(() => {
  const scrollToCard = (carouselRef) => {
    if (!carouselRef.current) return;

    const cardWidth = carouselRef.current.firstChild?.offsetWidth || 300; // Fallback for mobile
    const containerWidth = carouselRef.current.offsetWidth;

    setActiveIndex(prev => {
      const nextIndex = (prev + 1) % totalImages;

      const scrollPosition = (cardWidth * nextIndex) - (containerWidth / 2) + (cardWidth / 2);

      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });

      return nextIndex;
    });
  };

  const interval = setInterval(() => {
    scrollToCard(carouselRef);         // Desktop
    scrollToCard(mobileCarouselRef);   // Mobile
  }, 3000);

  return () => clearInterval(interval);
}, [totalImages]);

// Handle infinite scroll
  const handleScroll = (carouselRef, setActiveIndexFn) => {
    if (isJumping) return

    const carousel = carouselRef.current
    const cardWidth = carousel.scrollWidth / totalImages
    const scrollLeft = carousel.scrollLeft
    const threshold = cardWidth * (totalImages / 2)

    if (scrollLeft > cardWidth * (totalImages / 2)) {
      setIsJumping(true)
      carousel.style.scrollBehavior = 'auto'
      carousel.scrollLeft = 1

      setTimeout(() => {
        carousel.style.scrollBehavior = 'smooth'
        setIsJumping(false)
      }, 20)
    } else if (scrollLeft <= 0) {
      setIsJumping(true)
      carousel.style.scrollBehavior = 'auto'
      carousel.scrollLeft = threshold - 10

      setTimeout(() => {
        carousel.style.scrollBehavior = 'smooth'
        setIsJumping(false)
      }, 20)
    }

    const index = Math.round(scrollLeft / cardWidth + 0.6)
    setActiveIndexFn(index)
    setActiveIndexM(index % (totalImages / 2))
  }

  useEffect(() => {
    const carousel = carouselRef.current
    const mobileCarousel = mobileCarouselRef.current

    if (carousel) {
      carousel.scrollLeft = carousel.scrollWidth / (totalImages + 2)
      carousel.addEventListener('scroll', () =>
        handleScroll(carouselRef, setActiveIndex)
      )
    }

    if (mobileCarousel) {
      mobileCarousel.scrollLeft = mobileCarousel.scrollWidth / (totalImages + 2)
      mobileCarousel.addEventListener('scroll', () =>
        handleScroll(mobileCarouselRef, setActiveIndex)
      )
    }

    return () => {
      if (carousel)
        carousel.removeEventListener('scroll', () =>
          handleScroll(carouselRef, setActiveIndex)
        )
      if (mobileCarousel)
        mobileCarousel.removeEventListener('scroll', () =>
          handleScroll(mobileCarouselRef, setActiveIndex)
        )
    }
  }, [totalImages])

  return (
    <>
      {/* Desktop Carousel */}
        <div
          ref={carouselRef}
          className="hidden sm:hidden md:flex overflow-x-scroll overflow-y-hidden scrollbar-hide p-3.5 rounded-lg flex-shrink-0 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {duplicatedItineraries.map((itinerary, index) => (
            <HeroSectionCard
              key={`${index}`}
              imageUrl={itinerary.image[0]}
              description={itinerary.short_description || itinerary.description}
              buttonText="Learn More"
              routeMap={itinerary.route_map}
              onButtonClick={() => router.push(`/itinerary/${itinerary.route_map}`)}
              isActive={activeIndex === index}
              extraClasses="m-1"
            />
          ))}
        </div>

      {/* Mobile Carousel */}
        <div
          ref={mobileCarouselRef}
          className="flex sm:flex md:hidden overflow-auto scrollbar-hide py-4 rounded-lg"
        >
          {duplicatedItineraries.map((itinerary, index) => (
            <HeroSectionCard
              key={`${index}`}
              imageUrl={itinerary.image[0]}
              title={itinerary.title}
              description={itinerary.short_description || itinerary.description}
              buttonText="Learn More"
              routeMap={itinerary.route_map}
              onButtonClick={() => router.push(`/itinerary/${itinerary.route_map}`)}
              isActive={activeIndex === index}
              extraClasses="m-1"
            />
          ))}
        </div>
    </>
  )
}

export default Carousel