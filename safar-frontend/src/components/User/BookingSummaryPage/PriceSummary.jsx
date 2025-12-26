"use client"

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBooking } from '@/lib/thunks/createBooking'

const calculateTotalPrice = (travelers) => {
  return travelers.map((traveler) => {
    const startingPrice = traveler.startingPoint?.price || 0
    const droppingPrice = traveler.droppingPoint?.price || 0
    const packagePrice = traveler.selectedPackage?.discounted_price || 0

    const totalPrice = startingPrice + droppingPrice + packagePrice
    return {
      totalPrice,
      startingPrice,
      droppingPrice,
      packagePrice
    }
  })
}

const Summary = ({ prepeople }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    key: '',
    txnid: '',
    amount: 0,
    productinfo: '',
    firstname: '',
    email: '',
    phone: 0,
    surl: '',
    furl: '',
    hash: ''
  })

  const totalItineraryPrices = calculateTotalPrice(prepeople)

  async function handleBookNoww(event) {
    try {
      const itineraryPrice = totalItineraryPrices.reduce(
        (acc, item) => acc + item.totalPrice,
        0
      )

      // Dispatch the booking action and handle the response
      dispatch(createBooking(prepeople, itineraryPrice, total)).then(
        (bookingResponse) => {
          if (bookingResponse?.success) {
            const newFormData = {
              ...formData, // Keep existing values
              ...bookingResponse.data.payUData // Add new PayU details
            }

            //updateFormData(bookingResponse.data.payUData)
            // Set form data with the PayU details from the booking response
            setFormData({
              // Keep existing formData values
              ...bookingResponse.data.payUData // Override with new values
            })

            handleSubmit(event, newFormData)
            // Small timeout to ensure state is updated
          }
        }
      )
    } catch (error) {
      console.error('Error during booking:', error)
    }
  }

  const taxes =
    totalItineraryPrices.reduce((acc, item) => acc + item.totalPrice, 0) * 0.05
  const total =
    taxes + totalItineraryPrices.reduce((acc, item) => acc + item.totalPrice, 0)

  const handleSubmit = (e, newFormData) => {
    e.preventDefault()
    const form = document.forms.payuForm
    // form.formData = newFormData

    form.key.value = newFormData.key
    form.txnid.value = newFormData.txnid
    form.amount.value = newFormData.amount
    form.productinfo.value = newFormData.productinfo
    form.firstname.value = newFormData.firstname
    form.email.value = newFormData.email
    form.phone.value = newFormData.phone
    form.surl.value = newFormData.surl
    form.furl.value = newFormData.furl
    form.hash.value = newFormData.hash
    form.service_provider.value = newFormData.service_provider


    form.submit()
  }

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-lg md:w-[25%]">
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Booking Summary
      </h2>
      <p className="mb-6 text-center text-gray-500">
        To confirm your booking, pay 20% of the total amount. 30% will be
        collected before the trip, and the remaining 50% at the start of your
        journey.
      </p>

      <div className="mb-4 border-b border-gray-300"></div>

      {prepeople.map((traveler, index) => (
        <div key={index} className="mb-2 text-xs">
          <h3 className="mb-2 font-semibold">Person {index + 1}</h3>

          <div className="mb-1 flex items-center justify-between">
            <span>Starting Point: {traveler.startingPoint.name}</span>
            <span>
              ₹{totalItineraryPrices[index].startingPrice.toLocaleString()} /-
            </span>
          </div>

          <div className="mb-1 flex items-center justify-between">
            <span>Dropping Point: {traveler.droppingPoint.name}</span>
            <span>
              ₹{totalItineraryPrices[index].droppingPrice.toLocaleString()} /-
            </span>
          </div>

          <div className="mb-1 flex items-center justify-between">
            <span>Package: {traveler.selectedPackage.name}</span>
            <span>
              ₹{totalItineraryPrices[index].packagePrice.toLocaleString()} /-
            </span>
          </div>

          <div className="mb-1 flex items-center justify-between font-semibold">
            <span>Total Traveler Price</span>
            <span>
              ₹{totalItineraryPrices[index].totalPrice.toLocaleString()} /-
            </span>
          </div>

          <div className="mb-4 border-b border-gray-300"></div>
        </div>
      ))}

      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-semibold">Total Itinerary Price</span>
        <span className="font-semibold text-gray-700">
          ₹
          {totalItineraryPrices
            .reduce((acc, item) => acc + item.totalPrice, 0)
            .toLocaleString()}{' '}
          /-
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm">
        <span>Taxes (5% GST)</span>
        <span>₹{taxes.toLocaleString()} /-</span>
      </div>

      <div className="mb-3 border-b border-gray-300"></div>

      <div className="mb-1 flex items-center justify-between font-semibold">
        <span>Total</span>
        <span>₹{total.toLocaleString()} /-</span>
      </div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>Advance Booking Price</span>
        <span>₹{Math.round(total * 0.2)} /-</span>
      </div>
      <div className="mb-5 flex items-center justify-between text-sm">
        <span>Remaining Amount:</span>
        <span>₹{Math.round(total - total * 0.2)} /-</span>
      </div>

      <button
        onClick={(event) => handleBookNoww(event)}
        className="w-full rounded-full bg-gradient-to-l from-orange-400 to-orange-500 py-2 font-semibold text-white shadow-lg transition duration-300 hover:from-orange-500 hover:to-orange-600 hover:shadow-xl"
      >
        Proceed to Pay {`: ₹${Math.round(total * 0.2)}/-`}
      </button>

      <div className="max-h-full max-w-full">
        <form
          name="payuForm"
          action="https://secure.payu.in/_payment" // Change to live URL for production
          method="POST"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="key" value={formData.key} />
          <input type="hidden" name="txnid" value={formData.txnid} />
          <input type="hidden" name="amount" value={formData.amount} />
          <input
            type="hidden"
            name="productinfo"
            value={formData.productinfo}
          />
          <input type="hidden" name="firstname" value={formData.firstname} />
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="phone" value={formData.phone} />
          <input type="hidden" name="surl" value={formData.surl} />
          <input type="hidden" name="furl" value={formData.furl} />
          <input type="hidden" name="hash" value={formData.hash} />
          <input
            type="hidden"
            name="service_provider"
            value={formData.service_provider}
          />
        </form>
      </div>
    </div>
  )
}

export default Summary
