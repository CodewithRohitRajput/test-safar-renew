"use client"

import React, { useState, useEffect } from 'react'
import FinalPaymentPage from './FinalPaymentPage '
import Summary from './PriceSummary'
import moment from 'moment'
import CustomModal from '../../../components/CustomModal'
import { useDispatch, useSelector } from 'react-redux'
import TravellerForm from '../itineraryPage/TravellerForm'
// import { useNavigate } from 'react-router-dom'
import { useRouter } from 'next/navigation'
// import { createBooking } from '../../../redux/thunks/createBooking'
import AffordabilityWidget from './AffordabilityWidget'
import TermAndConditionSection from './TermAndConditionSection'
import { fetchTermAndCondition } from '@/lib/thunks/fetchTermAndCondition'

function BookingSummaryPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  // const navigate = useNavigate()
  const router = useRouter()


  const dispatch = useDispatch();
  // Get prepeople from the global state
  const prepeople =
    useSelector((state) => state.global.BookingPeopleDetails) || []

  // Get itinerary information from the global state
  const iteneray = useSelector((state) => state.global.itenerayByID) || []

  // Redirect to the home page if no prepeople data is found
  useEffect(() => {
    if (!prepeople[0]) {
      router.push('/') // Redirect to home if prepeople array is empty
    }
      dispatch(fetchTermAndCondition())
  }, [prepeople, router]) // Dependency on prepeople and navigate

  // Open popup function
  const openPopup = () => {
    setIsPopupOpen(true)
  }

  // Close popup function
  const closePopup = () => {
    setIsPopupOpen(false)
  }

  // If no valid prepeople data, render null
  if (!prepeople[0]) {
    return null
  }

  return (
    <>
      <div className="md:block hidden">
        <div className="w-full text-center">
          <h1 className="text-4xl">Himalayan Highlights Adventure</h1>
          <p className="my-4">
            From {prepeople[0]?.startingPoint.name} to{' '}
            {prepeople[0]?.droppingPoint.name} | Batch :{' '}
            {moment(prepeople[0]?.selectedBatch.start_date).format('DD-MMM ')}{' '}
            To {moment(prepeople[0]?.selectedBatch.end_date).format('DD-MMM ')}
          </p>
        </div>

        <div className="w-[100%] bg-gray-50 p-10 flex justify-around items-start">
          <FinalPaymentPage openPopup={openPopup} prepeople={prepeople} />
          <Summary prepeople={prepeople}  />
        </div>
        <div className="bg-gray-50 ">
          <TermAndConditionSection />
        </div>

        <CustomModal
          open={isPopupOpen}
          backdropvalue="0.1"
          handleClose={closePopup}
          title={
            <span>
              Edit <span className="text-orange-500">Traveller</span>{' '}
              Information
            </span>
          }
          description="The information you fill below is needed to quote and book your trip."
          restContent={
            <div className="w-[65vw]">
              <TravellerForm
                isOpen={isPopupOpen}
                onClose={closePopup}
                base_packages={iteneray.base_packages}
                drop_point={iteneray.drop_point}
                pickup_point={iteneray.pickup_point}
                selectedBatch={prepeople[0]?.selectedBatch}
                selectedDroppingPoint={prepeople[0]?.droppingPoint}
                selectedPackage={prepeople[0]?.selectedPackage}
                selectedStartingPoint={prepeople[0]?.startingPoint}
                prepeople={prepeople}
              />
            </div>
          }
        />
      </div>
      <div className="md:hidden block">
        <div className="w-full text-center">
          <h1 className="text-2xl">Himalayan Highlights Adventure</h1>
          <p className="my-2 text-xs">
            From {prepeople[0]?.startingPoint.name} to{' '}
            {prepeople[0]?.droppingPoint.name} | Batch :{' '}
            {moment(prepeople[0]?.selectedBatch.start_date).format('DD-MMM ')}
            To {moment(prepeople[0]?.selectedBatch.end_date).format('DD-MMM ')}
          </p>
        </div>

        <div className=" bg-gray-50 p-4">
          <FinalPaymentPage openPopup={openPopup} prepeople={prepeople} />
          <Summary prepeople={prepeople}  />
        </div>

        <CustomModal
          open={isPopupOpen}
          backdropvalue="0.1"
          handleClose={closePopup}
          title={
            <span>
              Edit <span className="text-orange-500">Traveller</span>{' '}
              Information
            </span>
          }
          description="The information you fill below is needed to quote and book your trip."
          restContent={
            <div className="w-[65vw]">
              <TravellerForm
                isOpen={isPopupOpen}
                onClose={closePopup}
                base_packages={iteneray.base_packages}
                drop_point={iteneray.drop_point}
                pickup_point={iteneray.pickup_point}
                selectedBatch={prepeople[0]?.selectedBatch}
                selectedDroppingPoint={prepeople[0]?.droppingPoint}
                selectedPackage={prepeople[0]?.selectedPackage}
                selectedStartingPoint={prepeople[0]?.startingPoint}
                prepeople={prepeople}
              />
            </div>
          }
        />
      </div>
    </>
  )
}

export default BookingSummaryPage
