"use client"

import React, { useEffect } from 'react'
import TripsSection from './TripSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedCategory } from '@/lib/thunks/fetchFeaturedCategory'

const TripsPage = () => {
  const categories = useSelector((state) => state.global.featuredCategory) || []

  const dispatch = useDispatch()

  useEffect(() => {
    if (categories.length == 0) {
      dispatch(fetchFeaturedCategory())
    }
  }, [dispatch])

  return (
    categories.length != 0 && (
      <div className="my-10 md:my-20">
        <h2 className="mb-2.5 text-center  font-titleMedium text-2xl md:text-5xl">
        Your Next  <span className="text-orange-500">Adventure Awaits</span>
        </h2>
        <div className="mx-auto mb-10 px-5 text-center  font-titleRegular text-sm text-gray-500">
          <p>
          Dive into breathtaking experiences across the globe.
          </p>
        </div>

        {categories.map(
          (category, index) =>
            category.itineraries.length > 0 && (
              <TripsSection
                key={index}
                title={category.name}
                background={category.banner_image}
                trips={category.itineraries}
                routeMap={category.route_map}
              />
            )
        )}
      </div>
    )
  )
}

export default TripsPage
