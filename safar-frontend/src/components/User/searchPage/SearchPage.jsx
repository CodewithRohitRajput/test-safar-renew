"use client"

import React, { useEffect } from 'react'
import SearchResultsHero from './SearchResultHero'
import SearchResultItenary from './SearchResultItenary'
import BannerSlider from '../HomePage/banners/BannerSlider'
import OtherItineraries from './OtherItineraries'
import WhySafarWandarLust from './WhySWL'
import Testimonial from '../HomePage/reviewSection/ReviewSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReviews } from '@/lib/thunks/fetchReviews'
import { fetchBanner } from '@/lib/thunks/fetchBanner'

function SearchPage() {
  const dispatch = useDispatch()

  const SearchResults =
    useSelector((state) => state.global.search_results) || []
  const banner = useSelector((state) => state.global.banners) || []
  const reviews = useSelector((state) => state.global.reviews) || []

  useEffect(() => {
    if (banner.length === 0) {
      dispatch(fetchBanner())
    }
    if (reviews.length === 0) {
      dispatch(fetchReviews())
    }
  }, [banner.length, reviews.length, dispatch]) // Add relevant dependencies

  return (
    <div>
      <SearchResultsHero />
      <SearchResultItenary SearchResults={SearchResults} />
      <BannerSlider />
      <OtherItineraries />
      <WhySafarWandarLust />
      <Testimonial />
    </div>
  )
}

export default SearchPage
