"use client"

import { fetchTermAndCondition } from '@/lib/thunks/fetchTermAndCondition';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function TermAndConditionSection() {

  const dispatch = useDispatch();
  const { termAndCondition } = useSelector((state) => state.global.termAndCondition) || [];
  
  useEffect(()=> {
    dispatch(fetchTermAndCondition());
  },[] )
          // const termAndCondition =
          //   useSelector((state) => state.global.termAndCondition) || []
            console.log("term and condition -", termAndCondition); 

  return (
    <div className=" space-y-6 shadow-lg p-3 mb-5 mx-16 bg-white rounded">
      <h1 className="md:text-4xl text-3xl text-black font-titleMedium w-full text-center">
        Term and Conditions
      </h1>
      {(
        <p className="text-center text-lg font-titleRegular text-gray-600 max-w-3xl mx-auto">
          If you proceed to pay you will be agreeing to our terms and conditions
        </p>
      )}
      
      <ol className="list-decimal list-inside mx-auto space-y-2 text-gray-700 text-sm text-left max-w-7xl">
        {/* {Array.isArray(termAndCondition) && termAndCondition.map((point, index) => (
          <li key={index} className="text-base md:text-base">
            {point}
          </li>
        ))} */}

        <h1> Array of Terms and Conditions</h1>
      </ol>
    </div>
  )
}

export default TermAndConditionSection
