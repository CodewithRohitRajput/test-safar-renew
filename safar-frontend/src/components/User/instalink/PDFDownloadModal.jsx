"use client";

import React, { useState, useEffect } from "react";
import CustomModal from "@/components/CustomModal";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { IoMdDownload } from "react-icons/io";

const PDFDownloadModal = ({ isOpen, onClose, itinerary, onDownload }) => {
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
        destination: itinerary.city || "Not specified",
        travelDate: new Date().toISOString(),
        travelers: 1,
        itinerary_title: itinerary.title,
        itinerary_image: itinerary.thumbnail,
        itinerary_id: itinerary.id,
        enquiry_type: "instalink", 
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
        onClose();
        onDownload();
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
      onClose();
      setFormData({ name: "", phone: "" });
      setErrors({});
    }
  };
  // ... existing code ...

  // Create the form content with full mobile width
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

        {/* Button Section - full width */}
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
    <CustomModal
      open={isOpen}
      handleClose={handleClose}
      title="Download PDF"
      backdropvalue="0.5"
      padding={isMobile ? 4 : 4}
      isMobile={isMobile}
      restContent={formContent}
    />
  );
};

export default PDFDownloadModal;
