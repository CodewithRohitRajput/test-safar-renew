"use client"

import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { useDispatch } from 'react-redux'
import { fetchsearchTrips } from '@/lib/thunks/fetchsearchTrips'
// import CustomeSelectTravler from '@/components/CustomeSelectTravler'
// import { FaSearch } from 'react-icons/fa'
import { MenuItem, Select } from '@mui/material'
import { useRouter } from 'next/navigation'
function valuetext(value) {
  return `${value} INR`
}

const marks = [
  { value: 0, label: '0' },
  { value: 20000, label: '20k' },
  { value: 40000, label: '40k' },
  { value: 60000, label: '60k' },
  { value: 80000, label: '80k' },
  { value: 100000, label: '1L' }
]

const SearchBar = ({ expanded, setExpanded }) => {
  const dispatch = useDispatch()
  const router = useRouter();

  // State for budget range, search query, and trip details
  const [value, setValue] = useState([0, 100000]) // Budget range slider values
  const [selectedTripType, setSelectedTripType] = useState('Select Trip Type') // Default trip type
  const [selectedDuration, setSelectedDuration] = useState('Select Trip Duration') // Default duration
  const [selectedMonth, setSelectedMonth] = useState('Select Trip Month') // Default month
  const [searchQuery, setSearchQuery] = useState('') // State to store search input

  const monthRef = useRef(null) // Ref for scrolling months

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const scrollMonths = (direction) => {
    if (monthRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      monthRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  

  const searchRef = useRef(null)
    const mobileSearchRef = useRef(null)

    const inputRef = useRef(null) // Reference for the search box

  // Close the expanded search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setExpanded(false) // Collapse the expanded search bar
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setExpanded])

  const handleKeyUp=(e)=>{
    if(e.key === 'Enter'){
      handleSearch();
    }
    
  }

  // Handler for searching the trips (calling the API)
  const handleSearch = () => {
    // Map month names to short forms for API request
    const monthMap = {
      January: 'jan',
      February: 'feb',
      March: 'mar',
      April: 'apr',
      May: 'may',
      June: 'jun',
      July: 'jul',
      August: 'aug',
      September: 'sept',
      October: 'oct',
      November: 'nov',
      December: 'dec'
    }

    const durationMap = {
      'Upto 1 Day': '0:1',
      '2 to 5 Days': '2:5',
      '5 to 7 Days': '5:7',
      '7+ Days': 7
    }

    // Dispatch the search action
    dispatch(
      fetchsearchTrips({
        search: searchQuery, // Include the text typed in the search box
        month: monthMap[selectedMonth], // Convert full month name to short form
        min_budget: value[0], // Slider's min value
        max_budget: value[1], // Slider's max value
        tripType: selectedTripType,
        tripDuration: durationMap[selectedDuration] // Pass the selected trip type as well
      })
    );
    router.push('/search');
    setExpanded(false)
  }

    useEffect(() => {
      if (expanded && inputRef.current) {
        inputRef.current.focus()
      }
    }, [expanded])

  return (
    <>
      <div
        ref={searchRef}
        className="relative   rounded-full border md:block sm:block hidden  border-gray-300  z-[999]"
      >
        <div className={` flex mx-4 justify-between items-center  px-4   `}>
          <input
            type="text"
            onKeyUp={handleKeyUp}
            className="  py-3  w-full outline-none border-0"
            placeholder="Search for Destinations"
            onFocus={() => setExpanded(true)} // Expands search when clicked
            value={searchQuery} // Bind search input to state
            onChange={(e) => setSearchQuery(e.target.value)} 
            suppressHydrationWarning={true}// Update state on input change
          />
          <button>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32A8 8 0 1114.32 12.9l5.38 5.38-1.42 1.42-5.38-5.38zM8 14a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          className={`absolute bg-white shadow-md px-14 rounded-lg w-full   ${
            expanded ? '' : 'hidden'
          }`}
        >
          <div className="py-4">
            {/* Trip Type Section */}
            <div className="space-y-4">
              <label className="block font-bold mb-2">Trip Type</label>
              <div className="flex flex-wrap text-sm space-x-2">
                {['Trekking', 'Weekend', 'Group', 'Solo'].map((type) => (
                  <button
                    key={type}
                    className={`border-2 py-2 px-4 rounded-full ${
                      selectedTripType === type
                        ? 'bg-blue-500 text-white' // Highlight if selected
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTripType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 min-w-full min-h-[0.5px] bg-gray-400"></div>

            {/* Trip Duration Section */}
            <div className="space-y-4">
              <label className="block font-bold mb-2">Trip Duration</label>
              <div className="flex flex-wrap text-sm space-x-2">
                {['Upto 1 Day', '2 to 5 Days', '5 to 7 Days', '7+ Days'].map(
                  (duration) => (
                    <button
                      key={duration}
                      className={`border-2 py-2 px-4 rounded-full ${
                        selectedDuration === duration
                          ? 'bg-blue-500 text-white' // Highlight if selected
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedDuration(duration)}
                    >
                      {duration}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 min-w-full min-h-[0.5px] bg-gray-400"></div>

            {/* Month Section with Scroll Buttons */}
            <div className="space-y-4">
              <label className="block font-bold mb-2">Month</label>
              <div className="relative flex items-center justify-center">
                <div
                  ref={monthRef}
                  className="flex flex-w text-sm space-x-2 overflow-scroll no-scrollbar"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                  ].map((month) => (
                    <button
                      key={month}
                      className={`border-2 py-2 px-4 rounded-full ${
                        selectedMonth === month
                          ? 'bg-blue-500 text-white' // Highlight if selected
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedMonth(month)}
                    >
                      {month}
                    </button>
                  ))}
                </div>

                {/* Scroll Right Button */}
                <div className="mx-3 flex items-center justify-between">
                  <button
                    className="border-2 border-gray-200 justify-center items-center flex w-10 h-10 p-2 rounded-full"
                    onClick={() => scrollMonths('left')}
                  >
                    {'<'}
                  </button>
                  <button
                    className="border-2 border-gray-200 justify-center items-center flex w-10 h-10   p-2 rounded-full"
                    onClick={() => scrollMonths('right')}
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 min-w-full min-h-[0.5px] bg-gray-400"></div>

            {/* Budget Section */}
            <div>
              <label className="block font-bold mb-2">Budget (INR)</label>
              <Box>
                <Slider
                  getAriaLabel={() => 'Budget range'}
                  value={value}
                  min={0}
                  size="small"
                  step={1000}
                  max={100000}
                  marks={marks}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                />
              </Box>

              <div className="flex justify-between text-sm mt-2 mx-auto">
                <div className="flex items-center justify-around  bg-gray-200 text-black rounded-lg">
                  <span className="px-4 w-fit">Min</span>
                  <input
                    type="text"
                    value={`INR ${value[0]}`}
                    className="border w-full border-gray-300 rounded py-2 px-4 text-left"
                    readOnly
                  />
                </div>

                <div className="flex items-center justify-around  bg-gray-200 text-black rounded-lg">
                  <span className="px-4">Max</span>
                  <input
                    type="text"
                    value={`INR ${value[1]}`}
                    className="border w-full border-gray-300 rounded py-2 px-4 text-left"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 min-w-full min-h-[0.5px] bg-gray-400"></div>

            {/* Search Button */}
            <div className=" mx-auto">
              <button
                className="bg-orange-500 text-white py-3 px-6 rounded-full w-full"
                onClick={handleSearch} // Trigger search
              >
                Search for trip
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={mobileSearchRef}
        className="relative pt-4 text-left rounded-full md:hidden sm:hidden w-full  block z-[999]"
      >
        <label htmlFor="search" className="block my-2 font-bold">
          Search
        </label>
        <div className="">
          {/* The input field should always be displayed, and expand should control the visibility of search box */}
          <input
            type="text"
            className={`w-full p-2 border-2 rounded-md border-gray-300 block text-black placeholder:text-gray-950 `} // Control visibility based on `expanded`
            placeholder="Search for Destinations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div
          className={
            `  py-2  rounded-lg w-full `
            //     ${
            //   expanded ? '' : 'hidden'
            // }
          }
        >
          {/* Trip Type Section */}
          <div className="space-y-2 ">
            <label className="block font-bold ">Trip Type</label>
            <Select
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedTripType}
              sx={{
                border: '1px solid rgba(128, 128, 128, 0.2)', // Light gray border with 50% opacity
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border color with opacity
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border on hover with opacity
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border on focus with opacity
                },
                '& .MuiSelect-select': {
                  padding: '0.5rem' // Adjust padding if needed
                }
              }}
              onChange={(event) => setSelectedTripType(event.target.value)}
            >
              {['Select Trip Type', 'Trekking', 'Weekend', 'Group', 'Solo'].map(
                (value, index) => (
                  <MenuItem className="h-0 text-xs" key={index} value={value}>
                    {value}
                  </MenuItem>
                )
              )}
            </Select>
          </div>

          {/* Divider */}
          <div className="my-3 min-w-full min-h-[0.5px] bg-gray-400"></div>

          {/* Trip Duration Section */}
          <div className="space-y-2">
            <label className="block font-bold ">Trip Duration</label>
            <Select
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedDuration}
              sx={{
                border: '1px solid rgba(128, 128, 128, 0.2)', // Light gray border with 50% opacity
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border color with opacity
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border on hover with opacity
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border on focus with opacity
                },
                '& .MuiSelect-select': {
                  padding: '0.5rem' // Adjust padding if needed
                }
              }}
              onChange={(event) => setSelectedDuration(event.target.value)}
            >
              {[
                'Select Trip Duration',
                'Upto 1 Day',
                '2 to 5 Days',
                '5 to 7 Days',
                '7+ Days'
              ].map((value, index) => (
                <MenuItem className="h-0 text-xs" key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {/* <div className="flex flex-wrap text-sm space-x-2">
              {.map(
                (duration) => (
                  <button
                    key={duration}
                    className={`border-2 py-2 px-4 rounded-full ${
                      selectedDuration === duration
                        ? 'bg-blue-500 text-white' // Highlight if selected
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedDuration(duration)}
                  >
                    {duration}
                  </button>
                )
              )}
            </div> */}
          </div>

          {/* Divider */}
          <div className="my-3 min-w-full min-h-[0.5px] bg-gray-400"></div>

          {/* Month Section with Scroll Buttons */}
          <div className="space-y-2">
            <label className="block font-bold ">Month</label>
            <Select
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedMonth}
              sx={{
                border: '1px solid rgba(128, 128, 128, 0.2)', // Light gray border with 50% opacity
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border color with opacity
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border on hover with opacity
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(128, 128, 128, 0.2)' // Light gray border on focus with opacity
                },
                '& .MuiSelect-select': {
                  padding: '0.5rem' // Adjust padding if needed
                }
              }}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              {[
                'Select Trip Month',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
              ].map((value, index) => (
                <MenuItem className="h-0 text-xs" key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Divider */}
          <div className="my-3 min-w-full min-h-[0.5px] bg-gray-400"></div>

          {/* Budget Section */}
          <div>
            <label className="block font-bold mb-2">Budget (INR)</label>
            <div className="px-4">
              <Box>
                <Slider
                  getAriaLabel={() => 'Budget range'}
                  value={value}
                  min={0}
                  size="small"
                  step={1000}
                  max={100000}
                  marks={marks}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                />
              </Box>
            </div>

            <div className="flex justify-between text-sm gap-2 mt-2 mx-auto">
              <div className="flex items-center justify-around  bg-gray-200 text-black rounded-lg">
                <input
                  type="text"
                  value={`INR ${value[0]}`}
                  className="border w-full border-gray-300 rounded py-2 px-4 text-left"
                  readOnly
                />
              </div>

              <div className="flex items-center justify-around  bg-gray-200 text-black rounded-lg">
                <input
                  type="text"
                  value={`INR ${value[1]}`}
                  className="border w-full border-gray-300 rounded py-2 px-4 text-left"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 w-full min-h-[0.5px] bg-gray-400"></div>

          {/* Search Button */}
          <div className="flex items-center justify-center">
            <button
              className="bg-orange-500 text-white py-2 px-4 mt-4 rounded-full w-full"
              onClick={handleSearch} // Trigger search
            >
              Search for trip
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchBar
