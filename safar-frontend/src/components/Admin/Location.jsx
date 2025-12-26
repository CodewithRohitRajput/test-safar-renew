"use client";

import CustomText from "../../components/CustomText";
import AdminTopbar from "../../components/AdminTopbar";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import AddIcon from "@/_assets/svgs/logo/AddIcon";
import { light } from "@/_assets/themes/themes";
import CustomModal from "../../components/CustomModal";
import { Box, List, ListItem } from "@mui/material";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { get, post, put, remove } from "../../constants/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "@/lib/globalSlice";
import CustomInput from "../../components/CustomInput";
import CustomAccordion from "../../components/CustomAccordion";
import { useRouter } from "next/navigation";
import { SlCalender } from "react-icons/sl";
import { FiMapPin } from "react-icons/fi";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { localStorageHelper } from "../../helper/storageHelper";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import CustomInputFile from "../../components/CustomInputFile";
import CustomRadioButtonGroup from "../../components/CustomRadioButtonGroup";

function Location() {
  const [state, setState] = useState({
    is_modalopen: false,
    fetched_data: [],
    total_itineraries: [],
    added_itineraries: [],
    selected_location: {},
    to_which_modal_content: "view_loc",
    loc_id: "",
    loc_name: "",
    loc_short_desc: "",
    loc_desc: "",
    route_map: "",
    is_home: false,
    is_nav: false,
    index: 0,
    banner_img: null,
    feat_img: null,
    to_show_error: false,
    updated_data: [],
    seo_modal_open: false,
    seo_indexed: true,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_author: "Safarwanderlust",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const fetch_All_Locations = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const d = await get(API_ENDPOINTS.locations.list);
      if (d?.message === "LOCATION_LIST" && d?.success) {
        const items = (d?.data?.items || []).map((loc) => ({
          ...loc,
          itineraries: Array.isArray(loc.itineraries)
            ? loc.itineraries
            : Array.isArray(loc.itinerary)
              ? loc.itinerary
              : [],
        }));

        dispatch(setValue({ key: "to_show_loader", value: false }));
        setState((prev) => ({
          ...prev,
          fetched_data: items,
        }));
      } else {
        dispatch(setValue({ key: "to_show_loader", value: false }));
      }
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      const err_response = error?.response?.data;
      if (err_response?.message === "VALIDATION_INVALID_TOKEN") {
        localStorageHelper.removeItem("login_data");
      }
    }
  };

  const fetch_itinerary = async (total_count = null, hasFetchedAll = false) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const params =
        total_count != null
          ? { isAdmin: true, limit: total_count }
          : { isAdmin: true };
      const d = await get(API_ENDPOINTS.COMMON.GET_ITINERARY, params);
      if (d?.message === "ITINERARIES_FETCHED" && d?.success === true) {
        dispatch(setValue({ key: "to_show_loader", value: false }));
        setState((prevs) => ({
          ...prevs,
          total_itineraries: d?.data?.itineraries || [],
        }));
        if (!hasFetchedAll) {
          setTimeout(() => fetch_itinerary(d?.data?.totalCount, true), 0);
        }
      } else {
        dispatch(setValue({ key: "to_show_loader", value: false }));
      }
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      const err_response = error?.response?.data;
      if (err_response?.message === "VALIDATION_INVALID_TOKEN") {
        localStorageHelper.removeItem("login_data");
      }
    }
  };

  const handleAddNewLocOpen = () => {
    fetch_itinerary().then(() => {
      setState((prevs) => ({
        ...prevs,
        to_which_modal_content: "add_new_loc",
        is_modalopen: true,
        loc_id: "",
        loc_name: "",
        loc_desc: "",
        loc_short_desc: "",
        route_map: "",
        is_home: false,
        is_nav: false,
        index: 0,
        feat_img: null,
        banner_img: null,
        added_itineraries: [],
        to_show_error: false,
        seo_modal_open: false,
        seo_indexed: true,
        seo_title: "",
        seo_description: "",
        seo_keywords: "",
        seo_author: "Safarwanderlust",
      }));
    });
  };

  const update_Location_Order = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const data_to_send = { locations: state.updated_data };
      if (state.updated_data?.length == 0) {
        dispatch(setValue({ key: "to_show_alert", value: true }));
        dispatch(
          setValue({
            key: "alert_content",
            value: "Please change the order first!",
          })
        );
        dispatch(setValue({ key: "alert_type", value: "warning" }));
        dispatch(setValue({ key: "to_show_loader", value: false }));
        return;
      }
      const d = await put("/admin/locations-order", data_to_send);
      if (d?.message === "LOCATION_ORDER_UPDATED" && d?.success) {
        dispatch(setValue({ key: "to_show_loader", value: false }));
        dispatch(setValue({ key: "alert_type", value: "success" }));
        dispatch(setValue({ key: "to_show_alert", value: true }));
        dispatch(
          setValue({
            key: "alert_content",
            value: "Location Order Updated Successfully",
          })
        );
        fetch_All_Locations();
      } else {
        dispatch(setValue({ key: "to_show_loader", value: false }));
      }
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const handleEditModalOpen = ({ item }) => {
    fetch_itinerary().then(() => {
      setState((prevs) => ({
        ...prevs,
        loc_id: item?.id || "",
        to_which_modal_content: "edit_loc",
        is_modalopen: true,
        loc_name: item?.name || "",
        loc_desc: item?.description || "",
        loc_short_desc: item?.short_description || "",
        route_map: item?.route_map || "",
        is_home: !!item?.is_home,
        is_nav: !!item?.is_nav,
        index: item?.index ?? 0,
        feat_img: item?.image || null,
        banner_img: item?.banner_image || null,
        added_itineraries: (item?.itineraries || []).slice(),
        seo_modal_open: false,
        seo_indexed: item?.seo_indexed !== false,
        seo_title: item?.seo_title || "",
        seo_description: item?.seo_description || "",
        seo_keywords: item?.seo_keywords || "",
        seo_author: item?.seo_author || "Safarwanderlust",
      }));
    });
  };

  const validateForm = () => {
    if (
      state.loc_name?.length == 0 ||
      state.loc_desc?.length == 0 ||
      state.loc_short_desc?.length == 0 ||
      state.feat_img == null
    ) {
      setState((prevs) => ({ ...prevs, to_show_error: true }));
      return false;
    }
    return true;
  };

  const buildPayload = () => {
    return {
      name: state.loc_name,
      description: state.loc_desc,
      short_description: state.loc_short_desc,
      is_home: state.is_home,
      is_nav: state.is_nav,
      index: Number(state.index) || 0,
      image: state.feat_img,
      banner_image: state.banner_img,
      route_map: state.route_map,
      itineraryIds:
        state.added_itineraries?.length > 0
          ? state.added_itineraries.map((it) => it?.id || it)
          : [],
      seo_indexed: state.seo_indexed,
      seo_title: state.seo_title || null,
      seo_description: state.seo_description || null,
      seo_keywords: state.seo_keywords || null,
      seo_author: state.seo_author || "Safarwanderlust",

    };
  };

  const post_New_Location = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      if (!validateForm()) {
        dispatch(setValue({ key: "to_show_loader", value: false }));
        return;
      }
      const payload = buildPayload();
      const d = await post(API_ENDPOINTS.locations.create, payload);
      if (d?.message === "LOCATION_CREATED" && d?.success) {
        const newId = d?.data?.id;
        if (newId && payload.itineraryIds?.length) {
          await put(API_ENDPOINTS.locations.setItineraries(newId), {
            itineraryIds: payload.itineraryIds,
          });
        }
        dispatch(setValue({ key: "to_show_loader", value: false }));
        dispatch(setValue({ key: "to_show_alert", value: true }));
        dispatch(
          setValue({
            key: "alert_content",
            value: "Location Added Successfully",
          })
        );
        setState((p) => ({ ...p, is_modalopen: false }));
        fetch_All_Locations();
      } else {
        dispatch(setValue({ key: "to_show_loader", value: false }));
      }
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const edit_Location = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      if (!validateForm()) {
        dispatch(setValue({ key: "to_show_loader", value: false }));
        return;
      }
      if (!state.loc_id) {
        dispatch(setValue({ key: "to_show_loader", value: false }));
        return;
      }
      const payload = buildPayload();
      const { itineraryIds = [], ...data } = payload; // REMOVE itineraryIds from update call
      const d = await put(API_ENDPOINTS.locations.update(state.loc_id), data);
      if (d?.message === "LOCATION_UPDATED" && d?.success) {
        // Always sync itineraries (even empty array to clear)
        await put(API_ENDPOINTS.locations.setItineraries(state.loc_id), {
          itineraryIds,
        });
        dispatch(setValue({ key: "to_show_loader", value: false }));
        setState((prevs) => ({ ...prevs, is_modalopen: false }));
        dispatch(setValue({ key: "to_show_alert", value: true }));
        dispatch(
          setValue({
            key: "alert_content",
            value: "Location Updated Successfully",
          })
        );
        fetch_All_Locations();
      } else {
        dispatch(setValue({ key: "to_show_loader", value: false }));
      }
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const delete_Location = async ({ id }) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const d = await remove(API_ENDPOINTS.locations.destroy(id));
      if (d?.message === "LOCATION_DELETED" && d?.success) {
        dispatch(setValue({ key: "to_show_loader", value: false }));
        dispatch(setValue({ key: "to_show_alert", value: true }));
        dispatch(setValue({ key: "alert_content", value: "Location Deleted" }));
        fetch_All_Locations();
      } else {
        dispatch(setValue({ key: "to_show_loader", value: false }));
      }
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const handleDragEndForAddedItineraries = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const items = Array.from(state.added_itineraries);
    const [movedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedItem);
    setState((prev) => ({ ...prev, added_itineraries: items }));
  };

  // Optional: Client-side reorder list; to persist, you'd add an update-order endpoint similar to categories.
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reordered = [...state.fetched_data];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    const locIdsWithIndex = reordered.map((item, idx) => ({
      id: item.id,
      index: idx,
    }));
    setState((prevs) => ({
      ...prevs,
      fetched_data: reordered,
      updated_data: locIdsWithIndex,
    }));
  };

  useEffect(() => {
    fetch_All_Locations();
  }, []);

  return (
    <div className=" h-screen w-full flex  bg-white">
      <div className="w-full bg-white p-16 rounded-2xl animate-fadeIn ml-0 sm:ml-60 ">
        <AdminTopbar topbar_title={"Location"} />
        <div className="flex flex-wrap justify-between mt-10">
          <CustomText
            secondaryfontweight
            fontsize="16px"
            content={"List of Locations"}
            className="text-black"
          />
          <div className="flex gap-4">
            <div className="  ">
              <CustomButton
                content={"Update Location List"}
                btncolor={light.signinbtnbackground}
                onClick={() => update_Location_Order()}
              />
            </div>
            <div className=" justify-center items-center">
              <CustomButton
                logo_path={
                  <div className="mr-3">
                    <AddIcon />
                  </div>
                }
                content={"Add New Location"}
                btncolor={light.signinbtnbackground}
                onClick={() => handleAddNewLocOpen()}
              />
            </div>
          </div>
        </div>

        <div className=" mt-3">
          <table className="min-w-full border-collapse text-center  ">
            <thead className="bg-inputbg rounded-full p-5">
              <tr className="grid grid-cols-5 gap-4">
                <th className="rounded-l-lg px-4 py-2 pl-16 text-start ">
                  <CustomText
                    content={"Location Name"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className="px-4 py-2 text-center">
                  <CustomText
                    content={"No. of Itineraries"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className="px-4 py-2 text-center">
                  <CustomText
                    content={"Index"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className="px-4 py-2 text-center"></th>
                <th className="rounded-r-lg px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="w-auto">
              {state.fetched_data?.length > 0 ? (
                <Box>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="locationList">
                      {(provided) => (
                        <List
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {state.fetched_data.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={`${item.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{
                                    flexDirection: "column",
                                    mb: 1,
                                    border: "1px solid #ccc",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                    userSelect: "none",
                                  }}
                                >
                                  <React.Fragment key={item?.id || index}>
                                    <tr>
                                      <td colSpan="100%" className="">
                                        <CustomAccordion
                                          item={item}
                                          index={index}
                                          state={state}
                                          setState={setState}
                                          handleEditModalOpen={({ item }) =>
                                            handleEditModalOpen({ item })
                                          }
                                          delete_Cat={({ id }) =>
                                            delete_Location({ id })
                                          }
                                          viewText="View Location"
                                          itinerariesKey="itineraries"
                                          onViewClick={(loc) =>
                                            handleEditModalOpen({ item: loc })
                                          }
                                          content={
                                            <div>
                                              {(item?.itineraries || []).map(
                                                (it, idx) => (
                                                  <div
                                                    key={idx}
                                                    className="grid grid-cols-5 gap-4"
                                                  >
                                                    <div className="px-4 py-2 text-center w-full">
                                                      <CustomText
                                                        content={`${idx + 1}. ${
                                                          it?.title || "NA"
                                                        }`}
                                                        fontsize="13px"
                                                        secondaryfontweight
                                                      />
                                                    </div>
                                                    <div className="px-4 py-2 text-center w-full">
                                                      <CustomText
                                                        content="-"
                                                        fontsize="13px"
                                                        secondaryfontweight
                                                      />
                                                    </div>
                                                    <div className="px-4 py-2 text-center w-full">
                                                      <div
                                                        className={`${
                                                          it?.is_active
                                                            ? "bg-btnactivecolor"
                                                            : "bg-btninactivecolor"
                                                        } rounded-2xl mx-[2.74rem] p-[3.5px]`}
                                                      >
                                                        <CustomText
                                                          content={
                                                            it?.is_active
                                                              ? "Active"
                                                              : "Inactive"
                                                          }
                                                          fontsize="13px"
                                                          secondaryfontweight
                                                          className="text-white"
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          }
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="100%" className="p-0">
                                        <hr className="w-full my-1 bg-bordercolor" />
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Box>
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <CustomModal
          open={state.is_modalopen}
          handleClose={() =>
            setState((prevs) => ({ ...prevs, is_modalopen: false }))
          }
          modalSize="large" 
          title={
            state.to_which_modal_content == "add_new_loc" ? (
              <span>
                <strong>Add new </strong>
                Location
              </span>
            ) : state.to_which_modal_content == "view_loc" ? (
              <span></span>
            ) : (
              <span>
                Editing this<strong>{" " + state.loc_name} </strong>
              </span>
            )
          }
          description={
            state.to_which_modal_content == "add_new_loc"
              ? "Create a new location by filling out details including descriptions and itineraries."
              : ""
          }
          restContent={
            state.to_which_modal_content == "view_loc" ? (
              <div />
            ) : (
              <div>
                <div className="flex mt-4 w-full gap-4">
                  <div className="w-full">
                    <CustomInput
                      top_title="Location Name"
                      backgroundColor="white"
                      content="Enter location name"
                      value={state.loc_name}
                      onchange={(e) =>
                        setState((prevs) => ({
                          ...prevs,
                          loc_name: e.target.value,
                        }))
                      }
                      error_text={
                        state.to_show_error &&
                        state.loc_name?.length == 0 &&
                        "Enter the name to continue"
                      }
                    />
                  </div>
                  <div className="w-full">
                    <CustomInput
                      top_title="Short Description"
                      backgroundColor="white"
                      content="Enter short description"
                      value={state.loc_short_desc}
                      onchange={(e) =>
                        setState((prevs) => ({
                          ...prevs,
                          loc_short_desc: e.target.value,
                        }))
                      }
                      error_text={
                        state.to_show_error &&
                        state.loc_short_desc?.length == 0 &&
                        "Enter the short description to continue"
                      }
                    />
                  </div>
                </div>

                <div className="w-full mt-4">
                  <CustomInput
                    top_title="Long Description"
                    backgroundColor="white"
                    content="Enter long description"
                    value={state.loc_desc}
                    onchange={(e) =>
                      setState((prevs) => ({
                        ...prevs,
                        loc_desc: e.target.value,
                      }))
                    }
                    error_text={
                      state.to_show_error &&
                      state.loc_desc?.length == 0 &&
                      "Enter the description to continue"
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <div className="">
                    <CustomInputFile
                      btncontent="Browse..."
                      second_title_btn="Or drop Feature Image here"
                      top_title_content="Feature Image : "
                      className={"mt-4"}
                      no_right_margin={true}
                      small_btn={true}
                      state={state.feat_img}
                      inputId="loc_featimg_input"
                      setstate={(feat) =>
                        setState((prevs) => ({ ...prevs, feat_img: feat }))
                      }
                    />
                    {state.to_show_error && state.feat_img == null && (
                      <div className="flex justify-start my-2">
                        <CustomText
                          content={"Please upload the image to continue"}
                          className="text-red-500"
                          fontsize="12px"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <CustomInputFile
                      btncontent="Browse..."
                      second_title_btn="Or drop Banner Image here"
                      top_title_content="Banner Image :  "
                      className={"mt-4"}
                      no_right_margin={true}
                      small_btn={true}
                      state={state.banner_img}
                      inputId="loc_bannerimg_input"
                      setstate={(banner) =>
                        setState((prevs) => ({ ...prevs, banner_img: banner }))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <div className="w-full">
                    <CustomInput
                      top_title="Route Map (slug)"
                      backgroundColor="white"
                      content="auto or custom route slug"
                      value={state.route_map}
                      onchange={(e) =>
                        setState((prevs) => ({
                          ...prevs,
                          route_map: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="w-full">
                    <CustomInput
                      top_title="Index"
                      backgroundColor="white"
                      content="ordering index"
                      value={state.index}
                      onchange={(e) =>
                        setState((prevs) => ({
                          ...prevs,
                          index: e.target.value.replace(/[^\d]/g, ""),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-center ">
                  {state?.total_itineraries?.length > 0 && (
                    <div className="mt-4 ml-2">
                      <div className="text-start">
                        <CustomText
                          content={"Total Itineraries"}
                          primaryfontweight
                          fontsize="12px"
                        />
                      </div>
                      <div className="border-2 border-[rgba(110, 118, 132, 0.33)] p-2 rounded-md mt-4 max-h-[300px] overflow-y-scroll">
                        {(state?.total_itineraries || [])?.map(
                          (item, index) => (
                            <div
                              className=" group mb-2 flex items-center gap-2 rounded-md w-full"
                              key={item.id}
                            >
                              <div
                                className="relative flex w-full rounded-md group-hover:bg-gradient-to-r group-hover:from-[#FCFCFC] group-hover:to-[#00B69B]  border-2 border-[rgba(110, 118, 132, 0.33)] p-2 "
                                onClick={() => {
                                  const exists = state?.added_itineraries.some(
                                    (ad_item) =>
                                      (ad_item.id || ad_item) == item.id
                                  );
                                  if (!exists) {
                                    setState((prevs) => ({
                                      ...prevs,
                                      added_itineraries: [
                                        ...prevs.added_itineraries,
                                        item,
                                      ],
                                    }));
                                  }
                                }}
                              >
                                <div
                                  style={{
                                    height: "25px",
                                    minWidth: "25px",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                    backgroundColor: item?.is_active
                                      ? "#4DFF5F"
                                      : "#FF4D4D",
                                  }}
                                />
                                <CustomText
                                  content={item?.title}
                                  fontsize="10.91px"
                                />
                                <div className="flex justify-center items-center">
                                  <SlCalender
                                    size={15}
                                    color="black"
                                    className="mr-2 ml-4"
                                  />
                                  <CustomText
                                    content={`${item?.duration} Days & ${
                                      item?.duration - 1
                                    }  Nights`}
                                    fontsize="10.91px"
                                  />
                                </div>
                                <div className="w-[1px] bg-[#6E7684] self-stretch mx-5" />
                                <div className="flex justify-center items-center">
                                  <FiMapPin
                                    size={10}
                                    color="black"
                                    className="mr-1"
                                  />
                                  <CustomText
                                    content={item?.city}
                                    fontsize="10.91px"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {state.added_itineraries?.length > 0 && (
                    <div className="flex items-center">
                      <CgArrowsExchangeAlt size={30} color="black" />
                    </div>
                  )}
                  {state.added_itineraries?.length > 0 && (
                    <div className="mt-4 ml-2">
                      <div className="text-start">
                        <CustomText
                          content={"Added Itineraries"}
                          primaryfontweight
                          fontsize="12px"
                        />
                      </div>
                      <div className="border-2 border-[rgba(110, 118, 132, 0.33)] p-2 rounded-md mt-4 max-h-[300px] overflow-y-scroll">
                        <DragDropContext
                          onDragEnd={handleDragEndForAddedItineraries}
                        >
                          <Droppable droppableId="added-itineraries">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="border-2 border-[rgba(110, 118, 132, 0.33)] p-2 rounded-md mt-4 max-h-[300px] overflow-y-scroll"
                              >
                                {(state?.added_itineraries || []).map(
                                  (item, index) => (
                                    <Draggable
                                      key={(item.id || item).toString()}
                                      draggableId={(item.id || item).toString()}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`group mb-2 flex items-center gap-2 rounded-md w-full ${
                                            snapshot.isDragging
                                              ? "bg-gray-100"
                                              : ""
                                          }`}
                                        >
                                          <div className="relative w-full flex rounded-md group-hover:bg-gradient-to-r group-hover:from-[#FCFCFC] group-hover:to-[#E96042] border-2 border-[rgba(110, 118, 132, 0.33)] p-2">
                                            <div
                                              onClick={() =>
                                                setState((prevs) => ({
                                                  ...prevs,
                                                  added_itineraries:
                                                    prevs.added_itineraries.filter(
                                                      (it) =>
                                                        (it?.id || it) !=
                                                        (item?.id || item)
                                                    ),
                                                }))
                                              }
                                              className="hidden absolute right-[6%] top-[34%] group-hover:flex z-10"
                                            >
                                              <CustomText
                                                content={"Remove"}
                                                className="text-white select-none cursor-pointer transition-transform transform duration-75 active:scale-95"
                                              />
                                            </div>

                                            <div
                                              style={{
                                                height: "25px",
                                                minWidth: "25px",
                                                borderRadius: "50%",
                                                backgroundColor: item?.is_active
                                                  ? "#4DFF5F"
                                                  : "#FF4D4D",
                                              }}
                                            />
                                            <CustomText
                                              content={item?.title || item}
                                              fontsize="10.91px"
                                            />
                                            <div className="flex justify-center items-center">
                                              <SlCalender
                                                size={30}
                                                color="black"
                                                className="mr-2 ml-4"
                                              />
                                              <CustomText
                                                content={`${
                                                  item?.duration || "-"
                                                } Days & ${
                                                  item?.duration
                                                    ? item.duration - 1
                                                    : "-"
                                                } Nights`}
                                                fontsize="10.91px"
                                              />
                                            </div>
                                            <div className="w-[1px] bg-[#6E7684] self-stretch mx-5" />
                                            <div className="flex justify-center items-center">
                                              <FiMapPin
                                                size={10}
                                                color="black"
                                                className="mr-1"
                                              />
                                              <CustomText
                                                content={item?.city || "-"}
                                                fontsize="10.91px"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </div>
                  )}
                </div>
                {/* SEO Information Button */}
                <div className="mx-44 mt-6">
                  <CustomButton
                    content="SEO INFORMATION"
                    btncolor={light.signinbtnbackground}
                    pill_rounded
                    md_round={false}
                    onClick={() =>
                      setState((prevs) => ({
                        ...prevs,
                        seo_modal_open: true,
                      }))
                    }
                  />
                </div>

                <div className="mx-44 mt-6">
                  <CustomButton
                    content={
                      state.to_which_modal_content == "add_new_loc"
                        ? "Finish"
                        : "Finish Editing"
                    }
                    btncolor={light.signinbtnbackground}
                    pill_rounded
                    md_round={false}
                    onClick={() =>
                      state.to_which_modal_content == "add_new_loc"
                        ? post_New_Location()
                        : edit_Location()
                    }
                  />
                </div>
              </div>
            )
          }
        />
         {/* SEO Information Modal */}
         <CustomModal
          open={state.seo_modal_open}
          onClose={() =>
            setState((prevs) => ({ ...prevs, seo_modal_open: false }))
          }
          restContent={
            <div className="p-6">
              <CustomText
                content="SEO Information"
                primaryfontweight
                fontsize="20px"
                className="mb-4"
              />

              {/* Index/Not Index Radio Buttons */}
              <div className="mb-4">
                <CustomRadioButtonGroup
                  label="Index Status:"
                  name="seo_indexed"
                  options={[
                    { label: "Index", value: true },
                    { label: "Not Index", value: false },
                  ]}
                  selectedValue={state.seo_indexed}
                  onChange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      seo_indexed: e.target.value === "true" || e.target.value === true,
                    }))
                  }
                />
              </div>

              {/* SEO Title */}
              <div className="mb-4">
                <CustomInput
                  top_title="SEO Title"
                  backgroundColor="white"
                  content="Enter SEO title"
                  value={state.seo_title}
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      seo_title: e.target.value,
                    }))
                  }
                />
              </div>

              {/* SEO Description */}
              <div className="mb-4">
                <CustomInput
                  top_title="SEO Description"
                  backgroundColor="white"
                  content="Enter SEO description"
                  value={state.seo_description}
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      seo_description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* SEO Keywords */}
              <div className="mb-4">
                <CustomInput
                  top_title="SEO Keywords"
                  backgroundColor="white"
                  content="Enter keywords (comma-separated)"
                  value={state.seo_keywords}
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      seo_keywords: e.target.value,
                    }))
                  }
                />
              </div>

              {/* SEO Author */}
              <div className="mb-4">
                <CustomInput
                  top_title="SEO Author"
                  backgroundColor="white"
                  content="Enter author name"
                  value={state.seo_author}
                  onchange={(e) =>
                    setState((prevs) => ({
                      ...prevs,
                      seo_author: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-6">
                <CustomButton
                  content="Save"
                  btncolor={light.signinbtnbackground}
                  pill_rounded
                  md_round={false}
                  onClick={() =>
                    setState((prevs) => ({ ...prevs, seo_modal_open: false }))
                  }
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Location;
