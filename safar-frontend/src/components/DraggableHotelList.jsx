"use client"

import React, { useEffect, useState } from 'react'

import { FaPlus, FaMinus } from 'react-icons/fa'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { List, ListItem, IconButton, Box, Rating } from '@mui/material'
import CustomInput from './CustomInput'
import CustomText from './CustomText'
import { MdDragIndicator } from 'react-icons/md'
import {
  UPLOAD_PRESET_NAME,
  CLOUD_NAME
} from '../constants/CloudinaryConstants'

const DraggableHotelList = ({
  hotelstate: initialHotels,
  setHotels,
  to_show_error = false
}) => {
  const [hotels, setLocalHotels] = useState(
    initialHotels && initialHotels.length > 0
      ? initialHotels
      : [
          {
            name: '',
            rating: 0,
            images: [''],
            reference: ''
          }
        ]
  )

  useEffect(() => {
    setHotels(hotels)
  }, [hotels])

  // Function to validate if a hotel is properly filled
  const isHotelValid = (hotel) => {
    return (
      hotel.name.trim() !== '' &&
      hotel.rating > 0 &&
      hotel.reference.trim() !== '' &&
      hotel.images.some(img => img && img !== '')
    )
  }

  // Function to check if current hotel is valid before allowing new hotel addition
  const canAddNewHotel = () => {
    // Check if the last hotel in the list is valid
    const lastHotel = hotels[hotels.length - 1]
    return isHotelValid(lastHotel)
  }

  const addHotel = () => {
    // Only add hotel if the current last hotel is valid
    if (canAddNewHotel()) {
      setLocalHotels((prevHotels) => [
        ...prevHotels,
        {
          name: '',
          rating: 0,
          images: [''],
          reference: ''
        }
      ])
    }
  }

  const removeHotel = (index) => {
    setLocalHotels((prevHotels) => prevHotels.filter((_, i) => i !== index))
  }

  const handleInputChange = (index, field, value) => {
    const updatedHotels = [...hotels]
    updatedHotels[index][field] = value
    setLocalHotels(updatedHotels)
  }

  const handleFileInputChange = (index, fileIndex, file) => {
    const updatedHotels = [...hotels]
    updatedHotels[index].images[fileIndex] = file
    setLocalHotels(updatedHotels)
    handleUpload(index, fileIndex)
  }

  const addFileInput = (index) => {
    setLocalHotels((prevHotels) => {
      const newHotels = [...prevHotels]
      newHotels[index].images.push('')
      return newHotels
    })
  }

  const removeFileInput = (index, fileIndex) => {
    setLocalHotels((prevHotels) => {
      const newHotels = [...prevHotels]
      newHotels[index].images.splice(fileIndex, 1)
      return newHotels
    })
  }

  const handleImageChange = (hotelIndex, fileIndex, e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileInputChange(hotelIndex, fileIndex, file)
    }
  }
  const compressImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(imageFile)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxWidth = 800
        const scaleSize = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scaleSize

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            resolve(blob)
          },
          'image/jpeg',
          0.7
        )
      }

      img.onerror = (error) => reject(error)
    })
  }

  const handleUpload = async (index, fileIndex) => {
    const selectedImage = hotels[index].images[fileIndex]
    if (!selectedImage || selectedImage.img_uploaded || !selectedImage.name)
      return

    const compressedImageBlob = await compressImage(selectedImage)
    const compressedImageFile = new File(
      [compressedImageBlob],
      selectedImage.name,
      { type: 'image/jpeg' }
    )

    const formData = new FormData()
    formData.append('file', compressedImageFile)
    formData.append('upload_preset', UPLOAD_PRESET_NAME)

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then((response) => {
        if (!response.ok) throw new Error('Upload failed')
        return response.json()
      })
      .then((data) => {
        const updatedHotels = [...hotels]
        updatedHotels[index].images[fileIndex] = data.secure_url
        console.log('logging uploaded data', data.secure_url)
        setLocalHotels(updatedHotels)
      })
      .catch((error) => {
        console.error('Upload failed', error)
      })
  }

  return (
    <Box>
      <DragDropContext>
        <Droppable droppableId="hotels">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {hotels.map((hotel, hotelIndex) => (
                <Draggable
                  key={hotelIndex}
                  draggableId={`${hotelIndex}`}
                  index={hotelIndex}
                  isDragDisabled={true}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        flexDirection: 'column',
                        mb: 4,
                        border: '1px solid #ccc',
                        padding: '16px',
                        borderRadius: '8px',
                        backgroundColor: isHotelValid(hotel) ? '#f0f8f0' : '#fff5f5'
                      }}
                    >
                      <Box className="flex items-center justify-between w-full mb-2">
                        <div className="flex justify-center items-center">
                          <MdDragIndicator size={20} />
                          <CustomText
                            content={`Hotel ${hotelIndex + 1}`}
                            fontsize="12px"
                          />
                          {/* Show validation status */}
                          {isHotelValid(hotel) && (
                            <span className="ml-2 text-green-600 text-xs">✓ Complete</span>
                          )}
                        </div>
                        {/* Only show Add Hotel button if current hotel is valid and it's the last hotel */}
                        {hotelIndex === hotels.length - 1 && canAddNewHotel() && (
                          <IconButton onClick={addHotel} color="primary">
                            <FaPlus />
                          </IconButton>
                        )}
                        {/* Show message when hotel is incomplete */}
                        {hotelIndex === hotels.length - 1 && !canAddNewHotel() && (
                          <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            Complete this hotel to add another
                          </div>
                        )}
                      </Box>

                      {/* Hotel Name and Rating Inputs */}
                      <Box className="flex gap-4 justify-center items-center w-full mb-4">
                        <div className="w-full">
                          <CustomInput
                            value={hotel.name}
                            onchange={(e) =>
                              handleInputChange(
                                hotelIndex,
                                'name',
                                e.target.value
                              )
                            }
                            content="Enter hotel name"
                            backgroundColor="white"
                            top_title="Hotel Name"
                            error_text={
                              to_show_error &&
                              hotel.name.length == 0 &&
                              'Enter the hotel name to continue'
                            }
                          />
                        </div>
                        <div>
                          <CustomText
                            content={'Hotel Stars'}
                            fontsize="13px"
                            primaryfontweight
                          />
                          <Rating
                            name={`rating-${hotelIndex}`}
                            value={hotel.rating}
                            onChange={(e, newValue) =>
                              handleInputChange(hotelIndex, 'rating', newValue)
                            }
                            className="mt-5"
                          />
                          {to_show_error && hotel.rating == 0 && (
                            <div className="flex justify-start my-2">
                              <CustomText
                                content={'Please add a rating to continue'}
                                className="text-red-500"
                                fontsize="12px"
                              />
                            </div>
                          )}
                        </div>
                      </Box>

                      {/* Hotel Reference Link and File Inputs */}
                      <div className="flex gap-4">
                        <Box className="flex w-full mb-4">
                          <div className="w-full">
                            <CustomInput
                              value={hotel.reference}
                              onchange={(e) =>
                                handleInputChange(
                                  hotelIndex,
                                  'reference',
                                  e.target.value
                                )
                              }
                              content=" Enter the link of hotel"
                              backgroundColor="white"
                              top_title="Hotel Reference Link"
                              error_text={
                                to_show_error &&
                                hotel.reference.length == 0 &&
                                'Enter the hotel reference to continue'
                              }
                            />
                          </div>
                        </Box>

                        {/* Image Upload Inputs */}
                        <Box className="flex flex-col w-full mb-4">
                          {hotel.images.map((image, fileIndex) => (
                            <Box
                              key={fileIndex}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 2
                              }}
                            >
                              <div
                                className={`flex flex-wrap justify-center items-center rounded-md border border-dashed border-black p-3 bg-[#FAFAFA]`}
                              >
                                <button
                                  className="font-nunitoregular400 text-white bg-black py-3 px-8 rounded-md"
                                  onClick={() => {
                                    if (image?.name == null) {
                                      document
                                        .getElementById(
                                          `inputfile-${hotelIndex}-${fileIndex}`
                                        )
                                        .click()
                                    } else {
                                      handleUpload(hotelIndex, fileIndex)
                                    }
                                  }}
                                  disabled={
                                    typeof image === 'string' && image !== ''
                                  }
                                >
                                  {typeof image === 'string' && image !== ''
                                    ? 'Image Uploaded'
                                    : image && image.name
                                      ? 'Upload'
                                      : 'Browse...'}
                                </button>

                                {(!image ||
                                  (typeof image !== 'string' &&
                                    image !== '')) && (
                                  <button
                                    className="font-nunitoregular400 text-black py-3 px-8 rounded-md"
                                    onClick={() =>
                                      document
                                        .getElementById(
                                          `inputfile-${hotelIndex}-${fileIndex}`
                                        )
                                        .click()
                                    }
                                  >
                                    {image && image.name
                                      ? image.name
                                      : 'Or drop Brochure Activity Images here'}
                                  </button>
                                )}

                                <input
                                  id={`inputfile-${hotelIndex}-${fileIndex}`}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageChange(hotelIndex, fileIndex, e)
                                  }
                                />
                              </div>
                              {hotel.images.length > 1 && (
                                <IconButton
                                  onClick={() =>
                                    removeFileInput(hotelIndex, fileIndex)
                                  }
                                  color="error"
                                  sx={{ marginLeft: '8px' }}
                                >
                                  <FaMinus />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          {to_show_error && hotel.images?.[0]?.length == 0 && (
                            <div className="flex justify-start my-2">
                              <CustomText
                                content={'Please add a image to continue'}
                                className="text-red-500"
                                fontsize="12px"
                              />
                            </div>
                          )}
                          <IconButton
                            onClick={() => addFileInput(hotelIndex)}
                            color="primary"
                          >
                            <FaPlus />
                          </IconButton>
                        </Box>
                      </div>

                      {/* Remove Hotel Button */}
                      {hotels.length > 1 && (
                        <IconButton
                          onClick={() => removeHotel(hotelIndex)}
                          color="error"
                          sx={{ marginTop: '8px' }}
                        >
                          <FaMinus />
                        </IconButton>
                      )}
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

export default DraggableHotelList