"use client";

import DynamicTable from "@/components/Dynamic/CustomTable/DynamicTable";
import VehicleAddForm from "./VehicleAddForm";
import VehicleUpdateForm from "./VehicleUpdateForm";
import { useEffect, useState } from "react";
import FilterBar from "@/components/Dynamic/FilterBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles, updateVehicle } from "@/lib/thunks/vehiclesThunks";

const Vehicle = () => {
 const dispatch = useDispatch();
  const { vehiclesList, loading, error } = useSelector((state) => state.vehicles);
    const [dataToUpdate, setDataToUpdate] = useState();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
 useEffect(()=>{
    dispatch(fetchVehicles({ page: 1, limit: 10 }));
 },[])

  const handleUpdateSubmit =  (formData) => {
    console.log(formData)
    if (!formData?._id) 
      return;
     dispatch(updateVehicle(formData._id, formData));

  };
  const handleFilter = (filterObj) => {
    console.log("Filtered With:", filterObj);
  };

  const handleReset = () => {
    console.log("Filter Reset");
  };

  const fields = [
          { label: "Vehicle Type", key: "vType" },
          { label: "Vehicle Number", key: "vNumber" },
          { label: "Capacity", key: "capacity" },
          { label: "Pice Type", key: "priceType" },
          { label: "Price", key: "price" },
          { label: "Routes", key: "routes" },
          { label: "Contact", key: "contact" },
          { label: "Vendor Name", key: "vendorName" },
          { label: "Vendor Location", key: "vendorLocation" },
          { label: "Rating", key: "rating" },
  ];

  return (
    <>
      <VehicleAddForm />
      <FilterBar
        fields={fields}
        onFilter={handleFilter}
        onReset={handleReset}
      />
      ;
      <VehicleUpdateForm
        data={dataToUpdate}
        isModalOpen={isUpdateModalOpen}
        setIsModalOpen={setIsUpdateModalOpen}
        handleSubmit={handleUpdateSubmit}
      />
      <DynamicTable
        headers={[
          { label: "Id", field: "id", width: 350 },
          { label: "Vehicle Type", field: "vType", width: 200 },
          { label: "Vehicle Number", field: "vNumber", width: 200 },
          { label: "Capacity", field: "capacity", width: 100 },
          { label: "Pice Type", field: "priceType", width: 150 },
          { label: "Price", field: "price", width: 100 },
          { label: "Routes", field: "routes", width: 400 },
          { label: "Contact", field: "contact", width: 180 },
          { label: "Vendor Name", field: "vendorName", width: 200 },
          { label: "Vendor Location", field: "vendorLocation", width: 200 },
          { label: "Rating", field: "rating", width: 200 },
        ]}
        data={vehiclesList}
        totalPages={5}
        currentPage={1}
        onPageChange={(page) => console.log("Change to page", page)}
        onEdit={(row) => {
          setDataToUpdate(row);
          setIsUpdateModalOpen(true);
        }}
        onView={(row) => console.log("View clicked", row)}
      />
    </>
  );
};
export default Vehicle;
