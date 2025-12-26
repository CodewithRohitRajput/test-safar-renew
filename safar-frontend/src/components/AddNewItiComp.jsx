"use client";

import React, { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import CustomInput from "./CustomInput";
import CustomMultiItiSelect from "./CustomMultiItiSelect";
import CustomText from "./CustomText";
import { Box, IconButton } from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa";
import DraggableInputList from "./DraggableInputList";
import DraggableHotelList from "./DraggableHotelList";
import PackageComp from "./PackageComp";
import CustomButton from "./CustomButton";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { get, post, put } from "../constants/axiosClient";
import { localStorageHelper } from "../helper/storageHelper";
import { PAGES } from "../constants/PagesName";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import InfiniteInputBox from "./InfiniteInputBox";
import moment from "moment-timezone";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  CLOUD_NAME,
  UPLOAD_PRESET_NAME,
} from "../constants/CloudinaryConstants";
import { setValue } from "@/lib/globalSlice";
import JoditEditorComponent from "./JoditEditor";
import { isHtmlContentEmpty } from "../utils/htmlUtils";
import CustomRadioButtonGroup from "./CustomRadioButtonGroup";
import { light } from "@/_assets/themes/themes";

function AddNewItiComp({
  state,
  setState,
  dayintro,
  setdayintro,
  hotelinfo,
  sethotelinfo,
  packagedetails,
  setpackagedetails,
  fetch_iti = () => {},
  locations = [],
  selectedLocationId = "",
  setSelectedLocationId = () => {},
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const getAllCategories = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await get(API_ENDPOINTS.COMMON.GET_ALL_CATEGORIES).then((d) => {
        if (d.message == "CATEGORIES_FETCHED" && d.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          setState((prevs) => ({
            ...prevs,
            categories_data: d?.data?.categories,
            categories_list: d?.data?.categories?.map(
              (category) => category?.name
            ),
          }));
          console.log(
            "logging data from cat list",
            d?.data?.categories?.map((category) => category?.name)
          );
        }
      });
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      console.error(error);
      const err_response = error?.response?.data;
      if (
        err_response.success == false &&
        err_response.message == "VALIDATION_INVALID_TOKEN"
      ) {
        localStorageHelper.removeItem("login_data");
        router.push(PAGES.LOGIN, { replace: true });
      }
    }
  };
  // const [locations, setLocations] = useState([]);
  // const [selectedLocationId, setSelectedLocationId] = useState('');

  // const fetchLocations = async () => {
  //   try {
  //     const res = await get(API_ENDPOINTS.locations.list);
  //     if (res?.success && res?.message === "LOCATION_LIST") {
  //       const items = (res?.data?.items || []).map((l) => ({
  //         id: l.id,
  //         name: l.name,
  //       }));
  //       setLocations(items);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // useEffect(() => {
  //   fetchLocations();
  // }, []);
  const compressImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7
        );
      };

      img.onerror = (error) => reject(error);
    });
  };
  const handleUpload = async (fileIndex) => {
    const selectedImage = state.iti_img[fileIndex];

    // Check if the selected item is already a URL or if it's an empty string
    if (typeof selectedImage === "string" && selectedImage) {
      console.log(`Image already uploaded: ${selectedImage}`);
      return; // Skip if it's already uploaded
    }

    // Proceed with upload only if it's a File object
    if (!selectedImage || selectedImage === "") {
      console.error(`No file selected at index ${fileIndex}`);
      return; // Skip if no file is selected
    }

    const compressedImageBlob = await compressImage(selectedImage);
    const compressedImageFile = new File(
      [compressedImageBlob],
      selectedImage.name,
      { type: "image/jpeg" }
    );
    console.log(`Uploading image at index ${fileIndex}:`, selectedImage);

    const formData = new FormData();
    formData.append("file", compressedImageFile); // Make sure selectedImage is indeed a File object
    formData.append("upload_preset", UPLOAD_PRESET_NAME);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Update the specific index with the newly uploaded image URL
        const updatedimgs = [...state.iti_img];
        updatedimgs[fileIndex] = data.secure_url; // Store the URL
        setState((prevState) => ({ ...prevState, iti_img: updatedimgs }));
      })
      .catch((error) => {
        console.error("Upload failed", error);
      });
  };
  const handleUpload22 = async (fileIndex, localSelectedImages) => {
    const selectedImage = localSelectedImages[fileIndex]; // Fetch from local variable

    // Check if the selected item is already a URL or an empty string
    if (typeof selectedImage === "string" && selectedImage) {
      console.log(`Image already uploaded: ${selectedImage}`);
      return; // Skip if it's already uploaded
    }

    // Check if the selected image is a valid File object
    if (!selectedImage || selectedImage === "") {
      console.error(`No valid file selected at index ${fileIndex}`);
      return;
    }
    const compressedImageBlob = await compressImage(selectedImage);
    const compressedImageFile = new File(
      [compressedImageBlob],
      selectedImage.name,
      { type: "image/jpeg" }
    );
    console.log(`Uploading image at index ${fileIndex}:`, compressedImageFile);

    const formData = new FormData();
    formData.append("file", compressedImageFile);
    formData.append("upload_preset", UPLOAD_PRESET_NAME);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        // Update the specific index in the local variable with the newly uploaded image URL
        localSelectedImages[fileIndex] = data.secure_url; // Store the URL locally

        // After upload, update the state with the new image array
        setState((prevState) => ({
          ...prevState,
          iti_img: localSelectedImages,
        }));

        console.log(`Image uploaded successfully: ${data.secure_url}`);
      })
      .catch((error) => {
        console.error("Upload failed", error);
      });
  };
  const handleFileInputChange = (fileIndex, file) => {
    const updatedimgs = [...state.iti_img];
    updatedimgs[fileIndex] = file;
    setState((prevs) => ({ ...prevs, iti_img: updatedimgs }));
    let localSelectedImages = [...state.iti_img];
    localSelectedImages[fileIndex] = file;

    handleUpload22(fileIndex, localSelectedImages);
  };
  const handleImageChange = (fileIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileInputChange(fileIndex, file);
    }
  };
  const removeFileInput = (fileIndex) => {
    setState((prevState) => ({
      ...prevState,
      iti_img: prevState.iti_img.filter((_, index) => index !== fileIndex),
    }));
  };
  const addFileInput = (index) => {
    setState((prevState) => ({
      ...prevState,
      iti_img: [...prevState.iti_img, ""],
    }));
  };
  const validateDayIntro = (dayintros) => {
    for (let dayintro of dayintros) {
      if (!dayintro.day || dayintro.day <= 0) {
        return false;
      }

      if (!dayintro.title || dayintro.title.trim() === "") {
        return false;
      }

      if (!dayintro.description || dayintro.description.trim() === "") {
        return false;
      }
    }

    return true;
  };
  const validateHotels = (hotels) => {
    if (!hotels || hotels.length === 0) {
      return true; // Allow empty hotel list
    }

    // Filter out empty hotels and validate the rest
    const validHotels = hotels.filter(
      (hotel) =>
        hotel.name &&
        hotel.name.trim() !== "" &&
        hotel.rating > 0 &&
        hotel.reference &&
        hotel.reference.trim() !== "" &&
        hotel.images &&
        hotel.images.some((img) => img && img.trim() !== "")
    );

    // Return true if all hotels are valid or if there are no hotels
    return validHotels.length === hotels.length;
  };
  const validatePackages = (packages) => {
    for (let i = 0; i < packages.base_packages.length; i++) {
      const basePackage = packages.base_packages[i];

      if (!basePackage.name || basePackage.name.trim() === "") {
        return false;
      }

      if (
        !basePackage.original_price ||
        isNaN(basePackage.original_price) ||
        Number(basePackage.original_price) <= 0
      ) {
        return false;
      }

      if (
        !basePackage.discounted_price ||
        isNaN(basePackage.discounted_price) ||
        Number(basePackage.discounted_price) <= 0
      ) {
        return false;
      }
    }

    for (let i = 0; i < packages.pickup_point.length; i++) {
      const pickup = packages.pickup_point[i];

      if (!pickup.name || pickup.name.trim() === "") {
        return false;
      }

      if (isNaN(pickup.price) || Number(pickup.price) < 0) {
        return false;
      }
    }

    for (let i = 0; i < packages.drop_point.length; i++) {
      const drop = packages.drop_point[i];

      if (!drop.name || drop.name.trim() === "") {
        return false;
      }

      if (isNaN(drop.price) || Number(drop.price) < 0) {
        return false;
      }
    }

    for (let i = 0; i < packages.batches.length; i++) {
      const batch = packages.batches[i];

      if (!batch.start_date || isNaN(Date.parse(batch.start_date))) {
        return false;
      }

      if (!batch.end_date || isNaN(Date.parse(batch.end_date))) {
        return false;
      }

      if (new Date(batch.start_date) >= new Date(batch.end_date)) {
        return false;
      }
    }
    return true;
  };
  const postItinerary = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const formattedBatches = packagedetails?.batches?.map((batch) => ({
        ...batch,
        start_date: moment(batch.start_date)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        end_date: moment(batch.end_date)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      }));
      const formated_base_packages = packagedetails?.base_packages?.map(
        (base) => ({
          ...base,
          original_price: Number(base.original_price),
          discounted_price: Number(base.discounted_price),
        })
      );
      const formatted_pickup_point = packagedetails?.pickup_point?.map(
        (pick) => ({
          ...pick,
          price: Number(pick.price),
        })
      );
      const formatted_drop_point = packagedetails?.drop_point?.map((drop) => ({
        ...drop,
        price: Number(drop.price),
      }));
      const data_to_send = {
        title: state.iti_name,
        description: state.iti_desc,
        shortDescription: state.iti_short_desc,
        is_customize: state?.iti_is_customize ?? null,
        city:
          locations.find((loc) => loc.id === selectedLocationId)?.name || "",
        view_images: state.iti_img,
        duration: state.iti_duration != null ? Number(state.iti_duration) : 0,
        altitude: state.iti_altitude,
        scenery: state.iti_scenary,
        cultural_sites: state.iti_cultural_site,
        itin_pdf: state.iti_brochure_banner,
        day_details: dayintro,
        hotels: hotelinfo,
        notes: state.iti_notes,
        base_packages: formated_base_packages,
        pickup_point: formatted_pickup_point,
        drop_point: formatted_drop_point,
        batches: formattedBatches,
        is_trending: true,
        is_active: true,
        categoryId: state.selected_category,
        locationIds: selectedLocationId ? [selectedLocationId] : [],
        inclusions_exclusions: {
          inclusions: state.iti_inclusion,
          exclusions: state.iti_exclusion,
        },
        seo_indexed: state.seo_indexed ?? true,
        seo_title: state.seo_title || null,
        seo_description: state.seo_description || null,
        seo_keywords: state.seo_keywords || null,
        seo_author: state.seo_author || "safarwanderlust",
      };
      console.log("logging every details", data_to_send);
      await post(API_ENDPOINTS.ADMIN.POST_NEW_ITINERARY, data_to_send).then(
        (d) => {
          if (d.message == "ITINERARY_ADDED" && d.success == true) {
            dispatch(setValue({ key: "to_show_loader", value: false }));
            setState((prevs) => ({ ...prevs, is_modalopen: false }));
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
              dispatch(
                setValue({
                  key: "alert_content",
                  value: "Itinerary Added Successfully",
                })
              );
            fetch_iti(state.fetched_data[0]?.id);
          }
        }
      );
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      console.error(error);
      const err_response = error?.response?.data;
      if (
        err_response.success == false &&
        err_response.message == "VALIDATION_INVALID_TOKEN"
      ) {
        localStorageHelper.removeItem("login_data");
        router.push(PAGES.LOGIN, { replace: true });
      }
    }
  };
  const editItinerary = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const formattedBatches = packagedetails?.batches?.map((batch) => ({
        ...batch,
        start_date: moment(batch.start_date)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        end_date: moment(batch.end_date)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      }));
      const formated_base_packages = packagedetails?.base_packages?.map(
        (base) => ({
          ...base,
          original_price: Number(base.original_price),
          discounted_price: Number(base.discounted_price),
        })
      );
      const formatted_pickup_point = packagedetails?.pickup_point?.map(
        (pick) => ({
          ...pick,
          price: Number(pick.price),
        })
      );
      const formatted_drop_point = packagedetails?.drop_point?.map((drop) => ({
        ...drop,
        price: Number(drop.price),
      }));
      const data_to_send = {
        title: state.iti_name,
        description: state.iti_desc,
        shortDescription: state.iti_short_desc,
        is_customize: state?.iti_is_customize ?? null,
        city:
          locations.find((loc) => loc.id === selectedLocationId)?.name || "",
        view_images: state.iti_img,
        duration: state.iti_duration != null ? Number(state.iti_duration) : 0,
        altitude: state.iti_altitude,
        scenery: state.iti_scenary,
        cultural_sites: state.iti_cultural_site,
        itin_pdf: state.iti_brochure_banner,
        day_details: dayintro,
        hotels: hotelinfo,
        notes: state.iti_notes,
        base_packages: formated_base_packages,
        pickup_point: formatted_pickup_point,
        drop_point: formatted_drop_point,
        batches: formattedBatches,
        category: [],
        on_sale: null,
        deleted: false,
        is_trending: true,
        is_active:
          state.original_is_active !== undefined
            ? state.original_is_active
            : true,
        categoryId: state.selected_category,
        locationIds: selectedLocationId ? [selectedLocationId] : [],
        inclusions_exclusions: {
          inclusions: state.iti_inclusion,
          exclusions: state.iti_exclusion,
        },
        seo_indexed: state.seo_indexed ?? true,
        seo_title: state.seo_title || null,
        seo_description: state.seo_description || null,
        seo_keywords: state.seo_keywords || null,
        seo_author: state.seo_author || "safarwanderlust",
      };
      console.log("logging every details for edit", data_to_send);
      await put(
        API_ENDPOINTS.ADMIN.POST_NEW_ITINERARY + `/${state.iti_id}`,
        data_to_send
      ).then((d) => {
        if (d.message == "ITINERARY_UPDATED" && d.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          setState((prevs) => ({ ...prevs, is_modalopen: false }));
          dispatch(
            setValue({
              key: "to_show_alert",
              value: true,
            })
          ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Itinerary Added Successfully",
              })
            );
          fetch_iti(state.fetched_data[0]?.id);
        }
      });
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      console.error(error);
      const err_response = error?.response?.data;
      if (
        err_response.success == false &&
        err_response.message == "VALIDATION_INVALID_TOKEN"
      ) {
        localStorageHelper.removeItem("login_data");
        router.push(PAGES.LOGIN, { replace: true });
      }
    }
  };
  return (
    <Dialog
      fullScreen
      open={state.is_modalopen}
      onClose={() => setState((prevs) => ({ ...prevs, is_modalopen: false }))}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1,
          padding: "16px 24px",
        }}
      >
        <div className="text-xl font-semibold">
          {state.current_modal_page_count == 1 ? (
            state.modal_open_purpose == "view_page" ? (
              <span>
                Viewing this <strong>{state.iti_name}</strong>
              </span>
            ) : state.modal_open_purpose == "edit_iti" ? (
              <span>
                Editing this <strong>{state.iti_name}</strong>
              </span>
            ) : state.modal_open_purpose == "duplicate_iti" ? (
              <span>
                Duplicating this <strong>{state.iti_name}</strong>
              </span>
            ) : (
              <span>
                Add new <strong>Itinerary</strong>
              </span>
            )
          ) : state.current_modal_page_count == 2 ? (
            <span>
              Daywise <strong>Activities</strong>
            </span>
          ) : state.current_modal_page_count == 3 ? (
            <span>
              <strong>Hotel</strong> Details
            </span>
          ) : (
            <span>
              Necessary <strong>Information</strong>
            </span>
          )}
        </div>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() =>
            setState((prevs) => ({ ...prevs, is_modalopen: false }))
          }
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ padding: "24px", overflowY: "auto" }}>
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustomInput
                top_title="Itinerary Name"
                content="Enter name of Itinerary"
                backgroundColor="white"
                value={state.iti_name}
                onchange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    iti_name: e.target.value,
                  }))
                }
                error_text={
                  state.to_show_error &&
                  state.iti_name?.length == 0 &&
                  "Enter the name of itinerary to continue"
                }
              />
              <CustomMultiItiSelect
                top_title={"Travel Location"}
                option_data={locations}
                multiple={false}
                selectedValue={selectedLocationId}
                onOpen={() => {}}
                content_destruct={(item) => `${item.name}`}
                onChange={(id) => {
                  console.log("Location selected:", id);
                  setSelectedLocationId(id);
                }}
              />
              <CustomMultiItiSelect
                top_title={"Choose Categories"}
                option_data={state.categories_data}
                multiple={true}
                selectedValue={state.selected_category}
                onOpen={() =>
                  state.categories_list?.length === 0
                    ? getAllCategories()
                    : null
                }
                content_destruct={(item) => `${item.name}`}
                onChange={(selectedIds) =>
                  setState((prevs) => ({
                    ...prevs,
                    selected_category: selectedIds,
                  }))
                }
              />
            </div>
          </div>

          {/* Images and Description Section */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="text-start mb-4">
                <CustomText
                  secondaryfontsize
                  secondaryfontweight
                  content={"View Images :"}
                />
              </div>
              <Box className="flex flex-col w-full mb-4">
                {(state.iti_img || []).map((image, fileIndex) => (
                  <Box
                    key={fileIndex}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <div className="flex flex-wrap justify-center items-center rounded-md border border-dashed border-black p-3 bg-[#FAFAFA]">
                      <button
                        className="font-nunitoregular400 text-white bg-black py-3 px-8 rounded-md transition-transform transform duration-75 active:scale-95"
                        onClick={() => {
                          if (image?.name == null) {
                            document
                              .getElementById(`inputfile-${fileIndex}`)
                              .click();
                          } else {
                            handleUpload(fileIndex);
                          }
                        }}
                        disabled={typeof image === "string" && image !== ""}
                      >
                        {typeof image === "string" && image !== ""
                          ? "Image Uploaded"
                          : image && image.name
                            ? "Upload"
                            : "Browse..."}
                      </button>

                      {(!image ||
                        (typeof image !== "string" && image !== "")) && (
                        <button
                          className="font-nunitoregular400 text-black py-3 px-8 rounded-md"
                          onClick={() =>
                            document
                              .getElementById(`inputfile-${fileIndex}`)
                              .click()
                          }
                        >
                          {image && image.name
                            ? image.name
                            : "Or drop Brochure Activity Images here"}
                        </button>
                      )}

                      <input
                        id={`inputfile-${fileIndex}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          handleImageChange(fileIndex, e);
                        }}
                      />
                    </div>
                    {state.iti_img?.length > 1 && (
                      <IconButton
                        onClick={() => removeFileInput(fileIndex)}
                        color="error"
                        sx={{ marginLeft: "8px" }}
                      >
                        <FaMinus />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <IconButton onClick={() => addFileInput()} color="primary">
                  <FaPlus />
                </IconButton>
                {state.to_show_error && state.iti_img?.[0]?.length == 0 && (
                  <div className="flex justify-start my-2">
                    <CustomText
                      content={"Please add a image to continue"}
                      className="text-red-500"
                      fontsize="12px"
                    />
                  </div>
                )}
              </Box>
            </div>
            <div>
              <JoditEditorComponent
                top_title="Short Description"
                placeholder="Enter short description about the itinerary"
                value={state.iti_short_desc}
                onChange={(content) =>
                  setState((prevs) => ({
                    ...prevs,
                    iti_short_desc: content,
                  }))
                }
                error_text={
                  state.to_show_error &&
                  isHtmlContentEmpty(state.iti_short_desc) &&
                  "Enter the short description to continue"
                }
                height="200px"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <JoditEditorComponent
              top_title="Description"
              placeholder="Add detailed description about the itinerary"
              value={state.iti_desc}
              onChange={(content) =>
                setState((prevs) => ({
                  ...prevs,
                  iti_desc: content,
                }))
              }
              error_text={
                state.to_show_error &&
                isHtmlContentEmpty(state.iti_desc) &&
                "Enter the description to continue"
              }
              height="300px"
            />
          </div>

          {/* Additional Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is Customizable?
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={state.iti_is_customize ?? ""}
                  onChange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      iti_is_customize:
                        e.target.value === ""
                          ? null
                          : e.target.value === "true"
                            ? true
                            : false,
                    }))
                  }
                >
                  <option value="">Not specified</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <CustomInput
                backgroundColor="white"
                top_title="Duration"
                content="Add Duration (In Days)"
                default_input_type={false}
                set_input_type="number"
                value={state.iti_duration}
                onchange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    iti_duration: e.target.value,
                  }))
                }
                error_text={
                  state.to_show_error &&
                  state.iti_duration == 0 &&
                  "Enter the duration to continue"
                }
              />
              <CustomInput
                backgroundColor="white"
                top_title="Altitude"
                content="Enter your Altitude"
                value={state.iti_altitude}
                onchange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    iti_altitude: e.target.value,
                  }))
                }
              />
              <CustomInput
                backgroundColor="white"
                top_title="Scenary"
                content="Enter your View"
                value={state.iti_scenary}
                onchange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    iti_scenary: e.target.value,
                  }))
                }
              />
              <CustomInput
                backgroundColor="white"
                top_title="Cultural Site"
                content="Add Cultural Site"
                value={state.iti_cultural_site}
                onchange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    iti_cultural_site: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Brochure Section */}
          <div className="mb-8">
            <CustomInput
              backgroundColor="white"
              top_title="Brochure Banner"
              content="Paste the Drive link to Brochure"
              value={state.iti_brochure_banner}
              onchange={(e) =>
                setState((prevs) => ({
                  ...prevs,
                  iti_brochure_banner: e.target.value,
                }))
              }
              error_text={
                state.to_show_error &&
                state.iti_brochure_banner?.length == 0 &&
                "Enter the brochure banner link to continue"
              }
            />
          </div>

          {/* Daywise Activities Section */}
          <div className="border-t-2 border-orange-500 my-6"></div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Daywise Activities</h2>
            <DraggableInputList
              inputState={dayintro}
              setFinalData={setdayintro}
              to_show_error={state.page2_error}
            />
          </div>

          {/* Hotel Details Section */}
          <div className="border-t-2 border-orange-500 my-6"></div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Hotel Details</h2>
            <DraggableHotelList
              hotelstate={hotelinfo}
              setHotels={sethotelinfo}
              to_show_error={state.page3_error}
            />
          </div>

          {/* Inclusions/Exclusions Section */}
          <div className="border-t-2 border-orange-600 my-6"></div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">
              Inclusions & Exclusions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <JoditEditorComponent
                  top_title="Inclusions"
                  placeholder="Enter inclusions separated by full stops (.) - Each sentence will become a separate inclusion point"
                  value={state.iti_inclusion_single || ""}
                  onChange={(content) => {
                    // Clean HTML content first
                    const cleanContent = content.replace(/<[^>]*>/g, "").trim();

                    // Split by full stops and filter out empty strings
                    const inclusionArray = cleanContent
                      .split(".")
                      .map((inclusion) => inclusion.trim())
                      .filter((inclusion) => inclusion.length > 0);

                    setState((prevs) => ({
                      ...prevs,
                      iti_inclusion: inclusionArray,
                      iti_inclusion_single: content, // Keep original HTML for editor
                    }));
                  }}
                  error_text={
                    state.to_show_error &&
                    isHtmlContentEmpty(state.iti_inclusion_single) &&
                    "Enter the inclusions to continue"
                  }
                  height="200px"
                />
                <div className="mt-2 text-sm text-gray-600">
                  💡 <strong>Tip:</strong> Write each inclusion point and end
                  with a full stop (.) to create separate bullet points
                </div>
              </div>
              <div>
                <JoditEditorComponent
                  top_title="Exclusions"
                  placeholder="Enter exclusions separated by full stops (.) - Each sentence will become a separate exclusion point"
                  value={state.iti_exclusion_single || ""}
                  onChange={(content) => {
                    // Clean HTML content first
                    const cleanContent = content.replace(/<[^>]*>/g, "").trim();

                    // Split by full stops and filter out empty strings
                    const exclusionArray = cleanContent
                      .split(".")
                      .map((exclusion) => exclusion.trim())
                      .filter((exclusion) => exclusion.length > 0);

                    setState((prevs) => ({
                      ...prevs,
                      iti_exclusion: exclusionArray,
                      iti_exclusion_single: content, // Keep original HTML for editor
                    }));
                  }}
                  error_text={
                    state.to_show_error &&
                    isHtmlContentEmpty(state.iti_exclusion_single) &&
                    "Enter the exclusions to continue"
                  }
                  height="200px"
                />
                <div className="mt-2 text-sm text-gray-600">
                  💡 <strong>Tip:</strong> Write each exclusion point and end
                  with a full stop (.) to create separate bullet points
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-8">
            <JoditEditorComponent
              top_title="Notes"
              placeholder="Enter notes separated by full stops (.) - Each sentence will become a separate note point"
              value={state.iti_notes_single || ""}
              onChange={(content) => {
                // Clean HTML content first
                const cleanContent = content.replace(/<[^>]*>/g, "").trim();

                // Split by full stops and filter out empty strings
                const notesArray = cleanContent
                  .split(".")
                  .map((note) => note.trim())
                  .filter((note) => note.length > 0);

                setState((prevs) => ({
                  ...prevs,
                  iti_notes: notesArray,
                  iti_notes_single: content, // Keep original HTML for editor
                }));
              }}
              error_text={
                state.to_show_error &&
                isHtmlContentEmpty(state.iti_notes_single) &&
                "Enter the notes to continue"
              }
              height="200px"
            />
            <div className="mt-2 text-sm text-gray-600">
              💡 <strong>Tip:</strong> Write each note point and end with a full
              stop (.) to create separate bullet points
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              Itinerary <strong>Pricing</strong>
            </h2>
            <div className="w-full text-start mb-4">
              <CustomText content={"Package Details"} fontsize="16px" />
            </div>
            <PackageComp
              state={packagedetails}
              setState={setpackagedetails}
              to_show_error={state.page4_error}
            />
          </div>

          {/* SEO Information Section */}
          <div className="border-t-2 border-orange-600 my-6"></div>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">SEO Information</h2>
              <CustomButton
                content="SEO INFORMATION"
                btncolor={light.signinbtnbackground}
                onClick={() => {
                  setState((prevs) => ({
                    ...prevs,
                    seo_modal_open: true,
                  }));
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <CustomButton
              className="mt-3 bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] min-w-[200px] max-w-[220px] py-4"
              text_classname={"text-white text-lg"}
              content={
                state.modal_open_purpose === "edit_iti"
                  ? "Edit this " + state.iti_name
                  : state.modal_open_purpose === "duplicate_iti"
                    ? "Duplicate this " + state.iti_name
                    : "Create new Itinerary"
              }
              onClick={() => {
                const page1Invalid =
                  state.iti_name?.length === 0 ||
                  !selectedLocationId ||
                  state.iti_img[0] === "" ||
                  isHtmlContentEmpty(state.iti_short_desc) ||
                  isHtmlContentEmpty(state.iti_desc) ||
                  state.iti_duration?.length === 0 ||
                  state.iti_brochure_banner?.length === 0;

                const page2Invalid = !validateDayIntro(dayintro);
                const page3Invalid = false;
                const page4Invalid =
                  !validatePackages(packagedetails) ||
                  state.iti_inclusion?.length === 0 ||
                  state.iti_exclusion?.length === 0 ||
                  state.iti_notes?.length === 0;

                if (
                  page1Invalid ||
                  page2Invalid ||
                  page3Invalid ||
                  page4Invalid
                ) {
                  setState((prevs) => ({
                    ...prevs,
                    to_show_error: true,
                    page2_error: page2Invalid,
                    page3_error: page3Invalid,
                    page4_error: page4Invalid,
                  }));
                  return;
                }

                if (
                  state.modal_open_purpose === "add_new" ||
                  state.modal_open_purpose === "duplicate_iti"
                ) {
                  postItinerary();
                } else if (state.modal_open_purpose === "edit_iti") {
                  editItinerary();
                }
              }}
            />
          </div>
        </div>
      </DialogContent>
      {/* SEO Information Modal */}
      <CustomModal
        open={state.seo_modal_open}
        handleClose={() => {
          setState((prevs) => ({
            ...prevs,
            seo_modal_open: false,
          }));
        }}
        title="SEO Information"
        restContent={
          <div className="flex flex-col gap-6">
            {/* Radio Buttons for Index/Not Index */}
            <div className="mb-4">
              <CustomRadioButtonGroup
                label="Index Status:"
                name="seo_indexed"
                options={[
                  { value: true, label: "Index" },
                  { value: false, label: "Not Index" },
                ]}
                selectedValue={state.seo_indexed}
                onChange={(e) => {
                  setState((prevs) => ({
                    ...prevs,
                    seo_indexed:
                      e.target.value === "true" || e.target.value === true,
                  }));
                }}
              />
            </div>

            {/* SEO Title */}
            <CustomInput
              label="SEO Title"
              value={state.seo_title || ""}
              onchange={(e) => {
                setState((prevs) => ({
                  ...prevs,
                  seo_title: e.target.value,
                }));
              }}
              placeholder="Enter SEO title"
            />

            {/* SEO Description */}
            <CustomInput
              label="SEO Description"
              value={state.seo_description || ""}
              onchange={(e) => {
                setState((prevs) => ({
                  ...prevs,
                  seo_description: e.target.value,
                }));
              }}
              placeholder="Enter SEO description"
            />

            {/* SEO Keywords */}
            <CustomInput
              label="SEO Keywords"
              value={state.seo_keywords || ""}
              onchange={(e) => {
                setState((prevs) => ({
                  ...prevs,
                  seo_keywords: e.target.value,
                }));
              }}
              placeholder="Enter SEO keywords (comma separated)"
            />

            {/* SEO Author */}
            <CustomInput
              label="SEO Author"
              value={state.seo_author || "safarwanderlust"}
              onchange={(e) => {
                setState((prevs) => ({
                  ...prevs,
                  seo_author: e.target.value,
                }));
              }}
              placeholder="Enter SEO author"
            />

            {/* Save Button */}
            <div className="flex justify-center mt-4">
              <CustomButton
                content="Save SEO Information"
                btncolor={light.signinbtnbackground}
                onClick={() => {
                  setState((prevs) => ({
                    ...prevs,
                    seo_modal_open: false,
                  }));
                }}
              />
            </div>
          </div>
        }
      />
    </Dialog>
  );
}

export default AddNewItiComp;
