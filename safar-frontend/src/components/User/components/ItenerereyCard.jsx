"use client";

import CustomButton from "../../../components/CustomButton";
import { light } from "@/_assets/themes/themes";
import React from "react";
import { useRouter } from "next/navigation";

const ItenerereyCard = ({
  name,
  routeName,
  image,
  title,
  duration,
  location,
  price,
  city,
  id,
  rating,
  description,
  is_customize,
}) => {
  const router = useRouter();

  // Function to handle card click (prevents navigation when Book Now is clicked)
  const handleCardClick = (e) => {
    if (e.target.closest(".book-now-button")) {
      return;
    }
    router.push(`/itinerary/${routeName}`);
  };

  // Function to handle Book Now button click
  const handleBookNowClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking Book Now
    router.push(`/itinerary/${routeName}`);
  };

  return (
    <>
      {/* Desktop Version */}
      <div
        onClick={handleCardClick}
        className="hidden h-[420px] max-w-[320px] shrink-0 flex-col items-center gap-y-4 overflow-hidden rounded-xl bg-white p-2 shadow-lg md:flex cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        {/* Image */}
        <div className="relative w-full">
          <img
            className="h-44 w-full rounded-xl object-cover"
            src={image}
            alt={title}
          />
          <div
            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)" }}
            className={`absolute -bottom-8 left-1/2 min-w-fit -translate-x-1/2 -translate-y-1/2 text-nowrap rounded-full px-4 py-2 text-center text-sm font-semibold 
           ${
             is_customize ? "bg-green-700 text-white" : "bg-white text-gray-600"
           }`}
          >
            {/* Dynamic price */}
            {is_customize ? "Customize" : "₹" + price + " onwards"}
          </div>
        </div>

        <div className="w-full px-1 flex flex-col h-full">
          {/* Title and Rating */}
          <div title={title} className="flex items-center justify-between">
            <div
              className="text-xl"
              style={{
                maxWidth: "18rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>{" "}
            {/* Dynamic title with ellipsis */}
            <div className="flex items-center text-yellow-500">
              {/* Dynamic rating */}
              <span className="ml-1 font-medium text-gray-700">{rating}</span>
            </div>
          </div>

          {/* Duration and Location */}
          <div className="my-1 flex text-nowrap overflow-hidden items-center justify-left gap-x-3 text-sm text-gray-500">
            <span>{duration + " days & " + (duration - 1) + " Nights"}</span>|
            <span title={location}>{location}</span>
            {/* Dynamic duration and location */}
          </div>

          {/*Description 3-line clamp with ellipsis, no fade*/}
          <div className="mt-1.5 text-xs text-gray-700 leading-5">
            <div
              className="rendered-html line-clamp-3 overflow-hidden break-words"
              dangerouslySetInnerHTML={{ __html: description || "" }}
            ></div>
          </div>

          {/* Book Now Button pinned bottom */}
          <div className="mt-auto pt-2 book-now-button">
            <CustomButton
              content={"Book Now"}
              btncolor={light.buttonBackground}
              small_btn={false}
              md_round={false}
              pill_rounded={true}
              padding="p-[11px]"
              onClick={handleBookNowClick}
            />
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div
        onClick={handleCardClick}
        className="flex w-[250px] mb-2 h-[360px] shrink-0 flex-col items-center gap-y-4 overflow-hidden rounded-xl bg-white p-2 shadow-lg md:hidden cursor-pointer"
      >
        {/* Image */}
        <div
          className="relative w-full"
          style={{ minHeight: "160px", height: "160px" }}
        >
          <img
            className="w-full rounded-xl object-cover object-center"
            src={image}
            alt={title}
            style={{
              height: "160px",
              minHeight: "160px",
              width: "100%",
              imageRendering: "auto",
              WebkitFontSmoothing: "antialiased",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <div
            style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)" }}
            className={`absolute -bottom-8 left-1/2 min-w-fit -translate-x-1/2 -translate-y-1/2 text-nowrap rounded-full px-4 py-2 text-center text-sm font-semibold 
            ${
              is_customize
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {/* Dynamic price */}
            {is_customize ? "Customize" : "₹" + price + " onwards"}
          </div>
        </div>

        <div className="w-full px-1 flex flex-col h-full">
          {/* Title and Rating */}
          <div className="flex items-center justify-between">
            <div
              className="truncate text-xl"
              style={{
                maxWidth: "13rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>{" "}
            {/* Dynamic title with ellipsis */}
            <div className="flex items-center text-yellow-500">
              {/* Dynamic rating */}
              <span className="ml-1 font-medium text-gray-700">{rating}</span>
            </div>
          </div>

          {/* Duration and Location */}
          <div className="my-1 flex overflow-hidden items-center gap-x-3 text-xs text-nowrap text-gray-500">
            <span>{duration + " days & " + (duration - 1) + " Nights"} </span>|
            <span title={location}>{location}</span>
            {/* Dynamic duration and location */}
          </div>

          <div className="mt-1.5 text-xs text-gray-700 leading-5">
            <div
              className="rendered-html line-clamp-3 overflow-hidden break-words whitespace-normal"
              dangerouslySetInnerHTML={{ __html: description || "" }}
            ></div>
          </div>

          <div className="h-3"></div>

          {/* Book Now Button pinned bottom */}
          <div className="mt-auto mt-4 mb-2 book-now-button">
            <CustomButton
              content={"Book Now"}
              btncolor={light.buttonBackground}
              small_btn={false}
              md_round={false}
              pill_rounded={true}
              padding="p-[11px]"
              onClick={handleBookNowClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ItenerereyCard;
