"use client"

import React, { useEffect, useId, useState } from 'react'
import CustomText from './CustomText'
import { CircularProgress } from '@mui/material'
import {
  CLOUD_NAME,
  UPLOAD_PRESET_NAME
} from '../constants/CloudinaryConstants'

export default function CustomInputFile({
  btncontent = 'Browse...',
  second_title_btn = 'Or drop Feature Image here',
  top_title_content = 'Upload Images: ',
  className = '',
  no_right_margin = false,
  small_btn = false,
  no_title = true,
  onChange,
  state = null,
  setstate = () => {},
  inputId = useId(),
  to_compressImage = true,
  convertimgtype = 'image/jpeg'
}) {
  const [selectedImage, setSelectedImage] = useState(state || null)
  const [imageUploaded, setImageUploaded] = useState(false)
  const [imguploading, setimguploading] = useState(false)

  useEffect(() => {
    if (state != null && state?.name != null) {
      setSelectedImage(state)
      setImageUploaded(false)
    } else if (state && state?.length > 0) {
      setImageUploaded(true)
    }
  }, [state])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setstate(file)
      setImageUploaded(false)

      if (onChange) onChange(file)

      handleUpload(file)
      e.target.value = null
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
          convertimgtype,
          0.7
        )
      }

      img.onerror = (error) => reject(error)
    })
  }
  const convertImageType = async (imageFile, targetType = 'image/webp') => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(imageFile)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            resolve(blob)
          },
          targetType,
          1.0
        )
      }

      img.onerror = (error) => reject(error)
    })
  }

  const handleUpload = async (newSelectedImage) => {
    setimguploading(true)
    if (!newSelectedImage || imageUploaded) return

    let compressedImageFile = null
    let convertedImageFile = null
    if (to_compressImage == true) {
      const compressedImageBlob = await compressImage(newSelectedImage)
      compressedImageFile = new File(
        [compressedImageBlob],
        newSelectedImage.name,
        { type: 'image/jpeg' }
      )
    } else {
      const convertedImageBlob = await convertImageType(newSelectedImage)
      convertedImageFile = new File(
        [convertedImageBlob],
        newSelectedImage.name,
        { type: 'image/webp' }
      )
    }

    const formData = new FormData()
    if (to_compressImage == true) {
      formData.append('file', compressedImageFile)
    } else {
      formData.append('file', convertedImageFile)
    }

    formData.append('upload_preset', UPLOAD_PRESET_NAME)

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          'handleUpload - Image uploaded successfully:',
          data.secure_url
        )
        setImageUploaded(true)
        setstate(data.secure_url)
        setimguploading(false)
      })
      .catch((error) => {
        console.error('Upload failed', error)
        setImageUploaded(false)
      })
  }

  return (
    <div className={`${className}`}>
      {no_title && (
        <CustomText
          fontsize="13px"
          className="text-black mb-3 flex self-start"
          secondaryfontsize
          secondaryfontweight
          content={top_title_content}
        />
      )}

      <div
        className={`${
          !no_right_margin ? 'mr-44' : ''
        } flex flex-wrap rounded-md border border-dashed border-black ${
          small_btn ? 'p-1' : 'p-3'
        } bg-[#FAFAFA]`}
      >
        {imguploading ? (
          <CircularProgress
            sx={{
              color: 'orange'
            }}
            className="p-1"
            size={50}
          />
        ) : (
          <button
            className="font-nunitoregular400 text-white bg-black py-3 px-8 rounded-md"
            onClick={() => {
              if (selectedImage == null) {
                document.getElementById(inputId).click()
              } else {
                handleUpload()
              }
            }}
            disabled={imageUploaded}
          >
            {imageUploaded
              ? 'Image Uploaded'
              : selectedImage != null
                ? 'Upload'
                : btncontent}
          </button>
        )}

        {!imageUploaded && (
          <button
            className="font-nunitoregular400 text-black py-3 px-8 rounded-md"
            onClick={() => document.getElementById(inputId).click()}
          >
            {!selectedImage && !imageUploaded
              ? second_title_btn
              : selectedImage
                ? selectedImage?.name
                : btncontent}
          </button>
        )}
        {imageUploaded && (
          <button
            className="font-nunitoregular400 text-red-500 py-3 px-8 rounded-md"
            onClick={() => {
              setstate(null),
                setImageUploaded(false),
                setSelectedImage(null),
                setimguploading(false)
            }}
          >
            Remove Image
          </button>
        )}

        <input
          id={inputId}
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  )
}
