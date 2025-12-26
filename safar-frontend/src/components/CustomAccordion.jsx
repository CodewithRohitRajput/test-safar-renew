"use client";

import React, { useState } from "react";
import CustomButton from "./CustomButton";
import EditIcon from "@/_assets/svgs/logo/EditIcon";
import ThreedotIcon from "@/_assets/svgs/logo/ThreedotIcon";
import CustomText from "./CustomText";
import { MdDragIndicator } from "react-icons/md";

function CustomAccordion({
  title,
  content,
  isOpen: initialOpenState = false,
  item,
  index,
  state,
  setState,
  handleEditModalOpen,
  delete_Cat,
  viewText = "View Category",
  onViewClick,
  itinerariesKey = "itinerary",
}) {
  const [isOpen, setIsOpen] = useState(initialOpenState);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="accordion">
      <div className="accordion-header">
        <div className="grid grid-cols-5 items-center w-full">
          <div
            onClick={handleToggle}
            className="px-4 py-2 text-start cursor-pointer select-none"
          >
            <div className="flex items-center">
              <div>
                <MdDragIndicator size={20} className="mr-1 ml-[-1.5rem]" />
              </div>
              <span
                className={`accordion-icon mr-4 flex items-center justify-center w-6 h-6 rounded-full bg-black text-white transform transition-transform duration-300 ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>

              <CustomText
                content={item?.name || "NA"}
                fontsize="13px"
                secondaryfontweight
                className="select-none"
              />
            </div>
          </div>
          <div
            onClick={handleToggle}
            className="px-4 py-2 text-center cursor-pointer select-none"
          >
            <CustomText
              content={(item?.[itinerariesKey]?.length || 0) + " Itineraries"}
              fontsize="13px"
              secondaryfontweight
            />
          </div>
          <div
            onClick={handleToggle}
            className="px-4 py-2 text-center cursor-pointer select-none"
          >
            <div className={` rounded-2xl mx-24 p-1 px-5`}>
              <CustomText
                content={"-"}
                fontsize="13px"
                secondaryfontweight
                className="text-white"
              />
            </div>
          </div>
          <div className="px-4  w-2  ">
            <CustomButton
              className="ml-16"
              logo_path={<EditIcon />}
              content={""}
              small_btn
              onClick={() => handleEditModalOpen({ item })}
            />
          </div>
          <div className="group relative px-4 w-2 ">
            <CustomButton logo_path={<ThreedotIcon />} content={""} small_btn />
            <div className="group-hover:block hidden absolute top-5 right-5 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
              <div
                onClick={() => {
                  if (onViewClick) return onViewClick(item);
                  setState((prevs) => ({
                    ...prevs,
                    selected_category: item,
                    to_which_modal_content: "view_cat",
                    is_modalopen: true,
                  }));
                }}
                className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
              >
                {viewText}
              </div>

              {/* <div className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                Inactive
              </div> */}
              <div
                onClick={() => delete_Cat({ id: item?.id })}
                className="text-deletetextcolor cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
              >
                Delete
              </div>
            </div>
          </div>
          {/* <td className="px-4 py-2"></td>
          <td className="px-4 py-2"></td> */}
        </div>
      </div>
      {isOpen && <div className="accordion-content ">{content}</div>}
    </div>
  );
}

export default CustomAccordion;
