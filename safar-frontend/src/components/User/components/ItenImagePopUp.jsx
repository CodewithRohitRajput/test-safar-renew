import React, { useState, useEffect } from 'react'

const ItenImagePopUp = ({
  activeTab,
  images,}) => {
  const [showPopup, setShowPopup] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // useEffect(() => {
  //   if (isOpen) {
  //     // Show popup with zoom-in effect
  //     setIsClosing(false) // Ensure closing state is reset
  //     setShowPopup(true)
  //     setTimeout(() => setShowPopup(true), 50) // Delay to trigger zoom-in
  //   } else if (showPopup) {
  //     setIsClosing(true)
  //     setTimeout(() => {
  //       setShowPopup(false) // Hide popup after animation
  //       onClose() // Call the onClose callback
  //     }, 300) // Match with animation duration
  //   }
  // }, [isOpen, showPopup, onClose])

  // Filter images based on the active tab
  // const allImages = {
  //   view_images: [],
  //   activityImages: [],
  //   hotelImages: [],
  //   placeImages: []
  // }

  var filteredImages = []
  if (images && activeTab == 'all') {
    filteredImages = [
      ...images.view_images,
      ...images.activityImages,
      ...images.hotelImages,
      ...images.placeImages
    ]
  } else if (activeTab == 'destination') {
    filteredImages = [...images.placeImages]
  } else if (activeTab == 'activities') {
    filteredImages = [...images.activityImages]
  } else if (activeTab == 'hotel') {
    filteredImages = [...images.hotelImages]
  }


  return (
    <>
      <div className="hidden md:block">
        {/* Image Grid */}
        <div className=" gap-4  p-2 md:grid md:grid-cols-3 lg:grid-cols-4">
          {filteredImages?.map((image, index) =>
            image != '' ? (
              <div key={index} className="h-48 rounded-lg bg-gray-300">
                <img
                  src={image}
                  className="size-full rounded-lg object-cover"
                />
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className="block w-full md:hidden">
        {/* Image Grid */}
        <div className=" grid-cols-1 gap-y-4">
          {filteredImages?.map((image, index) =>
            image != '' ? (
              <div
                key={index}
                className="m-2 h-48 w-full rounded-lg bg-gray-300"
              >
                <img
                  src={image}
                  className="size-full rounded-lg object-cover"
                />
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  )
}

export default ItenImagePopUp
