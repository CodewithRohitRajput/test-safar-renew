import { FaSkiing } from "react-icons/fa";
import CustomModal from "../../../../components/CustomModal";
import React, { useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdKeyboardArrowUp } from "react-icons/md";

const DayAccordion = ({ dayDetail, activeDay, setActiveDay }) => {
  // console.log(dayDetail, "dayDetail")

  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [popUpImage, setPopUpImage] = useState(null);
  const scrollContainerRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image index

  const toggleDay = (day) => {
    setActiveDay(activeDay === day ? null : day);
  };

  // const toggleDay = () => {
  //   setActiveDay(prevDay => prevDay === dayDetail.day ? null : dayDetail.day);
  // };

  // const [activeDays, setActiveDays] = useState({});

  // const toggleDay = (id) => {
  //   setActiveDays((prev) => ({
  //     ...prev,
  //     [id]: !prev[id], // Toggle only for the specific day
  //   }));
  // };

  const { day, title, description, activiteis, places } = dayDetail; // Destructure properties

  const handleNextImage = () => {
    // Move to the next image
    setCurrentImageIndex(
      (prevIndex) =>
        prevIndex < activiteis.flatMap((activity) => activity.images).length - 1
          ? prevIndex + 1
          : 0 // Loop back to the first image
    );
  };
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handlePreviousImage = () => {
    // Move to the previous image
    setCurrentImageIndex(
      (prevIndex) =>
        prevIndex > 0
          ? prevIndex - 1
          : activiteis.flatMap((activity) => activity.images).length - 1 // Loop back to the last image
    );
  };

  return (
    <>
      <div className="md:block hidden mb-4">
        <button
          onClick={() => toggleDay(day)}
          // onClick={() => toggleDay(dayDetail.id)}
          className="bg-white text-black px-6 py-3 rounded-full w-full text-left flex justify-between items-center"
        >
          <div>
            <span className="bg-tertiaryText py-1 mr-4 font-titleRegular text-white px-4 rounded-full">
              Day {day}:
            </span>
            {title}
          </div>
          <div>{activeDay === day ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
        </button>
       {activeDay === day && (
          <div className="px-28 py-8 font-titleRegular">
            {Array.isArray(description) ? (
              <ul className="list-disc list-outside pl-5 space-y-1 text-white rendered-html">
                {description.map((point, index) => (
                  <li key={index} className="text-justify">
                    <div
                      dangerouslySetInnerHTML={{ __html: point || "" }}
                    ></div>
                  </li>
                ))}
              </ul>
            ) : (description?.includes("<ul>") || description?.includes("<li>") || description?.includes("<ol>")) ? (
              // If description contains HTML list tags, render it directly without wrapping
              <div
                className="text-white text-justify rendered-html"
                dangerouslySetInnerHTML={{ __html: description || "" }}
              ></div>
            ) : description?.includes("\n") ? (
              <ul className="list-disc list-outside pl-5 space-y-1 text-white rendered-html">
                {description.split("\n").map((point, index) => (
                  <li key={index} className="text-justify">
                    <div
                      dangerouslySetInnerHTML={{ __html: point.trim() || "" }}
                    ></div>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="text-white text-justify rendered-html"
                dangerouslySetInnerHTML={{ __html: description || "" }}
              ></div>
            )}
           <hr className="my-5" />
            {activiteis && activiteis[0].description != "" && (
              <div className="p-4  mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl flex items-center font-titleMedium">
                    <span className="mr-4">
                      <FaSkiing color="white" />
                    </span>
                    Meals and Stays
                  </h2>
                </div>
                <div className=" md:flex-row">
                  <div className="p-4">
                    <ul className="list-[square]">
                      {activiteis &&
                        activiteis[0].description != "" &&
                        activiteis.map((activity) => {
                          // Split by comma and create separate bullet points
                          const mealsAndStays = activity.description
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item.length > 0);

                          return mealsAndStays.map((item, index) => (
                            <li key={index} className="mb-2 text-white">
                              {item}
                            </li>
                          ));
                        })}
                    </ul>

                    <div className=" mt-4">
                      {/* Display current image */}
                      {activiteis &&
                        activiteis[0].images[0] != "" &&
                        activiteis
                          .flatMap((activity) => activity.images)
                          .map((image, index) =>
                            index === currentImageIndex ? (
                              <img
                                key={index}
                                src={image}
                                alt={`Activity Image ${index + 1}`}
                                className="col-span-4 h-[300px] w-[450px]  rounded-lg"
                              />
                            ) : null
                          )}
                    </div>
                    <div>
                      <hr className="my-4" />
                      {places && places[0] != "" && (
                        <p>
                          <div className="flex items-center font-titleRegular justify-between">
                            <li>You'll be covering these amazing places</li>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleScroll("left")}
                                className="text-gray-500 p-1 bg-white rounded-full"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleScroll("right")}
                                className="text-gray-500 p-1 bg-white rounded-full"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div
                            ref={scrollContainerRef}
                            className="flex  gap-4  overflow-x-auto overflow-y-hidden no-scrollbar"
                          >
                            {places?.map((image, index) => (
                              <img
                                onClick={() => {
                                  setPopUpImage(image);
                                  setPopUpOpen(true);
                                }}
                                className=" w-fit h-[23vh] flex-shrink-0 rounded-lg mt-2"
                                src={image}
                                alt=""
                                key={index}
                              />
                            ))}
                          </div>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="md:hidden block mb-2">
        <button
          onClick={() => toggleDay(day)}
          // onClick={() => toggleDay(dayDetail.id)}
          className="bg-white flex items-center justify-between  text-black text-sm px-2 py-2 rounded-full w-full text-left"
        >
          <div className=" flex items-center">
            <span className="bg-tertiaryText font-titleRegular flex-shrink-0 py-1 mr-2 text-white px-4 rounded-full">
              Day {day}:
            </span>
            <div>{title}</div>
          </div>
          <div>{activeDay === day ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
        </button>
        {activeDay === day && (
          <div className="p-4 text-sm text-justify">
            {Array.isArray(description) ? (
              <ul className="list-disc list-outside pl-5 space-y-1 text-white rendered-html">
                {description.map((point, index) => (
                  <li key={index} className="text-justify">
                    <div
                      dangerouslySetInnerHTML={{ __html: point || "" }}
                    ></div>
                  </li>
                ))}
              </ul>
            ) : (description?.includes("<ul>") || description?.includes("<li>") || description?.includes("<ol>")) ? (
              // If description contains HTML list tags, render it directly without wrapping
              <div
                className="text-white text-justify rendered-html"
                dangerouslySetInnerHTML={{ __html: description || "" }}
              ></div>
            ) : description?.includes("\n") ? (
              <ul className="list-disc list-outside pl-5 space-y-1 text-white rendered-html">
                {description.split("\n").map((point, index) => (
                  <li key={index} className="text-justify">
                    <div
                      dangerouslySetInnerHTML={{ __html: point.trim() || "" }}
                    ></div>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="text-white text-justify rendered-html"
                dangerouslySetInnerHTML={{ __html: description || "" }}
              ></div>
            )}

            {activiteis && activiteis[0].description != "" && (
              <div className="py-3 px-0  mx-auto">
                <h2 className="text-base font-titleRegular">Meals and Stays</h2>
                <div className=" md:flex-row">
                  <div className="p-2">
                    <ul>
                      {activiteis.map((activity) => {
                        // Split by comma and create separate bullet points
                        const mealsAndStays = activity.description
                          .split(",")
                          .map((item) => item.trim())
                          .filter((item) => item.length > 0);

                        return mealsAndStays.map((item, index) => (
                          <li key={index} className="mb-2 text-white">
                            {item}
                          </li>
                        ));
                      })}
                    </ul>
                    <div className=" mt-4">
                      {/* Display current image */}
                      {activiteis &&
                        activiteis[0].images[0] != "" &&
                        activiteis
                          .flatMap((activity) => activity.images)
                          .map((image, index) =>
                            index === currentImageIndex ? (
                              <img
                                key={index}
                                src={image}
                                alt={`Activity Image ${index + 1}`}
                                className="col-span-4 h-[20vh] w-full object-cover rounded-lg"
                              />
                            ) : null
                          )}
                    </div>
                    <div>
                      <hr className="my-4 font-titleRegular" />
                      {places && places[0] != "" && (
                        <p>
                          <li>You'll be covering these amazing places</li>
                          <div className="flex gap-4  overflow-x-auto overflow-y-hidden">
                            {places.map((image, index) => (
                              <img
                                className="w-[18vw] rounded-lg mt-2"
                                src={image}
                                alt=""
                                key={index}
                              />
                            ))}
                          </div>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <CustomModal
        open={isPopUpOpen}
        handleClose={() => setPopUpOpen(false)}
        restContent={
          <div className="">
            <img src={popUpImage} className="w-full h-[70vh] rounded-lg" />
          </div>
        }
      />
    </>
  );
};

export default DayAccordion;