"use client"

import React, { useState, useRef } from 'react'



import { useDispatch } from 'react-redux'
import { createTripRequest } from '@/lib/thunks/createTripRequest'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'


// import CustomSelectTravler from '@/components/CustomeSelectTravler'
// import CustomSelect from '@/components/CustomSelect'
import { MenuItem, Select } from '@mui/material'

import NavBarFeature from '../components/NavBarFeature'
import CustomInput from '@/components/CustomInput'
import CustomText from '@/components/CustomText'
import TagInput from '../components/TegInput'
import moment from 'moment'
import CustomModal from '@/components/CustomModal'

function TripForm( {state,setState}) {
  const dispatch = useDispatch()
  const [submitFormData, setSubmitFormData] = useState({
    showPopUp: false,
    isSuccess: false
  })
  const inputFieldTextColor="black"

  // State management for the form, including tags
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requirements: '',
    source: '',
    destination: '',
    start_date: null, // Initialize with null for DatePicker
    preferred_hotel: '3 Star',
    peopleCount: '',
    nightStayCount: '',
    travelMode: '',
    activities: [] // Tags (activities) will be stored here
  })

  const [errors, setErrors] = useState({}) // State to manage error messages

  // Ref for the search input inside the filter
  // const filterSearchInputRef = useRef(null)

  // Handle changes to input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })) // Clear error when user modifies the input
  }

  // Handle date change specifically for DatePicker
  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      start_date: date ? date._d : '' // Set to ISO string for consistency
    }))
    setErrors((prevErrors) => ({ ...prevErrors, start_date: '' })) // Clear date error if date is selected
  }

  const handleActivitiesChange = (tags) => {
    setFormData((prevData) => ({
      ...prevData,
      activities: tags
    }))
  }

  // Validation function
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required.'
    if (!formData.email) newErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required.'
    else if(formData.phone.length<10) newErrors.phone = 'Enter a valid phone number'
    if (!formData.source) newErrors.source = 'Source is required.'
    if (!formData.destination)
      newErrors.destination = 'Destination is required.'
    if (!formData.start_date) newErrors.start_date = 'Start date is required.'
    if (!formData.preferred_hotel)
      newErrors.preferred_hotel = 'Preferred hotel is required.'
    if (!formData.peopleCount || formData.peopleCount<=0)
      newErrors.peopleCount = 'Number of people is required.'
    if (!formData.nightStayCount || formData.nightStayCount <= 0)
      newErrors.nightStayCount = 'Number of nights is required.'
    if (!formData.travelMode) newErrors.travelMode = 'Travel mode is required.'

    return newErrors
  }

  // Handle form submission
  const handleFormSubmit = () => {
    const tripData = {
      ...formData,
      
      people_count: Number(formData.peopleCount),
      night_stay_count: Number(formData.nightStayCount)
    }

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors) // Set the errors if validation fails
      return // Prevent submission if there are errors
    }

    dispatch(createTripRequest(tripData)).then((response) => {
     
      if (response.success) {
        setSubmitFormData((prev) => ({
          ...prev,
          showPopUp: true,
          isSuccess: true
        }))
      } else {
        setSubmitFormData((prev) => ({
          ...prev,
          showPopUp: true,
          isSuccess: false
        }))
        console.log('Error:', response.message)
      }

    
  }
  ) // Dispatch action if validation passes
  }

  return (
    <div className=" m-auto w-[100%] mx-auto z-[999]">
      {/* Navigation Features */}
      <div className="mx-auto md:w-[70%] w-full  grid grid-cols-10 justify-center items-center">
        <NavBarFeature
          title="Define Your Preferences"
          imageUrl="https://picsum.photos/100/100?random=1"
        />
        <hr className="border-0 col-span-2 h-[1px] mb-20 w-full" />
        <NavBarFeature
          title="Plan the Itinerary"
          imageUrl="https://picsum.photos/100/100?random=2"
        />
        <hr className="border-0 col-span-2 h-[1px] mb-20 w-full" />
        <NavBarFeature
          title="Review and Refine"
          imageUrl="https://picsum.photos/100/100?random=3"
        />
        <hr className="border-0 col-span-2 h-[1px] mb-20 w-full" />
        <NavBarFeature
          title="Enjoy Your Trip"
          imageUrl="https://picsum.photos/100/100?random=4"
        />
      </div>

      <div className="grid text-left grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Name */}
        <CustomInput
          top_title="Full Name"
          name="name"
          isRequired={true}
          value={formData.name}
          onchange={handleInputChange}
          placeholder="Enter your Name"
          custompadding="p-2"
          backgroundColor="white"
          error_text={errors.name}
          contentcolor={inputFieldTextColor}
          re
        />

        {/* Email */}
        <CustomInput
          top_title="Email"
          isRequired={true}
          name="email"
          value={formData.email}
          onchange={handleInputChange}
          placeholder="Enter your Email Address"
          custompadding="p-2"
          backgroundColor="white"
          error_text={errors.email}
          contentcolor={inputFieldTextColor}
        />

        {/* Phone Number */}
        <div className="w-full">
          <label className="block text-sm font-nunitosemiBold600 mb-3">
            <div className="relative w-fit">
              Phone Number
              <span className="ml-0.5 absolute left-full  text-red-600">*</span>
            </div>
          </label>
          <div className="flex justify-between w-full gap-x-2 ">
            <input
              type="text"
              placeholder="+91"
              value={'+91'}
              readOnly
              className="border p-2 inline-block rounded-md h-fit w-[20%]"
            />
            <CustomInput
              isRequired={true}
              aboveStyle="w-full"
              className={'flex-shrink-0 w-full'}
              name="phone"
              default_input_type={false}
              value={formData.phone}
              onchange={handleInputChange}
              placeholder="Enter your Phone Number"
              custompadding="p-2"
              backgroundColor="white"
              set_input_type="number"
              error_text={errors.phone}
              contentcolor={inputFieldTextColor}
            />
          </div>
        </div>

        {/* Source */}
        <CustomInput
          isRequired={true}
          top_title="Source"
          name="source"
          value={formData.source}
          onchange={handleInputChange}
          placeholder="City, State or Airport Code"
          custompadding="p-2"
          backgroundColor="white"
          error_text={errors.source}
          contentcolor={inputFieldTextColor}
        />

        {/* Destination */}
        <CustomInput
          isRequired={true}
          top_title="Destination"
          name="destination"
          value={formData.destination}
          onchange={handleInputChange}
          placeholder="City, State or Airport Code"
          custompadding="p-2"
          backgroundColor="white"
          error_text={errors.destination}
          contentcolor={inputFieldTextColor}
        />

        {/* Start Date (using DatePicker) */}
        <div>
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
              value={formData.start_date ? moment(formData.start_date) : null}
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

        {/* Accommodation Type */}
        <div className="w-full">
          <CustomText
            content={
              <div className="w-fit relative">
                Accommodation Type
                <span className="ml-0.5 absolute left-full  text-red-600">
                  *
                </span>
              </div>
            }
            className={`mb-3 text-sm font-nunitosemiBold600 `}
          />
          <Select
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '0.27rem',
                padding: '8px'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3B3B3B'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3B3B3B'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3B3B3B'
              },
              '& .MuiSelect-select': {
                padding: '8px 16px' // Increased padding for the text
              },
              '& .MuiSvgIcon-root': {
                right: '5px',
                top: '50%', // Center vertically
                transform: 'translateY(-50%)' // Adjust vertical position
                // padding: '12px' // Add padding to the icon
              }
            }}
            className="w-full"
            value={formData.preferred_hotel}
            defaultValue={''}
            onChange={(e) => {
              setFormData((prevState) => ({
                ...prevState,
                preferred_hotel: e.target.value
              }))
            }}
          >
            {['3 Star', '4 Star', '5 Star'].map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Number of People */}
        <CustomInput
          isRequired={true}
          top_title="Number of People"
          name="peopleCount"
          value={formData.peopleCount}
          onchange={handleInputChange}
          placeholder="Number of People"
          custompadding="p-2"
          backgroundColor="white"
          default_input_type={false}
          set_input_type="number"
          error_text={errors.peopleCount}
          contentcolor={inputFieldTextColor}
        />

        {/* Number of Night Stays */}
        <CustomInput
          isRequired={true}
          top_title="Number of Night Stays"
          name="nightStayCount"
          value={formData.nightStayCount}
          onchange={handleInputChange}
          placeholder="Number of Night Stays"
          custompadding="p-2"
          backgroundColor="white"
          default_input_type={false}
          set_input_type="number"
          error_text={errors.nightStayCount}
          contentcolor={inputFieldTextColor}
        />
      </div>

      {/* Mode of Travel */}
      <div className="flex flex-col md:flex-row items-start md:justify-start md:items-center">
        <p className="md:mr-4 font-bold relative">
          Mode of Travel:{' '}
          <span className="ml-0.5 absolute left-full font-normal text-red-600">*</span>
        </p>
        <div className="md:flex md:items-center md:space-x-16">
          {['SELF', 'TRAIN', 'AIR'].map((mode) => (
            <label key={mode} className="flex items-center">
              <input
                type="radio"
                name="travelMode"
                value={mode}
                onChange={handleInputChange}
                className="mr-2"
              />{' '}
              {mode}
            </label>
          ))}
        </div>
        {errors.travelMode && (
          <span className="text-red-500 m-2 text-sm ">{errors.travelMode}</span>
        )}
      </div>

      {/* Divider */}
      <div className="my-4 min-h-[0.5px] min-w-full bg-gray-400 "></div>

      {/* Activities and Requirements */}
      <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-nunitosemiBold600 mb-3">
            Activities
          </label>
          <TagInput
            tags={formData.activities}
            setTags={handleActivitiesChange}
          />
        </div>
        <CustomInput
          top_title="Requirements, If any"
          name="requirements"
          value={formData.requirements}
          onchange={handleInputChange}
          placeholder="Any Extra request you have"
          custompadding="p-2"
          backgroundColor="white"
          contentcolor={inputFieldTextColor}
        />
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleFormSubmit}
          className="px-6 py-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600"
        >
          Customize your Itinerary
        </button>
      </div>

      <CustomModal
        open={submitFormData.showPopUp}
        restContent={
          submitFormData.isSuccess ? (
            <div>
              <h1 className="text-2xl font-bold my-5">
                We have recieved your request
              </h1>
              <p className="mb-5">
                Your customized itinerary has been successfully submitted. We
                will review and adjust it as per your requirements and give you
                a call back
              </p>
              <button
                onClick={() => {
                  setSubmitFormData((prev) => ({
                    ...prev,
                    showPopUp: false,
                    isSUccess: false
                  }))
                  setState((prevState) => ({
                    ...prevState,
                    showForm: false,
                    isToggled: false
                  }))
                }}
                className="px-10 py-2 mt-5 text-sm rounded-full shadow-md bg-tertiaryText text-white"
              >
                Close
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold my-5">Submission Failed</h1>
              <p className="mb-5">
                Unfortunately, we were unable to submit your customized
                itinerary request. Please check your internet connection and try
                again, or contact our support team for assistance.
              </p>
              <button
                onClick={() => {
                  setSubmitFormData((prev) => ({
                    ...prev,
                    showPopUp: false,
                    isSUccess: false
                  }))
                  setState((prevState) => ({
                    ...prevState,
                    showForm: false,
                    isToggled: false
                  }))
                }}
                className="px-10 py-2 mt-5 text-sm rounded-full shadow-md bg-tertiaryText text-white"
              >
                Close
              </button>
            </div>
          )
        }
      />
    </div>
  )
}

export default TripForm
