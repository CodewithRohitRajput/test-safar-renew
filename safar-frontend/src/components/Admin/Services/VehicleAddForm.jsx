import CustomForm from "@/components/Dynamic/CustomForm/CustomForm";
import CustomModal from "@/components/Dynamic/CustomModel/CustomModal";
import { createVehicle } from "@/lib/thunks/vehiclesThunks";
import React, { useState } from "react";
import { useDispatch } from "react-redux";


const VehicleAddForm = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const fields = [
    {
      name: "vNumber",
      label: "Vehicle Number",
      value: "",
      type: "text",
      grid: 6,
      required: true,
    },
    {
      name: "capacity",
      label: "Capacity",
      value: "",
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
      value: "",
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
      value: "",
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
      value: "",
      grid: 6,
      required: true,
      validation: (val) =>
        Number(val) >= 100 || "Price must be at least ₹100",
    },
    {
      name: "contact",
      label: "Contact",
      type: "number",
      value: "",
      grid: 6,
      required: true,
    },
    {
      name: "routes",
      label: "Routes",
      type: "text",
      value: "",
      grid: 12,
      required: true,
    },
    {
      name: "vendorName",
      label: "Vendor Name",
      type: "text",
      value: "",
      grid: 6,
      required: true,
    },
    {
      name: "vendorLocation",
      label: "Vendor Location",
      type: "text",
      value: "",
      grid: 6,
      required: true,
    },
    {
      name: "rating",
      label: "Rating",
      type: "select",
      value: "",
      grid: 6,
      required: true,
      options: Array.from({ length: 10 }, (_, i) => ({
        label: (i + 1).toString(),
        value: i + 1,
      })),
    },
  ];

  const handleSubmit = async (data) => {
    await dispatch(createVehicle(data)); // dispatch thunk
    handleClose(); // close modal
  };

  return (
    <CustomModal
      buttonText="Add Vehicle"
      btnVisible={true}
      buttonStyle={{ backgroundColor: "#FF7300", color: "white" }}
      modalLabel="New Vehicle"
      open={isModalOpen}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      <div style={{ maxWidth: 600, margin: "auto", marginTop: 40 }}>
        <CustomForm onSubmit={handleSubmit} fields={fields} />
      </div>
    </CustomModal>
  );
};

export default VehicleAddForm;
