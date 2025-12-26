"use client"

import React, { useEffect } from 'react'
import TravelCategories from './TravelCategories'
import BannerSlider from '../HomePage/banners/BannerSlider'
import Testimonial from '../HomePage/reviewSection/ReviewSection'
import PartnersSection from '../explorePage/PartnersSection'
import WhySafarWandarLust from '../searchPage/WhySWL'
import Stats from '../explorePage/StatsSection'
import { useDispatch } from 'react-redux'
import { fetchCategoriesAndItineraries } from '@/lib/thunks/fetchCategoriesAndItineraries '

function CategoriesPage() {
      const dispatch = useDispatch()
      useEffect(() => {
        dispatch(fetchCategoriesAndItineraries())
      }, [dispatch])
  return (
    <div>
      <TravelCategories />
      <BannerSlider />
      <Stats />
      <WhySafarWandarLust />
      <Testimonial />
    </div>
  )
}

export default CategoriesPage