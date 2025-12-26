"use client"

import React, { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { fetchsearchTrips } from '@/lib/thunks/fetchsearchTrips' // Assuming the thunk path is correct

const SearchResultsHero = () => {
  const dispatch = useDispatch()

  // Accessing search parameters from the Redux store
  const searchedParams =
    useSelector((state) => state.global.search_parmas) || {}

  // Single state to store all form values
  const [formValues, setFormValues] = useState({
    search: searchedParams.search,
    tripType: searchedParams.tripType || 'trekking',
    tripDuration: searchedParams.tripDuration || '7:7',
    month: searchedParams.month || 'jan',
    min_budget: searchedParams.min_budget || 0,
    max_budget: searchedParams.max_budget || 100000
  })

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

  // Sync with Redux store when the component mounts
  useEffect(() => {
    if (searchedParams) {
      setFormValues({
        search: searchedParams.search,
        tripType: searchedParams.tripType || '',
        tripDuration: searchedParams.tripDuration || '',
        month: searchedParams.month || '',
        min_budget: searchedParams.min_budget || 0,
        max_budget: searchedParams.max_budget || 100000
      })
    }
  }, [searchedParams])

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value // Dynamically update only the changed field
    }))
  }

  // Dispatch updates to the Redux store when the form values change
  const handleSearch = () => {
    dispatch(fetchsearchTrips(formValues))
  }

  return (
    <>
      <section className="bg-white md:block hidden py-12 text-center">
        <div className="mx-auto">
          <h1 className="text-5xl font-titleMedium">
            Search result for{' '}
            <span className="text-orange-500">{searchedParams.search}</span>
          </h1>
          <p className="text-gray-500 font-titleRegular w-[30%] mx-auto mt-4">
            {/* Lorem ipsum dolor sit amet consectetur. Enim semper non pretium
            dolor in blandit est venenatis metus risus. */}
          </p>

          {/* Search Bar Section */}
          <div className="mt-8  flex justify-center text-left">
            <div
              style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)' }}
              className="flex bg-white h-[10vh] rounded-full w-[56vw] p-4 justify-between items-center"
            >
              <div className="px-4">
                <label className="block text-gray-500 text-sm font-bold mb-1">
                  Trip Type
                </label>
                <select
                  name="tripType"
                  value={formValues.tripType}
                  onChange={handleInputChange}
                  className="text-black font-bold bg-transparent"
                >
                  <option value="trekking">Trekking</option>
                  <option value="weekend">Weekend</option>
                  <option value="solo">Solo</option>
                  <option value="group">Group</option>
                </select>
              </div>
              <div className="min-h-full min-w-[0.5px] bg-gray-500"></div>

              {/* Trip Duration Dropdown */}
              <div className="px-4 ">
                <label className="block text-gray-500 text-sm font-bold mb-1">
                  Trip Duration
                </label>
                <select
                  name="tripDuration"
                  value={formValues.tripDuration}
                  onChange={handleInputChange}
                  className="text-black font-bold bg-transparent"
                >
                  <option value="0:1">Upto 1 Day</option>
                  <option value="2:5">2-5 Days</option>
                  <option value="5:7">5-7 Days</option>
                  <option value="7:7">7+ Days</option>
                </select>
              </div>
              <div className="min-h-full min-w-[0.5px] bg-gray-500"></div>

              {/* Month Dropdown */}
              <div className="px-4">
                <label className="block text-gray-500 text-sm font-bold mb-1">
                  Month
                </label>
                <select
                  name="month"
                  value={formValues.month}
                  onChange={handleInputChange}
                  className="text-black font-bold bg-transparent"
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
                  ].map((month, index) => (
                    <option value={monthMap[month]}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="min-h-full min-w-[0.5px] bg-gray-500"></div>

              {/* Budget Min-Max Inputs */}
              <div className="px-4">
                <label className="block text-gray-500 text-sm font-bold mb-1">
                  Budget (INR)
                </label>
                <div className="flex justify-between items-center w-[14vw] ">
                  <span className="text-black mr-1 font-bold">₹</span>
                  <input
                    type="number"
                    name="minBudget"
                    placeholder="Min"
                    value={formValues.min_budget}
                    onChange={handleInputChange}
                    className="text-black font-bold bg-transparent border-none w-[40%] focus:outline-none"
                  />
                  <span className="inline-block mx-6 text-2xl">-</span>
                  <span className="text-black mr-1 font-bold">₹</span>
                  <input
                    type="number"
                    name="maxBudget"
                    placeholder="Max"
                    value={formValues.max_budget}
                    onChange={handleInputChange}
                    className="text-black font-bold bg-transparent border-none w-[40%] focus:outline-none"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                className="bg-orange-500 text-white rounded-full p-3 ml-4"
                onClick={handleSearch}
              >
                <FiSearch color="white" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white md:hidden font-titleRegular block py-4 text-center">
        <div className="mx-auto">
          <h1 className="text-2xl font-bold">
            Search result for{' '}
            <span className="text-orange-500">{searchedParams.search}</span>
          </h1>
          <p className="text-gray-500 mx-auto mt-2 px-4">
            {/* Lorem ipsum dolor sit amet consectetur. Enim semper non pretium
            dolor in blandit est venenatis metus risus. */}
          </p>

          {/* Search Bar Section */}
          <div className="mt-8 text-xs mx-4  flex justify-center text-left">
            <div
              style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)' }}
              className="flex items-center justify-between bg-white  rounded-lg p-2 "
            >
              <div>
                <div className="flex justify-between items-center p-2">
                  <div className="px-1">
                    <label className="block text-gray-500 font-bold mb-1">
                      Trip Type
                    </label>
                    <select
                      name="tripType"
                      value={formValues.tripType}
                      onChange={handleInputChange}
                      className="text-black font-bold bg-transparent"
                    >
                      <option value="">Types</option>
                      <option value="trekking">Trekking</option>
                      <option value="weekend">Weekend</option>
                      <option value="solo">Solo</option>
                      <option value="group">Group</option>
                    </select>
                  </div>
                  <div className="min-h-full min-w-[0.5px] bg-gray-500"></div>

                  {/* Trip Duration Dropdown */}
                  <div className="px-1 ">
                    <label className="block text-gray-500  font-bold mb-1">
                      Trip Duration
                    </label>
                    <select
                      name="tripDuration"
                      value={formValues.tripDuration}
                      onChange={handleInputChange}
                      className="text-black font-bold bg-transparent"
                    >
                      <option value="">Duration</option>
                      <option value="0:1">Upto 1 Day</option>
                      <option value="2:5">2-5 Days</option>
                      <option value="5:7">5-7 Days</option>
                      <option value="7:7">7+ Days</option>
                    </select>
                  </div>
                  <div className="min-h-full min-w-[0.5px] bg-gray-500"></div>
                </div>

                {/* Month Dropdown */}
                <div className="flex justify-center items-center p-2">
                  {' '}
                  <div className="px-1 ">
                    <label className="block text-gray-500  font-bold mb-1">
                      Month
                    </label>
                    <select
                      name="month"
                      value={formValues.month}
                      onChange={handleInputChange}
                      className="text-black font-bold bg-transparent"
                    >
                      {[
                        '',
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
                      ].map((month, index) =>
                        index == 0 ? (
                          <option value="">Months</option>
                        ) : (
                          <option value={monthMap[month]}>
                            {month || 'Months'}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className=" min-w-[0.5px] bg-gray-500"></div>
                  {/* Budget Min-Max Inputs */}
                  <div className="px-1 ">
                    <label className="block text-gray-500 text-xs font-bold mb-1">
                      Budget (INR)
                    </label>
                    <div className="flex justify-center items-center w-[30vw]  ">
                      <span className="text-black mr-1 font-bold">₹</span>
                      <input
                        type="number"
                        name="minBudget"
                        placeholder="Min"
                        value={formValues.minBudget}
                        onChange={handleInputChange}
                        className="text-black font-bold bg-transparent border-none w-[10vw]   focus:outline-none"
                      />
                      <span className="inline-block mx-6 text-2xl">-</span>
                      <span className="text-black mr-1 font-bold">₹</span>
                      <input
                        type="number"
                        name="maxBudget"
                        placeholder="Max"
                        value={formValues.maxBudget}
                        onChange={handleInputChange}
                        className="text-black font-bold bg-transparent border-none w-[10vw]   focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div>
                <button
                  className="bg-orange-500 text-white rounded-full p-2 ml-2"
                  onClick={handleSearch}
                >
                  <FiSearch color="white" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SearchResultsHero
