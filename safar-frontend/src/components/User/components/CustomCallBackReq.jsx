"use client"
import React, { useState } from 'react'

import CustomCallbackBanner from '../../../_assets/svgs/user/CustomcallBackBanner.webp'

import CustomInput from '../../../components/CustomInput'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import CustomText from '../../../components/CustomText'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import Modal from '../../../components/CustomModal' // Custom modal component (assume you have one or can create one)
import { submitCallbackRequest } from '@/lib/thunks/submitCallbackRequest'
import { post } from '@/constants/axiosClient' // ADD THIS LINE
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

function CustomCallBackReq({ setShowCallBackForm, itineraryId , itineraryTitle }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    start_date: null,
    description: ''
  })

  const [errors, setErrors] = useState({})
  const [modal, setModal] = useState({ isOpen: false, status: '', message: '' })
  const dispatch = useDispatch()

  const validateForm = () => {
    const newErrors = {}
    if (!formState.name) newErrors.name = 'Name is required.'
    if (!formState.email) newErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formState.phone) newErrors.phone = 'Phone number is required.'
    else if (formState.phone.length < 10)
      newErrors.phone = 'Enter a valid phone number'
    if (!formState.start_date) newErrors.start_date = 'Start date is required.'
    if (!formState.description)
      newErrors.description = 'Description is required.'

    return newErrors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState((prevData) => ({
      ...prevData,
      [name]: value
    }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const handleDateChange = (date) => {
    setFormState((prevData) => ({
      ...prevData,
      start_date: date ? date._d : null
    }))
    setErrors((prevErrors) => ({ ...prevErrors, start_date: '' }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
  
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
  
    const formData = {
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      destination: formState.description, // Use description as destination
      travelDate: formState.start_date,
      travelers: 1, // Default to 1 since this form doesn't have travelers field
      itinerary_title: itineraryTitle || null,
    }
  
    try {
      const response = await post(API_ENDPOINTS.COMMON.CUSTOM_CALLBACK, formData) // CHANGE THIS LINE
  
      if (response.success) { // CHANGE THIS LINE
        setModal({
          isOpen: true,
          status: 'success',
          message: 'Your callback request was submitted successfully!'
        })
      } else {
        setModal({
          isOpen: true,
          status: 'error',
          message: 'Failed to submit your callback request. Please try again.'
        })
      }
    } catch (error) {
      setModal({
        isOpen: true,
        status: 'error',
        message: 'An error occurred while submitting your request.'
      })
    }
  }

  const closeModal = () => {
    setShowCallBackForm(false);
    setModal({ isOpen: false, status: '', message: '' })
  }

  return (
    <div className="md:w-full w-[230px] h-full">
      <img src={CustomCallbackBanner} alt="" />
      <form
        onSubmit={handleFormSubmit}
        className="md:grid md:grid-cols-2 block mt-4 gap-4"
      >
        <CustomInput
          isRequired={true}
          name="name"
          onchange={handleInputChange}
          custompadding="p-2"
          backgroundColor="white"
          top_title="Name"
          content="Enter your Name"
          aboveStyle="md:mt-0 mt-2"
          value={formState.name}
          error_text={errors.name}
        />
        <CustomInput
          aboveStyle="md:mt-0 mt-2"
          isRequired={true}
          top_title="Email"
          name="email"
          onchange={handleInputChange}
          custompadding="p-2"
          backgroundColor="white"
          content="Enter your Email"
          value={formState.email}
          error_text={errors.email}
        />
        <div className="w-full mt-2 md:mt-0">
          <label className="block text-sm font-nunitosemiBold600 mb-3">
            <div className="relative w-fit">
              Phone Number
              <span className="ml-0.5 absolute left-full text-red-600">*</span>
            </div>
          </label>
          <div className="flex justify-between w-fit gap-x-1">
            <input
              type="text"
              placeholder="+91"
              value={'+91'}
              readOnly
              className="border p-2 inline-block rounded-md h-fit w-[24%]"
            />
            <CustomInput
              isRequired={true}
              aboveStyle="w-full"
              className={'flex-shrink-0 w-full'}
              name="phone"
              onchange={handleInputChange}
              value={formState.phone}
              placeholder="Enter your Phone Number"
              custompadding="p-2"
              backgroundColor="white"
              set_input_type="number"
              error_text={errors.phone}
            />
          </div>
        </div>
        <div className="w-full mt-2 md:mt-0">
          <CustomText
            content={
              <div className="w-fit relative">
                Date{' '}
                <span className="ml-0.5 absolute left-full  text-red-600">
                  *
                </span>
              </div>
            }
            className={`mb-3 text-sm font-nunitosemiBold600 `}
          />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              className="w-full "
              value={formState.start_date ? moment(formState.start_date) : null}
              onChange={handleDateChange}
              minDate={moment().add(1, 'day')}
              format="DD-MM-YYYY"
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
              renderInput={(params) => (
                <CustomInput
                  {...params}
                  onClick={params.inputProps.onClick} // Open calendar on input click
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true, // Disable keyboard input
                    style: { cursor: 'pointer' } // Ensure cursor indicates clickable
                  }}
                  error_text={errors.start_date}
                />
              )}
              sx={{
                '.MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: '0.79px solid #D8D8D8'
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    border: '0.79px solid #D8D8D8'
                  }
                },
                '.MuiInputAdornment-root': {
                  marginRight: '8px' // Adjust right margin of the icon if needed
                },
                '.MuiInputBase-input': {
                  padding: '4px 8px' // Adjust inner text padding if needed
                },
                '.MuiInputBase-root': {
                  padding: '5px' // Optional: Adjust input padding if needed
                }
              }}
            />
          </LocalizationProvider>
        </div>
        <div className="md:col-span-2 md:mt-0 mt-2">
          <CustomText
            content={
              <div className="w-fit relative">
                Description
                <span className="ml-0.5 absolute left-full  text-red-600">
                  *
                </span>
              </div>
            }
            className={`mb-3 text-sm font-nunitosemiBold600 `}
          />
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            placeholder="Enter a brief description"
            className="w-full border rounded-md p-2"
          ></textarea>
          {errors.description && (
            <span className="text-red-600 text-sm">{errors.description}</span>
          )}
        </div>
        <button
          type="submit"
          className="col-span-2 md:w-[30%] w-full mx-auto bg-tertiaryText text-white py-2 md:mt-0 mt-2 rounded-xl"
        >
          Submit
        </button>
      </form>

      {/* Modal Component */}
      {
        <Modal
          open={modal.isOpen}
          handleClose={closeModal}
          restContent={
            <div
              className={`p-4 text-center ${
                modal.status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <h2 className="text-lg font-bold">
                {modal.status === 'success' ? 'Success' : 'Error'}
              </h2>
              <p className="mt-2">{modal.message}</p>
              <button
                onClick={closeModal}
                className="mt-4 bg-tertiaryText text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          }
        />
      }
    </div>
  )
}

export default CustomCallBackReq
