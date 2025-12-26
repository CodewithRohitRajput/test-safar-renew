// import React from "react";
// import { IoMdDownload } from "react-icons/io";

// const TripPdfDownloadBanner = ({ pdfLink }) => {
//   return (
//     // <div style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"}} className="p-2 md:hover:scale-110  rounded-full   text-center md:text-center bg-slate-100  flex flex-col justify-center items-center">
//     //     <a
//     //       href={pdfLink}
//     //       target="_blank"
//     //       className="text-1xl md:text-xl font-titleRegular flex items-center justify-center hover:underline md:hover:no-underline md:hover:border-none border-b-2 border-transparent hover:border-white text-black md:text-tertiaryText"
//     //     >
//     //       Download Trip PDF{" "}
//     //       <IoMdDownload color="#ff630a" className="ml-2 md:block hidden" />
//     //       <IoMdDownload color="white" className="ml-2 md:hidden block" />
//     //     </a>
//     //     <div className="text-xs md:text-base text-black md:text-tertiaryText ">
//     //       Click here to download our itinerary.
//     //     </div>
//     //   </div>
//     <div className="w-full bg-slate-50 rounded-md p-4 mt-4 text-center">
     
//       <a
//         href={pdfLink}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-[#ff630a] font-medium flex items-center justify-center"
//       >
//         Download Trip PDF
        
//         <IoMdDownload className="ml-2 text-[#ff630a]" size={20} />
//       </a>
      
      
//       <div className="text-sm text-gray-500 mt-1">
//         Click here to download our itinerary.
//       </div>
//     </div>

//   );
// };

// export default TripPdfDownloadBanner;

"use client";

import React, { useState, useEffect } from "react";
import { IoMdDownload } from "react-icons/io";
import CustomModal from "@/components/CustomModal";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

const TripPdfDownloadBanner = ({ pdfLink, itinerary }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://safarwanderlust.com/api";

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get callback request status from checkbox
      const callbackRequest = document.getElementById("callback").checked;

      // Submit enquiry data
      const enquiryData = {
        name: formData.name,
        email: "not-provided@example.com",
        phone: formData.phone,
        destination: itinerary?.city || itinerary?.destination || "Not specified",
        travelDate: new Date().toISOString(),
        travelers: 1,
        itinerary_title: itinerary?.title || "Not specified",
        itinerary_image: itinerary?.thumbnail || itinerary?.allImages?.[0] || "",
        itinerary_id: itinerary?.id || "",
        enquiry_type: "itinerary", // Changed from "instalink" to "itinerary"
        callback_request: callbackRequest,
        remark: "null",
      };

      const response = await fetch(
        `${baseUrl}${API_ENDPOINTS.COMMON.CUSTOM_CALLBACK}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enquiryData),
        }
      );

      if (response.ok) {
        setShowModal(false);
        // Download PDF after successful submission
        if (pdfLink) {
          window.open(pdfLink, "_blank");
        }
        setFormData({ name: "", phone: "" });
        setErrors({});
      } else {
        throw new Error("Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Failed to submit your details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setShowModal(false);
      setFormData({ name: "", phone: "" });
      setErrors({});
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Create the form content
  const formContent = (
    <div className={`w-full ${isMobile ? "px-2" : "mx-auto px-4 sm:px-6"}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          top_title="Full Name"
          isRequired={true}
          content="Enter your full name"
          value={formData.name}
          onchange={(e) => handleInputChange(e)}
          name="name"
          error_text={errors.name}
          className="w-full"
        />

        <CustomInput
          top_title="Phone Number"
          isRequired={true}
          content="Enter your phone number"
          value={formData.phone}
          onchange={(e) => handleInputChange(e)}
          name="phone"
          error_text={errors.phone}
          className="w-full"
        />

        <div className="flex items-center space-x-2">
          <input id="callback" type="checkbox" className="w-4 h-4" />
          <label htmlFor="callback" className="text-sm text-gray-700">
            Expecting Callback?
          </label>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <CustomButton
            content={isSubmitting ? "Submitting..." : "Download PDF"}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            btncolor="#F97316"
            logo_path={
              !isSubmitting && <IoMdDownload className="mr-2" size={18} />
            }
          />
        </div>
      </form>
    </div>
  );

  return (
    <>
      <div className="w-full bg-gray-800 p-4 text-center" style={{ borderRadius: 10 }}>
        <button
          onClick={handleOpenModal}
          className="text-[#ff630a] font-medium flex items-center justify-center text-white w-full"
        >
          Download Trip PDF
          <IoMdDownload className="ml-2 text-[#ff630a]" size={20} />
        </button>

        <div className="text-sm text-white mt-1">
          Click here to download our itinerary.
        </div>
      </div>

      {/* PDF Download Modal */}
      <CustomModal
        open={showModal}
        handleClose={handleClose}
        title="Download PDF"
        backdropvalue="0.5"
        padding={isMobile ? 4 : 4}
        isMobile={isMobile}
        restContent={formContent}
      />
    </>
  );
};

export default TripPdfDownloadBanner;
