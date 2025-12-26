"use client";

import React, { useState } from "react";
import { post } from '@/constants/axiosClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

const CustomCallBackForm = ({ itineraryId, itineraryTitle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    travelers: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!formData.destination.trim())
      newErrors.destination = "Destination is required";
    if (!formData.travelDate.trim())
      newErrors.travelDate = "Travel date is required";
    if (!formData.travelers)
      newErrors.travelers = "No. of travelers is required";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
        const payload = {
        ...formData,
        travelers: parseInt(formData.travelers),
        //itinerary_id: itineraryId,
        itinerary_title: itineraryTitle || null,        
      };

      const response = await post(API_ENDPOINTS.COMMON.CUSTOM_CALLBACK, payload);

      if (response.success) {
        alert(response.message);
        setFormData({
          name: "",
          email: "",
          phone: "",
          destination: "",
          travelDate: "",
          travelers: "",
        });
      } else {
        alert(response.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mt-4 p-6 rounded-xl bg-[#1f2937] shadow-lg border-[10px] border-[#1f2937]"
    >
      {[
        { name: "name", label: "Name", type: "text", placeholder: "Your name" },
        { name: "email", label: "Email", type: "email", placeholder: "Email address" },
        { name: "phone", label: "Phone", type: "tel", placeholder: "Mobile Number" },
        { name: "destination", label: "Your City", type: "text", placeholder: "Your City" },
        { name: "travelDate", label: "Travel Date", type: "date" },
        { name: "travelers", label: "No. of Travelers", type: "number" },
      ].map(({ name, label, type, placeholder }) => (
        <div className="mb-4" key={name}>
          <label className="block text-sm font-semibold text-white mb-1">
            {label}
          </label>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full bg-white border-2 rounded-lg px-3 py-2 outline-none ${
              errors[name] ? "border-red-500" : "border-[#1f2937]"
            }`}
          />
          {errors[name] && (
            <p className="text-sm text-red-600 mt-1">{errors[name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] text-white font-bold py-3 px-4 rounded-full hover:opacity-90 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default CustomCallBackForm;
