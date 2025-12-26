import React, { useState } from 'react'
import { IoLocationSharp } from 'react-icons/io5'

import ItenImagePopUp from '../components/ItenImagePopUp'
import CustomModal from '../../../components/CustomModal'




function ItenerayImageSection({ allImages, title, description, city }) {
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [isMobilePopupOpen, setMobilePopupOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [isPopUpOpen, setPopUpOpen] = useState(false)
  const [popUpImage, setPopUpImage] = useState(null)

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const images = []
  images.push(allImages?.view_images[0])
  images.push(allImages?.hotelImages[0])
  images.push(allImages?.activityImages[0])
  images.push(allImages?.placeImages[0])

  const filteredViewImages = (allImages?.view_images ?? []).filter(
    (image) => image !== ''
  )
  const filteredHotelImages = (allImages?.hotelImages ?? []).filter(
    (image) => image !== ''
  )
  const filteredActivityImages = (allImages?.activityImages ?? []).filter(
    (image) => image !== ''
  )
  const filteredPlaceImages = (allImages?.placeImages ?? []).filter(
    (image) => image !== ''
  )
  let mainPageImages = [
    ...filteredViewImages,
    ...filteredHotelImages,
    ...filteredActivityImages,
    ...filteredPlaceImages
  ]
  mainPageImages = mainPageImages.slice(0, 4)

  const titleSplit = title?.split(' ')
  var secondWord = ''
  for (let i = 1; i < titleSplit?.length; i++) {
    secondWord += titleSplit[i] + ' '
  }

  return (
    <>
      <div className="hidden md:block">
        <div
          className={`mx-auto my-10 grid w-[70%] grid-flow-row  grid-cols-4 gap-4`}
        >
          {mainPageImages?.map((image, index) => (
            // <div key={image.id} className="group rounded-xl overflow-hidden">
            <div
            className={`relative flex items-center justify-center overflow-hidden ${
              index + 1 == 1 && mainPageImages.length == 1
                ? 'col-span-4 row-span-2 max-h-[450px]'
                : index + 1 == 1
                  ? 'col-span-2 row-span-2 max-h-[450px]'
                  : 'max-h-[200px]'
            } ${
              index + 1 == 2 && mainPageImages.length == 2
                ? 'col-span-2 row-span-2 max-h-[450px]'
                : index + 1 == 2
                  ? 'col-span-2 row-span-1'
                  : ''
            }
             ${
               index + 1 == 3 && mainPageImages.length == 3
                 ? 'col-span-2 row-span-1'
                 : ''
             }
            `}
            key={index}
          >
            <img
              src={image}
              className="size-full rounded-lg object-cover"
              loading="lazy"
              alt={`Image ${index + 1}`}
              style={{
                imageRendering: 'high-quality',
                imageRendering: '-webkit-optimize-contrast',
                imageRendering: 'crisp-edges',
                WebkitFontSmoothing: 'antialiased',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
              }}
            />
              {/* Overlay */}
              {4 === index + 1 && (
                <div
                  onClick={() => setPopupOpen(true)}
                  className=" absolute inset-0 flex size-full items-center  justify-center rounded-lg  bg-black bg-opacity-50 "
                >
                  <span className="text-lg font-bold text-white">More +</span>
                </div>
              )}
            </div>
            /* </div> */
          ))}
        </div>
        <div className="mx-auto my-4 w-[70%] text-center font-titleRegular">
          <h1 className="text-5xl">
            <span className="text-tertiaryText">
              {titleSplit && titleSplit[0]}
            </span>{' '}
            {secondWord}
          </h1>
          <h3 className="m-5 flex items-center justify-center text-2xl  ">
            <IoLocationSharp /> {city}
          </h3>
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: description || '' }}></div>
        </div>
        <CustomModal
          open={isPopupOpen}
          title={
            <div className="sticky top-0 z-10 bg-white">
              <div className="flex items-center justify-between border-b pb-2 text-base">
                <div>
                  <button
                    onClick={() => handleTabClick('all')}
                    className={`mr-4 ${
                      activeTab === 'all' ? 'font-bold text-orange-500' : ''
                    }`}
                  >
                    All Images
                  </button>
                  {
                    <button
                      onClick={() => handleTabClick('destination')}
                      className={`mr-4 ${
                        activeTab === 'destination'
                          ? 'font-bold text-orange-500'
                          : ''
                      }`}
                    >
                      Destination
                    </button>
                  }
                  {
                    <button
                      onClick={() => handleTabClick('activities')}
                      className={`mr-4 ${
                        activeTab === 'activities'
                          ? 'font-bold text-orange-500'
                          : ''
                      }`}
                    >
                      Activities
                    </button>
                  }
                  {
                    <button
                      onClick={() => handleTabClick('hotel')}
                      className={`mr-4 ${
                        activeTab === 'hotel' ? 'font-bold text-orange-500' : ''
                      }`}
                    >
                      Hotel
                    </button>
                  }
                </div>
                <button
                  onClick={() => setPopupOpen(false)}
                  className="text-xl font-bold text-black"
                >
                  &times;
                </button>
              </div>
            </div>
          }
          restContent={
            <div className=" h-[33rem] w-[60vw] max-w-[60rem]">
              <ItenImagePopUp
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                images={allImages}
                isMainGalary={false}
              />
            </div>
          }
        />
      </div>
      <div className="block px-6 md:hidden">
        <div className="grid grid-cols-3 gap-4 py-4">
          {mainPageImages.length < 3 ? (
            <div
              className="relative col-span-3 flex items-center justify-center overflow-hidden"
            >
              <img
                src={mainPageImages[0]}
                className="w-full aspect-[16/9] rounded-lg object-cover"
                loading="lazy"
                alt="Main itinerary image"
                style={{
                  imageRendering: 'high-quality',
                  imageRendering: '-webkit-optimize-contrast',
                  WebkitFontSmoothing: 'antialiased',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                }}
              />
            </div>
          ) : (
            mainPageImages?.map((image, index) => (
              <div
                key={index}
                className={`relative flex items-center justify-center overflow-hidden ${
                  index + 1 == 1 ? 'col-span-3' : 'col-span-1'
                }`}
              >
                <img
                  src={image}
                  className={`w-full rounded-lg object-cover ${
                    index + 1 == 1 ? 'aspect-[16/9]' : 'aspect-square'
                  }`}
                  loading="lazy"
                  alt={`Itinerary image ${index + 1}`}
                  style={{
                    imageRendering: 'high-quality',
                    imageRendering: '-webkit-optimize-contrast',
                    WebkitFontSmoothing: 'antialiased',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                  }}
                />
                {/* Overlay */}
                {mainPageImages.length === index + 1 && (
                  <div
                    onClick={() => setMobilePopupOpen(true)}
                    className="absolute inset-0 flex size-full items-center justify-center rounded-lg bg-black bg-opacity-50"
                  >
                    <span className="text-lg font-bold text-white">More +</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="mx-auto my-4 text-center">
          <h2 className="text-2xl">
            <span className="text-tertiaryText">
              {titleSplit && titleSplit[0]}
            </span>{' '}
            {secondWord}
          </h2>
          <h3 className=" mb-2 flex items-center justify-center text-base  ">
            <IoLocationSharp /> <span className="ml-2">{city}</span>
          </h3>
          <div className="mb-4 text-justify text-xs rendered-html" dangerouslySetInnerHTML={{ __html: description || '' }}></div> 
        </div>
        <CustomModal
          open={isMobilePopupOpen}
          title={
            <div className="sticky top-0 z-10 w-full bg-white">
              <div className="flex w-full items-center justify-between border-b pb-2 text-base">
                <div>
                  <button
                    onClick={() => handleTabClick('all')}
                    className={`mr-2 ${
                      activeTab === 'all' ? 'font-bold text-orange-500' : ''
                    }`}
                  >
                    All Images
                  </button>
                  {
                    <button
                      onClick={() => handleTabClick('destination')}
                      className={`mr-2 ${
                        activeTab === 'destination'
                          ? 'font-bold text-orange-500'
                          : ''
                      }`}
                    >
                      Destination
                    </button>
                  }
                  {
                    <button
                      onClick={() => handleTabClick('activities')}
                      className={`mr-2 ${
                        activeTab === 'activities'
                          ? 'font-bold text-orange-500'
                          : ''
                      }`}
                    >
                      Activities
                    </button>
                  }
                  {
                    <button
                      onClick={() => handleTabClick('hotel')}
                      className={`mr-2 ${
                        activeTab === 'hotel' ? 'font-bold text-orange-500' : ''
                      }`}
                    >
                      Hotel
                    </button>
                  }
                </div>
                <button
                  onClick={() => setMobilePopupOpen(false)}
                  className="text-xl font-bold text-black"
                >
                  &times;
                </button>
              </div>
            </div>
          }
          restContent={
            <div className=" max-h-[70vh]">
              <ItenImagePopUp
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                images={allImages}
                isMainGalary={false}
              />
            </div>
          }
        />
      </div>
      <CustomModal
        open={isPopUpOpen}
        handleClose={() => setPopUpOpen(false)}
        restContent={
          <div className="">
            <img src={popUpImage} className="h-[70vh] w-full rounded-lg" />
          </div>
        }
      />
    </>
  )
}

export default ItenerayImageSection
