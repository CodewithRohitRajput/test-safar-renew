"use client"

import React, { useEffect, useState } from 'react'
import ItenerayImageSection from './itenerayImageSection'
import ItinerarySection from './ItinerarySection'
import TripPdfDownloadBanner from './TripPdfDownloadBanner'
import PricingComponent from './PricingSection'
import BannerSlider from '../HomePage/banners/BannerSlider'
import Testimonial from '../HomePage/reviewSection/ReviewSection'
import PartnersSection from '../explorePage/PartnersSection'
import TravellerForm from './TravellerForm'
import { useDispatch, useSelector } from 'react-redux'
import FeaturesIcons from './featureIcons'

import { useParams } from "next/navigation";
import { fetchItenerayByName } from '@/lib/thunks/fetchItenerayByName'
import CustomModal from '@/components/CustomModal'
import MobileStickyPriceBar from './MobileStickyPriceBar'
// import { Helmet } from 'react-helmet-async'

function ItineraryPage() {
  const dispatch = useDispatch()
  const iteneray = useSelector((state) => state.global.itenerayByID) || {} // FIXED: Changed from [] to {}
  const [showCallBackForm, setShowCallBackForm] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    dispatch(fetchItenerayByName(id))
  }, [dispatch, id])

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const openPopup = () => {
    setIsPopupOpen(true) // Open popup
  }

  const closePopup = () => {
    setIsPopupOpen(false) // Close popup
    setShowCallBackForm(true)
  }

  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(null) // State for selected package
  const [selectedStartingPoint, setSelectedStartingPoint] = useState(null) // State for full selected starting point object
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null) // State for full selected dropping point object

  // Validation function
  const handleMobileBookNow = () => {
    if (selectedPackage && selectedBatch && selectedStartingPoint && selectedDroppingPoint) {
      openPopup();
    } else {
      // You can add a toast notification here to inform user to select all options
      console.log("Please select all required options");
    }
  };

  return (
    <div>
      {/* <Helmet>...</Helmet> */}

      <div className="container mx-auto py-8 pb-24 md:pb-8">
      {/* <CallBackForm showCallBackForm={showCallBackForm} setShowCallBackForm={setShowCallBackForm} /> */}
      {/* <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} /> */}
      <h1 className="text-3xl font-bold mb-4">{iteneray.title}</h1>
      
      {/* Modified the grid layout to properly stack on mobile and handle overflow */}
      <div className="grid lg:grid-cols-[65%_35%] gap-4">
        {/* Left Content Section */}
        <div className="">
          <ItinerarySection
            notes={iteneray.notes}
            dayDetails={iteneray.day_details}
            hotels={iteneray.hotels}
            inclusions_exclusions={iteneray.inclusions_exclusions}
            cancellation_policy={iteneray.cancellation_policy}
          />
        </div>

        {/* Right Pricing Section (Sticky + Scrollable) */}
        <div className="justify-start md:px-16 md:p-2 sticky top-0 h-auto flex flex-col" style={{maxHeight:"100%"}}>
          <div className="sticky top-0 overflow-y-clip  ">
            {/* Pricing Component */}
            <PricingComponent
              openPopup={openPopup}
              selectedBatch={selectedBatch}
              showCallBackForm={showCallBackForm}
              setShowCallBackForm={setShowCallBackForm}
              selectedDroppingPoint={selectedDroppingPoint}
              selectedPackage={selectedPackage}
              selectedStartingPoint={selectedStartingPoint}
              setSelectedBatch={setSelectedBatch}
              setSelectedDroppingPoint={setSelectedDroppingPoint}
              setSelectedPackage={setSelectedPackage}
              setSelectedStartingPoint={setSelectedStartingPoint}
              base_packages={iteneray.base_packages}
              batches={iteneray.batches}
              drop_point={iteneray.drop_point}
              pickup_point={iteneray.pickup_point}
              itin_pdf={iteneray.itin_pdf}
            />
          </div>
        </div>
      </div>
      </div>
      
      {/* Mobile Sticky Price Bar - Only show when data is loaded */}
      {iteneray && iteneray.base_packages && Array.isArray(iteneray.base_packages) && iteneray.base_packages.length > 0 && (
        <MobileStickyPriceBar
          selectedPackage={selectedPackage}
          base_packages={iteneray.base_packages}
          selectedStartingPoint={selectedStartingPoint}
          selectedDroppingPoint={selectedDroppingPoint}
          selectedBatch={selectedBatch}
          openPopup={openPopup}
          handleSubmit={handleMobileBookNow}
        />
      )}
    </div>
  )
}

export default ItineraryPage