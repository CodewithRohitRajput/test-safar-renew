"use client"
import React, { useState, useEffect } from 'react'

const ImagePopup = ({ isOpen, onClose, images, isMainGalary = true }) => {
  const [showPopup, setShowPopup] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Show popup with zoom-in effect
      setIsClosing(false) // Ensure closing state is reset
      setShowPopup(true)
      setTimeout(() => setShowPopup(true), 50) // Delay to trigger zoom-in
    } else if (showPopup) {
      setIsClosing(true)
      setTimeout(() => {
        setShowPopup(false) // Hide popup after animation
        onClose() // Call the onClose callback
      }, 300) // Match with animation duration
    }
  }, [isOpen, showPopup, onClose])

  const [activeTab, setActiveTab] = useState('all')

  // Filter images based on the active tab
  const filteredImages = images.filter((image) => {
    if (activeTab === 'all') return true
    return image.category === activeTab
  })

  return (
    <div>
      {/* Header with Close Button */}

      {/* Image Grid */}
      <div className="grid grid-cols-1 gap-4   md:grid-cols-3 lg:grid-cols-4">
        {filteredImages.map((image, index) => (
          <div key={index} className="size-52 rounded-lg p-4">
            <img src={image.images} className="size-full  rounded-lg " />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImagePopup
