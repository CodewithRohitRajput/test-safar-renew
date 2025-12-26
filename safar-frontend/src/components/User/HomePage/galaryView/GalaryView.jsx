"use client"

import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { fetchGalleryImages } from '@/lib/thunks/fetchGalleryImages'
import CustomModal from '@/components/CustomModal'
import ImagePopup from '../../components/ImagePopUp'

const Gallery = () => {
  const [isPopupOpen, setPopupOpen] = useState(false)

  const images = useSelector((state) => state.global.GalleryImages) || []

  //splice the images to 5 lenght and store it on a variable name showImg
  const showImages = images?.slice(0, 5)
  const dispatch = useDispatch()

  useEffect(() => {
    if (images.length == 0) dispatch(fetchGalleryImages())
  }, [dispatch])

  return (
    images.length != 0 && (
      <div className=" mb-0  md:p-24  ">
        <div className="relative"></div>
        <div className="mx-auto text-center">
          <h2 className="mb-4 font-titleMedium  text-2xl md:text-5xl">
            Snapshots of <span className="text-orange-500">Safar</span>
          </h2>
          <p className="text-[rgba(20, 20, 22, 0.4)] mx-auto mb-8 whitespace-pre-line font-titleRegular text-sm md:text-base">
            {`With Safar Wanderlust, every photo tells a tale of adventure, connection, and discovery. Step into our travelers' journeys,\n and let their captured moments inspire your next adventure`}
          </p>

          <div className="hidden grid-cols-4 grid-rows-2 gap-4 md:grid">
            {showImages.map((image, index) => (
              <div
                key={index}
                className={`relative ${
                  index === 1
                    ? 'col-span-2 row-span-2 max-h-[462px]' // Larger image in grid
                    : 'col-span-1 row-span-1 max-h-[225px]' // Smaller images in grid
                }`}
              >
                <img
                  src={image.images}
                  className="size-full rounded-lg object-cover object-center"
                />
                {index + 1 === 5 && (
                  <div
                    onClick={() => setPopupOpen(true)}
                    className="absolute inset-0 flex size-full items-center justify-center rounded-lg bg-black bg-opacity-50"
                  >
                    <span className="text-lg font-bold text-white">More +</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-row gap-4 overflow-x-scroll  md:hidden">
            {showImages.map((image, index) => (
              <div key={index} className="relative min-w-[200px]">
                <img
                  src={image.images}
                  className=" h-52 w-full rounded-3xl object-cover object-center"
                />
                {index + 1 === 5 && (
                  <div
                    onClick={() => setPopupOpen(true)}
                    className="absolute inset-0  flex items-center justify-center rounded-lg bg-black/50"
                  >
                    <span className="text-lg font-bold text-white">More +</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <CustomModal
          title={
            <div className="flex w-full items-center justify-between border-b pb-2 text-base">
              <div>
                {/* Tabs */}
                <button className={`mr-4 font-bold text-orange-500`}>
                  All Images ({images.length})
                </button>
              </div>
              <button
                onClick={() => setPopupOpen(false)}
                className="text-xl font-bold text-black"
              >
                &times;
              </button>
            </div>
          }
          open={isPopupOpen}
          restContent={
            <div className="w-max">
              <ImagePopup
                isOpen={isPopupOpen}
                onClose={() => setPopupOpen(false)}
                images={images}
              />
            </div>
          }
        />
      </div>
    )
  )
}

export default Gallery
