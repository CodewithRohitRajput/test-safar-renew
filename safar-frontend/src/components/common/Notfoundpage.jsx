"use client"

import React from 'react'
import NotFoundImage from '@/_assets/svgs/404.svg'
import AdminBackground from '@/_assets/svgs/AdminBackground.svg'

import { useRouter } from 'next/navigation'
import { PAGES } from '../../constants/PagesName'
import Image from 'next/image'

function NotFound() {
  const router = useRouter()
  const handleBackToDashboardClick = () => {
    router.push(PAGES.DASHBOARD, { replace: true })
  }
  return (
    <div
      className=" h-screen w-full bg-cover bg-center flex items-center justify-center"
      // style={{ backgroundImage: `url(${AdminBackground})` }}
    >
      <Image src={AdminBackground} alt="bg image" className="h-screen w-screen absolute object-cover z-[-1] " />
      <div className=" bg-white p-14 rounded-lg shadow-md overflow-auto flex flex-col justify-between items-center">
        <div className="py-4">
          <div className="mb-10">
            <Image src={NotFoundImage} alt="not_found_img" />
          </div>
          <div className="w-full">
            <h1 className="font-nunitobold700 text-center text-2xl mb-5 ">
              Looks like you've got lost....
            </h1>
            <button
              onClick={handleBackToDashboardClick}
              className={`font-nunitobold700 w-full p-2 bg-buttonBackground rounded-lg text-buttonText`}
            >
              Back To Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
