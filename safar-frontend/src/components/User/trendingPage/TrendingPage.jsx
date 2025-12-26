"use client"

import React, { useEffect } from 'react'


import { useDispatch, useSelector } from 'react-redux'
// import { fetchCategoriesById } from '../../../redux/thunks/fetchCategoriesById'
// import { useParams } from 'react-router-dom'
import TrendingSection from './TrendingSection'
import ExplorePageResult from '../explorePage/ExplorePageResult'
import BannerSlider from '../HomePage/banners/BannerSlider'
// import { fetchBanner } from '../../../redux/thunks/fetchBanner'
// import OtherItineraries from '../searchPage/OtherItineraries'
import Stats from '../explorePage/StatsSection'
import WhySafarWandarLust from '../searchPage/WhySWL'
import PartnersSection from '../explorePage/PartnersSection'
import Testimonial from '../HomePage/reviewSection/ReviewSection'
import { fetchTrendingItineraries } from '@/lib/thunks/fetchTrendingItineraries'
import { useParams } from "next/navigation";
import { fetchBanner } from '@/lib/thunks/fetchBanner'



function TrendingPage() {
  const category = useSelector((state) => state.global.CategoryByID) || []
  const itinerraries=useSelector((state) => state.global.trendingItineraries)||[]
  const dispatch = useDispatch()
  // const { id } = useParams()
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    // dispatch(fetchCategoriesById(id))
    dispatch(fetchTrendingItineraries())
    dispatch(fetchBanner())
  }, [])

  return (
    <div>
      <TrendingSection
        title={category.name}
        description={category.description}
        keyPoints={category.keyPoints}
      />
      <ExplorePageResult itineraries={itinerraries} />
      <BannerSlider />
      <Stats />
      <WhySafarWandarLust />
      <Testimonial />
    </div>
  )
}

export default TrendingPage
