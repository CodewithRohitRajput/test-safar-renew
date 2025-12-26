import BookingSucessful from '@/components/User/BookingSummaryPage/BookingSucessful'
import React from 'react'
import { Suspense } from 'react'
const page = () => {
  return (
    <div>
    <Suspense fallback={<div className="w-full h-[50vh] flex items-center justify-center">Loading payment status...</div>}>
        <BookingSucessful/>
    </Suspense>
    </div>
  )
}

export default page
