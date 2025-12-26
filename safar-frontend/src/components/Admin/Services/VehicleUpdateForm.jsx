import CustomForm from "@/components/Dynamic/CustomForm/CustomForm";
import CustomModal from "@/components/Dynamic/CustomModel/CustomModal";
import React, { useState } from "react";

const VehicleUpdateForm = ({data,handleSubmit,isModalOpen, setIsModalOpen}) => {
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
const fields = [
  {
    name: "c",
    label: "Vehicle Number",
    value: data?.vNumber,
    type: "text",
    grid: 6,
    required: true,
    // validation: (val) =>
    //   /^[A-Z]{2}[0-9]{2}[A-Z]{0,2}[0-9]{4}$/i.test(val.trim()) ||
    //   "Enter a valid Indian vehicle number (e.g., MP09CD1234)",
  },
  {
    name: "capacity",
    label: "Capacity",
    value: data?.capacity,
    type: "number",
    grid: 6,
    required: true,
    validation: (val) =>
      Number(val) > 0 || "Capacity must be a positive number",
  },
 
    {
    name: "vType",
    label: "Vehicle Type",
    type: "select",
    value: data?.vType,
    grid: 6,
    required: true,
    options: [
      { label: "Tempo Traveller", value: "Tempo Traveller" },
      { label: "Mini Bus", value: "Mini Bus" },
      { label: "Bus", value: "Bus" },
      { label: "SUV", value: "SUV" },
      { label: "Sedan", value: "Sedan" },
    ],
  },
  {
    name: "priceType",
    label: "Price Type",
    type: "select",
    value: data?.priceType,
    grid: 6,
    required: true,
    options: [
      { label: "Per Day", value: "Per Day" },
      { label: "Per Km", value: "Per Km" },
      { label: "Per Tour", value: "Per Tour" },
    ],
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    value: data?.price,
    grid: 6,
    required: true,
    validation: (val) =>
      Number(val) >= 100 || "Price must be at least ₹100",
  },
  {
    name: "contact",
    label: "Contact",
    type: "number",
    value: data?.contact,
    grid: 6,
    required: true
  },
  {
    name: "routes",
    label: "Routes",
    type: "text",
    value: data?.routes,
    grid: 12,
    required: true,
  },
  {
    name: "vendorName",
    label: "Vendor Name",
    type: "text",
    value: data?.vendorName,
    grid: 6,
    required: true,
  },
  {
    name: "vendorLocation",
    label: "Vendor Location",
    type: "text",
    value: data?.vendorLocation,
    grid: 6,
    required: true,
  },
  {
    name: "rating",
    label: "Rating",
    type: "select",
    value: data?.rating,
    grid: 6,
    required: true,
    options: [
     {label:"1",value:1},{label:"2",value:2},{label:"3",value:3},
     {label:"4",value:4},{label:"5",value:5},{label:"6",value:6},
     {label:"7",value:7},{label:"8",value:8},{label:"9",value:9},
     {label:"10",value:10},
    ],
  },
];


  const handleUpdateSubmit = (formData) => {
    console.log(data)
   formData._id=data.id
   handleSubmit(formData)
  handleClose();
  };

  return (
    <CustomModal
      buttonStyle={{ backgroundColor: "#FF7300", color: "white" }}
      modalLabel="Update Vehicle"
      btnVisible={false}
       open={isModalOpen}
        onOpen={handleOpen}
        onClose={handleClose}
    >
      <div style={{ maxWidth: 600, margin: "auto", marginTop: 40 }}>
        <CustomForm
          onSubmit={handleUpdateSubmit}
          fields={fields}
        />
      </div>
    </CustomModal>
  );
};

export default VehicleUpdateForm;
