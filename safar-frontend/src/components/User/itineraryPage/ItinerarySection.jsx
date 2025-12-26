import React, { useState } from "react";
import { FaRegListAlt } from "react-icons/fa";
import HotelCarousel from "./HotelCarousel";
import DayAccordion from "./itinerarySection/DayAccordion";
import { GoDotFill } from "react-icons/go";

const ItinerarySection = ({
  notes,
  dayDetails,
  hotels,
  inclusions_exclusions,
  cancellation_policy,
}) => {
  // State to manage active accordion for itinerary days
  const [activeDay, setActiveDay] = useState(dayDetails && dayDetails[0]);

  // Function to toggle accordion for itinerary days
  const toggleDay = (day) => {
    setActiveDay(activeDay === day ? null : day);
  };

  return (
    <>
      <div
        className="font-titleRegular p-3  text-white min-h-screen md:block hidden "
        style={{ width: "105%" }}
      >
        {/* Sticky Navigation */}
        <nav className="bg-gray-800     rounded-full p-4  top-20 z-50">
          <ul className="flex justify-evenly items-center space-x-6">
            <li>
              <a
                href="#itinerary"
                className="text-tertiaryText bg-gray-900 rounded-full py-2 px-4"
              >
                Itinerary
              </a>
            </li>
            <li>
              <a href="#hotels" className="hover:text-tertiaryText">
                Hotels
              </a>
            </li>
            <li>
              <a href="#inclusion" className="hover:text-tertiaryText">
                Inclusion & Exclusion
              </a>
            </li>
            <li>
              <a href="#cancellation" className="hover:text-tertiaryText">
                Cancellation Policy
              </a>
            </li>
          </ul>
        </nav>

        {/* Itinerary Section */}
        <section
          id="itinerary"
          className="mx-6 p-10 my-4 bg-gray-800 rounded-3xl"
        >
          <h2 className="text-2xl font-bold mb-4 ml-4">Itinerary</h2>

          {/* Dynamic Day Accordions */}
          {dayDetails?.map((day, index) => (
            <DayAccordion
              key={day.day || index} //ensure a unique key
              day={day.day}
              title={day.title}
              content={day.description}
              dayDetail={day}
              activities={day.activiteis
                .map((activity) => activity.description)
                .join(", ")}
              images={day.activiteis.flatMap((activity) => activity.images)}
              activeDay={activeDay}
              setActiveDay={toggleDay}
            />
          ))}
        </section>

        {/* Hotels Section */}
        <section
          id="hotels"
          className="mx-12 px-10 my-4 bg-gray-800  rounded-3xl"
        >
          {/* <h2 className="text-3xl mb-4">Hotels</h2> */}
          {hotels && hotels.length > 0 && hotels[0].name != "" && (
            <HotelCarousel hotels={hotels} />
          )}
        </section>

        {/* Inclusion & Exclusion Section - Desktop */}
        <section
          id="inclusion"
          className="mx-6 px-12 py-10 my-4 bg-gray-800 rounded-3xl"
        >
          <h2 className="text-2xl font-bold mb-4">Inclusion & Exclusion</h2>
          <div className="rounded-lg bg-gray-700/85  mx-auto py-10 px-14">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {inclusions_exclusions?.inclusions?.map((i, index) => (
                  <div
                    key={`inc-${index}`}
                    className="flex items-start space-x-2"
                  >
                    <div>✅</div>
                    <div
                      className="flex-1"
                      dangerouslySetInnerHTML={{
                        __html: (i || "")
                          .replace(/<p[^>]*>/g, "<span>")
                          .replace(/<\/p>/g, "</span>")
                          .replace(/<div[^>]*>/g, "<span>")
                          .replace(/<\/div>/g, "</span>")
                          .replace(/<br\s*\/?>/g, " "),
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {inclusions_exclusions?.exclusions?.map((i, index) => (
                  <div
                    key={`exc-${index}`}
                    className="flex items-start space-x-2"
                  >
                    <div>❌</div>
                    <div
                      className="flex-1"
                      dangerouslySetInnerHTML={{
                        __html: (i || "")
                          .replace(/<p[^>]*>/g, "<span>")
                          .replace(/<\/p>/g, "</span>")
                          .replace(/<div[^>]*>/g, "<span>")
                          .replace(/<\/div>/g, "</span>")
                          .replace(/<br\s*\/?>/g, " "),
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cancellation Policy Section */}
        <section
          id="cancellation"
          className="mx-6 px-12 py-10 my-4 bg-gray-800  rounded-3xl"
        >
          <div className="flex items-center mb-4">
            <FaRegListAlt color="white" className="text-white text-xl mr-2" />
            <h2 className="text-2xl font-semibold text-white">
              Cancellation Policy
            </h2>
          </div>
          <div className="rounded-lg bg-gray-700/85  mx-auto py-10 px-14">
            <ul className="space-y-4">
              {cancellation_policy?.policies.map((policy, index) => (
                <li
                  className="flex items-start space-x-2"
                  key={`policy-${index}`}
                >
                  <div className="mt-1 w-4 h-4 bg-white rounded-full flex-shrink-0"></div>
                  <p>{policy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Note Section */}
        <section
          id="note"
          className="mx-6 px-12 py-10 my-4 bg-gray-800 rounded-3xl"
        >
          <div className="flex items-center mb-4">
            <div className="bg-white text-xl min-h-4 min-w-4 mr-2"></div>
            <h2 className="text-2xl font-semibold text-white">Note</h2>
          </div>
          <div className="rounded-lg bg-gray-700/85 mx-auto py-10 px-14">
            <ul className="space-y-2">
              {/* Dynamically map notes */}
              {notes?.map((noteItem, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="mt-1 w-4 h-4 bg-white rounded-full flex-shrink-0"></div>
                  <div
                    dangerouslySetInnerHTML={{ __html: noteItem || "" }}
                  ></div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <div className="bg-gray-900 font-titleRegular md:my-4 py-6 pb-24 md:py-2 text-white min-h-screen md:hidden block">
        {/* Sticky Navigation */}
        <nav className="bg-gray-800 sticky top-5  rounded-full p-4 my-4 mx-4  z-50">
          <ul className="flex justify-around text-sm items-center space-x-4">
            <li className="w-[20%]">
              <a href="#itineraryMobile" className="hover:text-tertiaryText ">
                Itinerary
              </a>
            </li>
            <li className="w-[20%]">
              <a
                href="#hotelsMobile"
                className="hover:text-tertiaryText w-[20%]"
              >
                Hotels
              </a>
            </li>
            <li className="w-[20%]">
              <a
                href="#inclusionMobile"
                className="hover:text-tertiaryText w-[20%] "
              >
                Inc. & Exc.
              </a>
            </li>
            <li className="w-[20%]">
              <a
                href="#cancellationMobile"
                className="hover:text-tertiaryText w-[20%]"
              >
                Canc. Pol.
              </a>
            </li>
          </ul>
        </nav>

        {/* Itinerary Section */}
        <section
          id="itineraryMobile"
          className="mx-4  px-4 py-8   my-4 bg-gray-800 rounded-lg"
        >
          <h2 className="text-base font-bold mb-4">Itinerary</h2>

          {/* Dynamic Day Accordions */}
          {dayDetails?.map((day, index) => {
            return (
              <DayAccordion
                key={`${index}day`}
                day={day.day}
                title={day.title}
                content={day.description}
                dayDetail={day}
                activities={day.activiteis
                  .map((activity) => activity.description)
                  .join(", ")}
                images={day.activiteis.flatMap((activity) => activity.images)}
                activeDay={activeDay}
                setActiveDay={toggleDay}
              />
            );
          })}
        </section>

        {/* Hotels Section */}
        {hotels && hotels.length > 0 && hotels[0].name != "" && (
          <section
            id="hotelsMobile"
            className="mx-4  px-4 py-8   my-4 bg-gray-800 rounded-lg "
          >
            <HotelCarousel hotels={hotels} />
          </section>
        )}

        {/* Inclusion & Exclusion Section - Mobile */}
        <section
          id="inclusionMobile"
          className="mx-4 px-1 my-2 py-8 bg-gray-800 rounded-lg"
        >
          <h2 className="text-base font-titleRegular mb-4 pl-2">
            Inclusion & Exclusion
          </h2>
          <div className="rounded-lg bg-gray-700/85 mx-2 px-2 py-3">
            <div className="space-y-4 text-sm">
              <div className="space-y-1 font-titleRegular">
                {inclusions_exclusions?.inclusions?.map((i, index) => (
                  <div className="flex items-start gap-2" key={`${i}${index}`}>
                    <div>✅</div>
                    <div
                      className="flex-1"
                      dangerouslySetInnerHTML={{
                        __html: (i || "")
                          .replace(/<p[^>]*>/g, "<span>")
                          .replace(/<\/p>/g, "</span>")
                          .replace(/<div[^>]*>/g, "<span>")
                          .replace(/<\/div>/g, "</span>")
                          .replace(/<br\s*\/?>/g, " "),
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {inclusions_exclusions?.exclusions?.map((i, index) => (
                  <div className="flex items-start gap-2" key={`${i}${index}`}>
                    <div>❌</div>
                    <div
                      className="flex-1"
                      dangerouslySetInnerHTML={{
                        __html: (i || "")
                          .replace(/<p[^>]*>/g, "<span>")
                          .replace(/<\/p>/g, "</span>")
                          .replace(/<div[^>]*>/g, "<span>")
                          .replace(/<\/div>/g, "</span>")
                          .replace(/<br\s*\/?>/g, " "),
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cancellation Policy Section */}
        <section
          id="cancellationMobile"
          className=" mx-4 my-2 px-2 py-8 bg-gray-800 rounded-lg"
        >
          <div className="flex items-center mb-4 pl-2">
            <FaRegListAlt color="white" className="text-white text-xl mr-2" />
            <h2 className="text-base  text-white font-titleRegular ">
              Cancellation Policy
            </h2>
          </div>
          <div className="rounded-lg bg-gray-700/85  mx-2 px-5 ">
            <ol className="space-y-2 font-titleRegular list-disc py-5">
              {cancellation_policy?.policies.map((policy, index) => (
                <li className="" key={index}>
                  <p className="text-sm text-justify">{policy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Note Section */}
        <section
          id="noteMobile"
          className="mx-4 px-4 py-8 my-2 bg-gray-800 rounded-lg"
        >
          <div className="flex items-center mb-4">
            <h2 className="text-base font-titleRegular text-white">Note</h2>
          </div>
          <div
            className="rounded-lg bg-gray-700/85 text-sm  mx-auto  px-5"
            style={{ fontSize: "0.775rem" }}
          >
            <ol className="space-y-2 font-titleRegular list-disc py-5">
              {notes?.map((noteItem, index) => (
                <li key={index}>
                  <div
                    className="text-xs text-justify"
                    dangerouslySetInnerHTML={{ __html: noteItem || "" }}
                  ></div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
};

export default ItinerarySection;
