// "use client";

// import { MenuItem, Select } from "@mui/material";
// import CustomText from "../../../components/CustomText";
// import moment from "moment";
// import { useEffect, useRef, useState } from "react";
// import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
// import CustomModal from "../../../components/CustomModal";
// import CustomCallBackReq from "../components/CustomCallBackReq";

// const PricingComponent = ({
//   openPopup,
//   base_packages,
//   batches,
//   pickup_point,
//   drop_point,
//   selectedBatch,
//   setSelectedBatch,
//   selectedPackage,
//   setSelectedPackage,
//   selectedStartingPoint,
//   setSelectedStartingPoint,
//   selectedDroppingPoint,
//   setSelectedDroppingPoint,
//   showCallBackForm,
//   setShowCallBackForm,
// }) => {
//   const [errors, setErrors] = useState({
//     package: "",
//     batch: "",
//     startingPoint: "",
//     droppingPoint: "",
//   });
//   const [mapToHoldBatches, setMapToHoldBatches] = useState(null);
//   const [currMapKeySelected, setCurrMapKeySelected] = useState("ALL");
//   const validate = () => {
//     let valid = true;
//     const newErrors = {
//       package: "",
//       batch: "",
//       startingPoint: "",
//       droppingPoint: "",
//     };

//     if (!selectedPackage) {
//       newErrors.package = "Please select a package.";
//       valid = false;
//     }
//     if (!selectedBatch) {
//       newErrors.batch = "Please select a batch.";
//       valid = false;
//     }
//     if (!selectedStartingPoint) {
//       newErrors.startingPoint = "Please choose a starting point.";
//       valid = false;
//     }
//     if (!selectedDroppingPoint) {
//       newErrors.droppingPoint = "Please choose a dropping point.";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = () => {
//     if (validate()) {
//       openPopup();
//     }
//   };
//   const scrollRef = useRef(null);

//   const scroll = (scrollOffset) => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({
//         left: scrollOffset,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     if (batches) {
//       const arr = [
//         "JAN",
//         "FEB",
//         "MAR",
//         "APR",
//         "MAY",
//         "JUNE",
//         "JULY",
//         "AUG",
//         "SEP",
//         "OCT",
//         "NOV",
//         "DEC",
//         "ALL",
//       ];

//       const map = new Map();

//       arr.forEach((month) => {
//         map.set(month, -1);
//       });

//       batches?.forEach((trips) => {
//         const currTripMonth = moment(trips.start_date).format("MMM");
//         const currTripArray = map?.get(currTripMonth) || [];
//         currTripArray.push(trips);
//         map.set(currTripMonth.toUpperCase(), [...currTripArray]);
//         if (map.get("ALL") == -1) {
//           map.set("ALL", [...currTripArray]);
//         } else {
//           const allCurrData = map.get("ALL");

//           map.set("ALL", [...allCurrData, ...currTripArray]);
//         }

//         console.log("currTripMonth", map);
//       });

//       setMapToHoldBatches(map);
//     }
//   }, [batches]);

//   return (
//     <div className="h-screen">
//       <div className=" p-5 min-w-full max-w-full  md:block sm:hidden   font-titleRegular mx-auto my-3 bg-white py-2 rounded-lg ">
//         {/* Pricing Section - Starting from */}
//         <div
//           style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
//           className="flex  flex-col justify-center items-center bg-white p-4 rounded-xl shadow-md "
//         >
//           <div>
//             {/* Title and Discount Badge */}
//             <div className="flex items-center space-x-2">
//               <h4 className="text-lg font-semibold text-gray-900">
//                 Starting From
//               </h4>
//               <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 pt-1 rounded-full">
//                 Upto ₹2,500 OFF
//               </span>
//             </div>

//             {/* Price Section */}
//             <div className="flex items-center mt-2">
//               <span className="line-through text-gray-400 text-lg mr-2">
//                 ₹
//                 {(
//                   (selectedPackage?.original_price ||
//                     base_packages?.[0]?.original_price) +
//                   (selectedStartingPoint?.price || 0) +
//                   (selectedDroppingPoint?.price || 0)
//                 ).toLocaleString()}
//               </span>
//               <span className="text-3xl font-bold text-orange-500">
//                 ₹
//                 {(
//                   (selectedPackage?.discounted_price ||
//                     base_packages?.[0]?.discounted_price) +
//                   (selectedStartingPoint?.price || 0) +
//                   (selectedDroppingPoint?.price || 0)
//                 ).toLocaleString()}
//               </span>
//               <span className="text-sm bg-white text-gray-700 px-4 py-4 "></span>
//               <span className="text-xs bg-blue-100 text-gray-700 px-2 py-1 rounded-full">
//                 Per Person
//               </span>
//             </div>

//             {/* Per Person Label */}
//             {/* <div className="mt-1">

//             </div> */}
//           </div>

//           {/* Book Now Button */}
//           <button
//             onClick={handleSubmit}
//             className="bg-orange-500 mt-4 w-full text-white py-2 rounded-full text-lg font-bold hover:bg-orange-600 transition duration-300"
//           >
//             Book Now
//           </button>
//         </div>

//         {/* Pricing */}
//         <div className="">
//           <h5 className="text-lg font-semibold mt-2 text-gray-700">
//             Pricing
//             <span className="ml-0.5 font-normal text-red-600">*</span>
//           </h5>
//           <div className="relative mt-1 border p-4 rounded-lg max-h-full overflow-auto border-gray-300">
//             {base_packages?.map((packages, index) => (
//               <div
//                 key={index}
//                 className={`flex justify-between items-center my-2 px-2 cursor-pointer ${
//                   !selectedPackage && index == 0
//                     ? "border-[1px] border-black/30 rounded-lg"
//                     : ""
//                 } ${
//                   selectedPackage?.name === packages.name
//                     ? " border-2 border-black "
//                     : ""
//                 } `}
//                 onClick={() => setSelectedPackage(packages)}
//               >
//                 <span className="text-gray-600">{packages?.name}</span>
//                 <div className="text-nowrap flex justify-start items-center text-start">
//                   <div className="line-through inline-block mx-4">
//                     ₹ {packages?.original_price}/-
//                   </div>
//                   <div className="text-orange-500 inline-block">
//                     ₹ {packages?.discounted_price}/-
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {!selectedPackage && errors.package && (
//             <CustomText
//               className="px-4 py-2 text-red-600"
//               content={errors.package}
//               fontsize="12px"
//             />
//           )}
//         </div>

//         {/* Batches */}
//         <div className="mb-6 ">
//           <div className="flex border-green-400 items-center-center gap-2 py-4 justify-between">
//             <h5 className="text-lg font-semibold text-gray-700">
//               Batches
//               <span className="ml-0.5 font-normal text-red-600">*</span>
//             </h5>

//             <div className=" w-40 scrollbar-orange flex gap-2 uppercase px-2  overflow-x-scroll bg-white/25   text-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] cursor-pointer m-1 p-1 text-sm font-bold backdrop-blur-md rounded-[10px]">
//               {mapToHoldBatches && (
//                 <div
//                   className={` hover:bg-orange-400    m-1 p-1 text-sm font-bold rounded-md ${
//                     currMapKeySelected == "ALL" ? "bg-[#EA580C] text-white" : ""
//                   }`}
//                   onClick={() => setCurrMapKeySelected("ALL")}
//                   key={"ALL"}
//                 >
//                   ALL
//                 </div>
//               )}
//               {mapToHoldBatches &&
//                 Array.from(mapToHoldBatches.entries()).map(([key, val]) => {
//                   if (val === -1 || key == "ALL") return null;
//                   return (
//                     <div
//                       className={` hover:bg-orange-400   m-1 p-1 text-sm font-bold rounded-md ${
//                         currMapKeySelected == key
//                           ? "bg-[#EA580C] text-white"
//                           : ""
//                       }`}
//                       onClick={() => setCurrMapKeySelected(key)}
//                       key={key}
//                     >
//                       {key}
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>

//           {/* <div className="relative">
//             <button
//               onClick={() => scroll(-100)}
//               className="absolute -left-0 top-1/2 -translate-y-1/2 z-10 aspect-square p-1.5 border-[1px] border-black/10 bg-gray-50 hover:bg-gray-200 rounded-full transform"
//             >
//               <FaAngleLeft />
//             </button>
//             <div
//               ref={scrollRef}
//               className="flex space-x-2 mt-2 border p-4 mx-8 rounded-full overflow-auto no-scrollbar relative"
//             >
//               {batches?.map((batch, index) => (
//                 <button
//                   key={index}
//                   className={`py-2 flex-shrink-0 text-sm px-4 rounded-full border relative ${
//                     batch.is_sold
//                       ? "bg-white text-gray-500 cursor-not-allowed"
//                       : selectedBatch === batch
//                         ? "bg-gray-200"
//                         : "bg-gray-50 hover:bg-gray-300"
//                   }`}
//                   onClick={() => {
//                     if (batch.is_sold) return
//                     setSelectedBatch(batch)
//                   }}
//                 >
//                   <div className="flex flex-col justify-center items-center">
//                     <div>
//                       {moment(batch.start_date).format("DD-MMM ")} To {moment(batch.end_date).format("DD-MMM ")}
//                     </div>
//                     {batch.is_sold && <div className="text-[7px] bg-red-600 text-white px-1 rounded-lg">Sold Out</div>}
//                   </div>
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() => scroll(100)}
//               className="absolute -right-0 top-1/2 -translate-y-1/2 p-1.5 border-[1px] border-black/10 z-10 aspect-square bg-gray-50 hover:bg-gray-200 rounded-full transform"
//             >
//               <FaAngleRight />
//             </button>
//           </div> */}

//           <div className="relative  bg-orange-400 w-full h-24 overflow-x-auto scrollbar-orange">
//             {mapToHoldBatches &&
//               currMapKeySelected &&
//               mapToHoldBatches?.get(currMapKeySelected)?.map((batch, index) => {
//                 return (
//                   <div
//                     onClick={() => {
//                       if (batch?.is_sold) {
//                         return;
//                       } else
//                       {
//                          setSelectedBatch(batch);}
//                     }}
//                     key={index}
//                     className={`bg-slate-50 p-2 m-2  border-4 hover:border-red-400   rounded-md ${
//                       batch?.is_sold
//                         ? "cursor-not-allowed"
//                         : ""
//                     }`}
//                   >
//                     <p className={`${selectedBatch === batch ? "bg-gray-200"
//                         : "bg-gray-50"} hover:bg-gray-300 text-slate-800 cursor-pointer hover:scale-y-105   font-semibold`}>
//                       {moment(batch.start_date).format("DD-MMM ")} To{" "}
//                       {moment(batch.end_date).format("DD-MMM ")}
//                     </p>
//                   </div>
//                 );
//               })}
//           </div>
//           {!selectedBatch && errors.batch && (
//             <CustomText className="px-4 py-2 text-red-600" content={errors.batch} fontsize="12px" />
//           )}
//         </div>

//         {/* Starting and Dropping Points */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <Dropdown
//               label="Starting Point"
//               options={pickup_point}
//               selectedValue={selectedStartingPoint?.name}
//               onChange={(value) =>
//                 setSelectedStartingPoint(
//                   pickup_point.find((point) => point.name === value)
//                 )
//               }
//               placeholder="Choose Starting Point"
//               error={errors.startingPoint}
//             />
//           </div>
//           <div>
//             <Dropdown
//               label="Dropping Point"
//               options={drop_point}
//               selectedValue={selectedDroppingPoint?.name}
//               onChange={(value) =>
//                 setSelectedDroppingPoint(
//                   drop_point.find((point) => point.name === value)
//                 )
//               }
//               placeholder="Choose Dropping Point"
//               error={errors.droppingPoint}
//             />
//           </div>
//         </div>
//       </div>

//       {/* <CustomModal
//         padding={4}
//         open={showCallBackForm}
//         handleClose={() => setShowCallBackForm(false)}
//         restContent={<CustomCallBackReq setShowCallBackForm={setShowCallBackForm} />}
//       /> */}
//     </div>
//   );
// };
// const Dropdown = ({
//   label,
//   options,
//   selectedValue,
//   onChange,
//   placeholder = "Select an option",
//   error = "",
// }) => {
//   return (
//     <div className="w-full  ">
//       <div className=" w-fit relative mb-3 text-sm font-nunito-semiBold600">
//         {label}
//         <span className="ml-0.5 absolute left-full font-normal text-red-600">
//           *
//         </span>
//       </div>
//       <Select
//         sx={{
//           "& .MuiInputBase-root": { borderRadius: "0.75rem", padding: "8px" }, // Increased border radius
//           "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3B3B" },
//           "&:hover .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#3B3B3B",
//           },
//           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//             borderColor: "#3B3B3B",
//           },
//           "& .MuiSelect-select": { padding: "8px 16px" },
//           "& .MuiSvgIcon-root": {
//             right: "5px",
//             top: "50%",
//             transform: "translateY(-50%)",
//           },
//         }}
//         className="w-full"
//         value={selectedValue || "null"}
//         onChange={(e) => onChange(e.target.value)}
//       >
//         <MenuItem value="null" disabled>
//           {placeholder}
//         </MenuItem>
//         {options?.map((option, index) => (
//           <MenuItem key={index} value={option.name}>
//             <div className="flex items-center justify-between">
//               <div>{option.name}</div>
//               <span className="mx-1">|</span>
//               <div> ₹{option.price}/-</div>
//             </div>
//           </MenuItem>
//         ))}
//       </Select>
//       {error && !selectedValue && (
//         <div className="px-4 py-2 text-red-600 text-sm">{error}</div>
//       )}
//     </div>
//   );
// };

// export default PricingComponent;

"use client";

import { MenuItem, Select } from "@mui/material";
import CustomText from "../../../components/CustomText";
import moment from "moment";
import momentTZ from "moment-timezone";

import { useEffect, useRef, useState } from "react";
import { textAlign } from "@mui/system";
import TripPdfDownloadBanner from "./TripPdfDownloadBanner";

const PricingComponent = ({
  openPopup,
  base_packages,
  batches,
  pickup_point,
  drop_point,
  selectedBatch,
  setSelectedBatch,
  selectedPackage,
  setSelectedPackage,
  selectedStartingPoint,
  setSelectedStartingPoint,
  selectedDroppingPoint,
  setSelectedDroppingPoint,
  itin_pdf,
  showCallBackForm,
  setShowCallBackForm,
  itinerary, 
  triggerValidation,
}) => {
  const [errors, setErrors] = useState({
    package: "",
    batch: "",
    startingPoint: "",
    droppingPoint: "",
  });
  const [mapToHoldBatches, setMapToHoldBatches] = useState(null);
  const [currMapKeySelected, setCurrMapKeySelected] = useState("ALL");
  const calculateMaxDiscount = () => {
    if (!base_packages || base_packages.length === 0) return 0;

    let maxDiscount = 0;
    base_packages.forEach((pkg) => {
      if (pkg.original_price && pkg.discounted_price) {
        const discount = pkg.original_price - pkg.discounted_price;
        if (discount > maxDiscount) {
          maxDiscount = discount;
        }
      }
    });
    return maxDiscount;
  };
  const maxDiscount = calculateMaxDiscount();
  const validate = () => {
    let valid = true;
    const newErrors = {
      package: "",
      batch: "",
      startingPoint: "",
      droppingPoint: "",
    };

    if (!selectedPackage) {
      newErrors.package = "Please select a package.";
      valid = false;
    }
    if (!selectedBatch) {
      newErrors.batch = "Please select a batch.";
      valid = false;
    }
    if (!selectedStartingPoint) {
      newErrors.startingPoint = "Please choose a starting point.";
      valid = false;
    }
    if (!selectedDroppingPoint) {
      newErrors.droppingPoint = "Please choose a dropping point.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      openPopup();
    }
  };
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (triggerValidation) {
      validate();
    }
  }, [triggerValidation]);

  useEffect(() => {
    console.log("pdf-link=" + itin_pdf);
    if (pickup_point != null) setSelectedStartingPoint(pickup_point[0]);
    if (drop_point != null) setSelectedDroppingPoint(drop_point[0]);
    if (batches) {
      const arr = [];
      // ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC", "ALL"]
      const map = new Map();

      arr.forEach((month) => {
        map.set(month, []);
      });

      batches?.forEach((trips) => {
        const currTripMonth = moment(trips.start_date)
          .format("MMMM")
          .toUpperCase();
        const currTripArray = map.get(currTripMonth) || [];
        map.set(currTripMonth, [...currTripArray, trips]);

        const allCurr = map.get("ALL") || [];
        map.set("ALL", [...allCurr, trips]);
      });

      setMapToHoldBatches(map);
    }
  }, [batches]);

  // Calculate prices for selected package
  const selectedPackagePrice = selectedPackage || base_packages?.[0];
  const baseOriginalPrice = selectedPackagePrice?.original_price || 0;
  const baseDiscountedPrice = selectedPackagePrice?.discounted_price || 0;
  
  // Add extra amount from selected batch if available
  const extraAmount = selectedBatch?.extra_amount || 0;
  const originalPrice = baseOriginalPrice;
  const discountedPrice = baseDiscountedPrice + extraAmount;

  return (
    <div className=" ">
      <div
        className=" px-4 md:px-6 min-w-full max-w-full font-titleRegular bg-gray-800 pb-3 pt-4 mb-3 rounded-none md:rounded-[10px]"
        
      >
        {/* Mobile Layout - New Design Based on Image */}
        <div className="md:hidden block space-y-4">
          {/* Pricing Section - New Design */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            {/* Pricing Heading with Discount Badge */}
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-900">
                Pricing
              </h5>
              {maxDiscount > 0 && (
                <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-1 rounded-full">
                  Upto ₹{maxDiscount.toLocaleString()} OFF
                </span>
              )}
            </div>

            {/* Select Occupancy Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Select Occupancy
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <text x="8" y="11" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">i</text>
                </svg>
              </div>

              {/* Occupancy Buttons - Changed to Orange */}
              <div className="flex gap-2">
                {base_packages?.map((pkg, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                      selectedPackage?.name === pkg.name || (!selectedPackage && index === 0)
                        ? "bg-orange-500 text-white"
                        : "bg-orange-50 text-orange-600 border border-orange-200"
                    }`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Type - If available in itinerary */}
            {itinerary?.transport_type && (
              <div className="text-sm text-gray-600 mb-3">
                {itinerary.transport_type}
              </div>
            )}

            {/* Selected Occupancy Display */}
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-700">
                {(selectedPackage || base_packages?.[0])?.name}
              </span>
            </div>

            {/* Price Display */}
            <div className="mb-2">
              <div className="flex items-baseline gap-3 mb-1">
                {originalPrice > baseDiscountedPrice && (
                  <span className="line-through text-gray-400 text-base">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  ₹{baseDiscountedPrice.toLocaleString('en-IN')}
                </span>
              </div>
              
              {/* Extra Amount Display - Show if batch has extra amount */}
              {selectedBatch?.extra_amount > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">+</span>
                  <span className="text-base font-semibold text-orange-600">
                    ₹{selectedBatch.extra_amount.toLocaleString('en-IN')}
                  </span>
                  {selectedBatch?.extra_reason && (
                    <span className="text-xs text-gray-500">
                      ({selectedBatch.extra_reason})
                    </span>
                  )}
                </div>
              )}
              
              {/* Final Total Price - Show if extra amount exists */}
              {selectedBatch?.extra_amount > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{discountedPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* GST Note */}
            <div className="text-xs text-gray-500">
              +5% GST *
            </div>

            {/* Error Message */}
            {!selectedPackage && errors.package && (
              <CustomText
                className="px-2 py-1 text-red-600 mt-2"
                content={errors.package}
                fontsize="12px"
              />
            )}
          </div>

          {/* Small Gap */}
          <div className="h-1"></div>

          {/* Batches Section - New Design */}
          <div className="mb-4 bg-white rounded-lg p-4 shadow-md">
            {/* Header with Filter Tabs */}
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-base font-semibold text-gray-900">
                Batches
                <span className="ml-0.5 font-normal text-red-600">*</span>
              </h5>

              {/* Filter Tabs - Horizontal */}
              <div className="flex items-center gap-1 border-b border-gray-200">
                <button
                  onClick={() => setCurrMapKeySelected("ALL")}
                  className={`px-3 py-1 text-xs font-medium transition-all ${
                    currMapKeySelected === "ALL"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                {mapToHoldBatches &&
                  Array.from(mapToHoldBatches.entries())
                    .filter(([key]) => key !== "ALL" && key !== -1)
                    .slice(0, 2)
                    .map(([key]) => (
                      <button
                        key={key}
                        onClick={() => setCurrMapKeySelected(key)}
                        className={`px-3 py-1 text-xs font-medium transition-all ${
                          currMapKeySelected === key
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                {mapToHoldBatches &&
                  Array.from(mapToHoldBatches.entries()).filter(
                    ([key]) => key !== "ALL" && key !== -1
                  ).length > 2 && (
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 flex items-center gap-1">
                      More
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
              </div>
            </div>

            {/* Batches List - Horizontal Row Design */}
            <div className="space-y-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {mapToHoldBatches &&
                currMapKeySelected &&
                mapToHoldBatches?.get(currMapKeySelected)?.map((batch, index) => {
                  // Determine batch status
                  const isSold = batch?.is_sold;
                  const hasExtraReason = batch?.extra_amount > 0 && batch?.extra_reason;
                  const isSpecialBatch = hasExtraReason; // Special batches have extra_reason
                  
                  return (
                    <div
                      onClick={() => {
                        if (isSold) {
                          return;
                        } else {
                          setSelectedBatch(batch);
                        }
                      }}
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedBatch === batch
                          ? "bg-orange-50 border border-orange-300"
                          : "bg-gray-50 border border-gray-200"
                      } ${isSold ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-100"}`}
                    >
                      {/* Left: Date Range */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {momentTZ.utc(batch.start_date).format("DD-MMM")} To{" "}
                          {momentTZ.utc(batch.end_date).format("DD-MMM")}
                        </p>
                      </div>

                      {/* Middle: Status Tags */}
                      <div className="flex items-center gap-2 mx-2">
                        {isSold ? (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                            Sold Out
                          </span>
                        ) : isSpecialBatch ? (
                          // Special Batch - Red background with white text (like X-mas)
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full font-medium">
                            {batch.extra_reason}
                          </span>
                        ) : (
                          // Regular batches - show "Available" or "Filling Fast" based on availability
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Right: Dropdown Indicator */}
                      <div className="flex-shrink-0">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-400"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Error Message */}
            {!selectedBatch && errors.batch && (
              <CustomText
                className="px-2 py-1 text-red-600 mt-2"
                content={errors.batch}
                fontsize="12px"
              />
            )}
          </div>

          {/* Starting and Dropping Points - Mobile */}
          <div className="space-y-3 mb-4">
            <div>
              <Dropdown
                label="Starting Point"
                options={pickup_point}
                selectedValue={selectedStartingPoint?.name}
                onChange={(value) =>
                  setSelectedStartingPoint(
                    pickup_point.find((point) => point.name === value)
                  )
                }
                error={errors.startingPoint}
              />
            </div>
            <div>
              <Dropdown
                label="Dropping Point"
                options={drop_point}
                selectedValue={selectedDroppingPoint?.name}
                onChange={(value) =>
                  setSelectedDroppingPoint(
                    drop_point.find((point) => point.name === value)
                  )
                }
                placeholder="Choose Dropping Point"
                error={errors.droppingPoint}
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout - Keep existing */}
        <div className="hidden md:block">
          {/* Pricing Section - Starting from */}
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              borderRadius: 10,
              overflowY: "auto",
            }}
            className="flex flex-col justify-center items-center bg-white p-4 rounded-xl shadow-md w-full"
          >
            <div>
              {/* Title and Discount Badge */}
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  Starting From
                </h4>
                {maxDiscount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 pt-1 rounded-full">
                    Upto ₹{maxDiscount.toLocaleString()} OFF
                  </span>
                )}
              </div>

              {/* Price Section */}
              <div className="flex flex-wrap items-center mt-2 gap-2">
                <span className="text-3xl font-bold text-orange-500">
                  ₹
                  {(
                    (selectedPackage?.discounted_price ||
                      base_packages?.[0]?.discounted_price) +
                    (selectedStartingPoint?.price || 0) +
                    (selectedDroppingPoint?.price || 0) +
                    (selectedBatch?.extra_amount || 0)
                  ).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">per person</span>
                {selectedBatch?.extra_amount > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    +₹{selectedBatch.extra_amount}{" "}
                    {selectedBatch?.extra_reason || "premium"}
                  </span>
                )}
              </div>

              {/* Per Person Label */}
              {/* <div className="mt-1">
              
            </div> */}
            </div>

            {/* Book Now Button - Desktop Only */}
            <button
              onClick={handleSubmit}
              className="bg-orange-500 mt-4 w-full text-white py-2 rounded-full text-lg font-bold hover:bg-orange-600 transition duration-300"
            >
              Book Now
            </button>
          </div>

          {/* Pricing */}
          <div className="">
            <h5 className="text-lg font-semibold mt-2 text-white">
              Pricing
              <span className="ml-0.5 font-normal text-red-600">*</span>
            </h5>
            <div className="relative mt-1 border p-4 rounded-lg max-h-full overflow-auto border-gray-300 bg-white">
              {base_packages?.map((packages, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center my-2 px-2 cursor-pointer ${
                    !selectedPackage && index == 0
                      ? "border-[1px] border-black/30 rounded-lg"
                      : ""
                  } ${
                    selectedPackage?.name === packages.name
                      ? " border-2 border-black "
                      : ""
                  } `}
                  onClick={() => setSelectedPackage(packages)}
                >
                  <span className="text-gray-600">{packages?.name}</span>
                  <div className="text-nowrap flex justify-start items-center text-start">
                    <div className="line-through inline-block mx-4">
                      ₹ {packages?.original_price}/-
                    </div>
                    <div className="text-orange-500 inline-block">
                      ₹ {packages?.discounted_price}/-
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!selectedPackage && errors.package && (
              <CustomText
                className="px-4 py-2 text-red-600"
                content={errors.package}
                fontsize="12px"
              />
            )}
          </div>

          {/* Batches - Desktop */}
          <div className="mb-6 ">
            <div className="flex flex-col sm:flex-row border-green-400 items-start sm:items-center gap-2 py-4 sm:justify-between">
              <h5 className="text-lg font-semibold text-white">
                Batches
                <span className="ml-0.5 font-normal text-red-600">*</span>
              </h5>

              {/* Commented by siddharth */}
              {/* <div className="w-full sm:w-40 scrollbar-orange flex gap-2 uppercase px-2 overflow-x-scroll bg-white/25 text-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] cursor-pointer m-1 p-1 text-sm font-bold backdrop-blur-md rounded-[10px]">
                {mapToHoldBatches && (
                  <div
                    className={` hover:bg-orange-400    m-1 p-1 text-sm font-bold rounded-md ${
                      currMapKeySelected == "ALL" ? "bg-[#EA580C] text-white" : ""
                    }`}
                    onClick={() => setCurrMapKeySelected("ALL")}
                    key={"ALL"}
                  >
                    ALL
                  </div>
                )}
                {mapToHoldBatches &&
                  Array.from(mapToHoldBatches.entries()).map(([key, val]) => {
                    if (val === -1 || key == "ALL") return null
                    return (
                      <div
                        className={` hover:bg-orange-400   m-1 p-1 text-sm font-bold rounded-md ${
                          currMapKeySelected == key ? "bg-[#EA580C] text-white" : ""
                        }`}
                        onClick={() => setCurrMapKeySelected(key)}
                        key={key}
                      >
                        {key}
                      </div>
                    )
                  })}
              </div> */}

              <Select
                value={currMapKeySelected}
                onChange={(e) => setCurrMapKeySelected(e.target.value)}
                displayEmpty
                size="small"
                sx={{
                  width: 130,
                  m: 1,
                  backgroundColor: "rgb(255, 255, 255)",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                  textTransform: "uppercase",
                  color: "#1e293b", // slate-800
                  borderRadius: "10px",
                }}
              >
                {mapToHoldBatches && <MenuItem value="ALL">ALL</MenuItem>}
                {mapToHoldBatches &&
                  Array.from(mapToHoldBatches.entries()).map(([key, val]) => {
                    if (val === -1 || key === "ALL") return null;
                    return (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>

            {/* <div className="relative">
              <button
                onClick={() => scroll(-100)}
                className="absolute -left-0 top-1/2 -translate-y-1/2 z-10 aspect-square p-1.5 border-[1px] border-black/10 bg-gray-50 hover:bg-gray-200 rounded-full transform"
              >
                <FaAngleLeft />
              </button>
              <div
                ref={scrollRef}
                className="flex space-x-2 mt-2 border p-4 mx-8 rounded-full overflow-auto no-scrollbar relative"
              >
                {batches?.map((batch, index) => (
                  <button
                    key={index}
                    className={`py-2 flex-shrink-0 text-sm px-4 rounded-full border relative ${
                      batch.is_sold
                        ? "bg-white text-gray-500 cursor-not-allowed"
                        : selectedBatch === batch
                          ? "bg-gray-200"
                          : "bg-gray-50 hover:bg-gray-300"
                    }`}
                    onClick={() => {
                      if (batch.is_sold) return
                      setSelectedBatch(batch)
                    }}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div>
                        {moment(batch.start_date).format("DD-MMM ")} To {moment(batch.end_date).format("DD-MMM ")}
                      </div>
                      {batch.is_sold && <div className="text-[7px] bg-red-600 text-white px-1 rounded-lg">Sold Out</div>}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => scroll(100)}
                className="absolute -right-0 top-1/2 -translate-y-1/2 p-1.5 border-[1px] border-black/10 z-10 aspect-square bg-gray-50 hover:bg-gray-200 rounded-full transform"
              >
                <FaAngleRight />
              </button>
            </div> */}

            <div
              className="relative bg-[#f9f9f9] w-full overflow-y-auto overflow-x-auto scrollbar-black p-1"
              style={{ maxHeight: 500, height: 200, borderRadius: 10 }}
            >
              {mapToHoldBatches &&
                currMapKeySelected &&
                mapToHoldBatches?.get(currMapKeySelected)?.map((batch, index) => {
                  return (
                    <div
                      onClick={() => {
                        if (batch?.is_sold) {
                          return;
                        } else {
                          setSelectedBatch(batch);
                        }
                      }}
                      style={{ textAlign: "center" }}
                      key={index}
                      className={`bg-slate-50 p-2 m-2 border-2 hover:border-red-400 rounded-md ${
                        selectedBatch === batch
                          ? "border-red-500"
                          : "border-gray-300"
                      } ${batch?.is_sold ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <p
                        className={`${
                          selectedBatch === batch ? "bg-gray-200" : "bg-gray-50"
                        } hover:bg-gray-300 text-slate-800 cursor-pointer hover:scale-y-105`}
                      >
                        {momentTZ.utc(batch.start_date).format("DD-MMM")} To{" "}
                        {momentTZ.utc(batch.end_date).format("DD-MMM")}
                      </p>

                      {/* Add reason display here */}
                      {batch?.extra_amount > 0 && batch?.extra_reason && (
                        <div className="mt-1">
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            {batch.extra_reason}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            {!selectedBatch && errors.batch && (
              <CustomText
                className="px-4 py-2 text-red-600"
                content={errors.batch}
                fontsize="12px"
              />
            )}
          </div>

          {/* Starting and Dropping Points - Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <Dropdown
                label="Starting Point"
                options={pickup_point}
                selectedValue={selectedStartingPoint?.name}
                onChange={(value) =>
                  setSelectedStartingPoint(
                    pickup_point.find((point) => point.name === value)
                  )
                }
                error={errors.startingPoint}
              />
            </div>
            <div>
              <Dropdown
                label="Dropping Point"
                options={drop_point}
                selectedValue={selectedDroppingPoint?.name}
                onChange={(value) =>
                  setSelectedDroppingPoint(
                    drop_point.find((point) => point.name === value)
                  )
                }
                placeholder="Choose Dropping Point"
                error={errors.droppingPoint}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <CustomModal
        padding={4}
        open={showCallBackForm}
        handleClose={() => setShowCallBackForm(false)}
        restContent={<CustomCallBackReq setShowCallBackForm={setShowCallBackForm} />}
      /> */}

    <div className="relative z-10 p-4 ">
      <TripPdfDownloadBanner pdfLink={itin_pdf} itinerary={itinerary} />
      </div>
    </div>
  );
};
const Dropdown = ({
  label,
  options,
  selectedValue,
  onChange,
  placeholder = "Select an option",
  error = "",
}) => {
  return (
    <div className="w-full">
      <div className="w-fit relative mb-3 text-sm font-nunito-semiBold600 text-white">
        {label}
        <span className="ml-0.5 absolute left-full font-normal text-red-600">
          *
        </span>
      </div>
      <Select
        sx={{
          "& .MuiInputBase-root": { borderRadius: "0.75rem", padding: "8px" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3B3B3B" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3B3B3B",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3B3B3B",
          },
          "& .MuiSelect-select": { padding: "8px 16px" },
          "& .MuiSvgIcon-root": {
            right: "5px",
            top: "50%",
            transform: "translateY(-50%)",
          },
        }}
        style={{ backgroundColor: "white" }}
        className="w-full"
        value={selectedValue || "null"}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="null" disabled>
          {placeholder}
        </MenuItem>
        {options?.map((option, index) => (
          <MenuItem key={index} value={option.name}>
            <div className="flex items-center justify-between w-full">
              <div>{option.name}</div>
              {/* Only show price if it's greater than 0 */}
              {option.price > 0 && (
                <>
                  <span className="mx-1">|</span>
                  <div>₹{option.price}/-</div>
                </>
              )}
            </div>
          </MenuItem>
        ))}
      </Select>
      {error && !selectedValue && (
        <div className="px-4 py-2 text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
};

export default PricingComponent;
