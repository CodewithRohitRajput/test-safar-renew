"use client"

import React, { useEffect, useState } from "react";
// import '../../index.css'
import CustomText from "../../components/CustomText";
import { light } from "@/_assets/themes/themes";
import CustomCheckboxWithLabel from "../../components/CustomCheckboxWithLabel";
import CustomButton from "../../components/CustomButton";
import AdminTopbar from "../../components/AdminTopbar";
import AddIcon from "@/_assets/svgs/logo/AddIcon"; //
import EditIcon from "@/_assets/svgs/logo/EditIcon"; //
import ThreedotIcon from "@/_assets/svgs/logo/ThreedotIcon"; //
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { get, patch, post, put, remove } from "../../constants/axiosClient";
import { useDispatch, useSelector } from "react-redux";
// import { setValue } from '../../redux/globalSlice'
import PaginationComp from "../../components/PaginationComp";
import { useRouter } from "next/navigation";
import { PAGES } from "../../constants/PagesName";
import moment from "moment";

// import { showConfirmationDialog } from '../../App'
import { localStorageHelper } from "../../helper/storageHelper";
import AddNewItiComp from "../AddNewItiComp";
import {
  ConfirmationDialog,
  showConfirmationDialog,
} from "../Dialog/ShowConfirmationDialog";
import { setValue } from "@/lib/globalSlice";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { toast, ToastContainer } from "react-toastify";

function Itinerary() {
  useAuthRedirect();
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();
  const [state, setState] = useState({
    is_modalopen: false,
    fetched_data: [],
    categories_data: [],
    categories_list: [],
    selected_itinerary: {},
    view_selected_itinerary: {},
    current_modal_page_count: 1,
    selected_category: [],
    iti_id: 0,
    iti_name: "",
    //iti_city: '',
    iti_img: [""],
    iti_short_desc: "",
    iti_desc: "",
    iti_altitude: "",
    iti_duration: 1,
    iti_scenary: "",
    iti_cultural_site: "",
    iti_brochure_banner: "",
    iti_inclusion: "",
    iti_inclusion_single: "",
    iti_exclusion: "",
    iti_exclusion_single: "",
    iti_notes: "",
    iti_notes_single: "",
    is_active: null,
    is_trending: null,
    modal_open_purpose: "add_new",
    to_show_error: false,
    page2_error: false,
    page3_error: false,
    page4_error: false,
    uploading: false,
    seo_modal_open: false,
    seo_indexed: true, // Default to "index"
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    seo_author: "Safarwanderlust",
  });
  const [searchInput, setSearchInput] = useState({
    title: "",
    city: "",
  });
  const [dayintro, setdayintro] = useState([]);
  const [hotelinfo, sethotelinfo] = useState([]);
  const [packagedetails, setpackagedetails] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");

  const router = useRouter();

  const notifySuccess = (msg) => {
    console.log("in notify " + msg);
    toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const fetch_itinerary = async (options = {}) => {
    const { initialLoad = true, reset = false } = options;

    if (isFetching || (!initialLoad && !hasMore && !reset)) return;

    setIsFetching(true);
    dispatch(setValue({ key: "to_show_loader", value: true }));

    try {
      const response = await get(API_ENDPOINTS.COMMON.GET_ITINERARY, {
        isAdmin: true,
        limit: 20,
        cursor: reset ? "" : initialLoad ? "" : state.next_cursor_id || "",
      });

      if (response?.message === "ITINERARIES_FETCHED" && response?.success) {
        const newItems = response.data.itineraries.filter(
          (newItem) =>
            !state.fetched_data.some(
              (existingItem) => existingItem.id === newItem.id
            )
        );

        setState((prev) => ({
          ...prev,
          fetched_data:
            reset || initialLoad
              ? response.data.itineraries
              : [...prev.fetched_data, ...newItems],
          next_cursor_id: response.data.nextCursor,
        }));

        setHasMore(
          response.data.itineraries.length > 0 && !!response.data.nextCursor
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };
  const handleSearch = async () => {
    try {
      setIsFetching(true);
      dispatch(setValue({ key: "to_show_loader", value: true }));

      const response = await get(
        API_ENDPOINTS.COMMON.SEARCH_ITINERARIES_BY_NAME_CITY,
        {
          title: searchInput.title,
          city: searchInput.city,
        }
      );

      if (response?.success && response?.data?.length > 0) {
        setState((prev) => ({
          ...prev,
          fetched_data: response.data,
        }));
        setHasMore(false); // disable infinite scroll for search
      } else {
        setState((prev) => ({ ...prev, fetched_data: [] }));
        setHasMore(false);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsFetching(false);
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await get(API_ENDPOINTS.COMMON.SUGGEST_ITINERARIES, {
        query: query,
      });

      if (response?.success) {
        setSuggestions(response.data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await get(API_ENDPOINTS.locations.list);
      if (res?.success && res?.message === "LOCATION_LIST") {
        const items = (res?.data?.items || []).map((l) => ({
          id: l.id,
          name: l.name,
        }));
        setLocations(items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetSingleEditorFields = () => {
    setState((prevs) => ({
      ...prevs,
      iti_notes_single: "",
      iti_inclusion_single: "",
      iti_exclusion_single: "",
    }));
  };

  const fetch_Itinerary_By_Id = async (id = 0, modal_purpose = "view_page") => {
    resetSingleEditorFields();
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await get(API_ENDPOINTS.COMMON.GET_ITINERARY + `/${id}`).then((d) => {
        if (d?.message == "ITINERARY_FOUND" && d?.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));

          // Convert arrays to strings for single editors
          const inclusionString = Array.isArray(
            d?.data?.inclusions_exclusions?.inclusions
          )
            ? d?.data?.inclusions_exclusions?.inclusions
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
                .join(". ")
            : "";
          const exclusionString = Array.isArray(
            d?.data?.inclusions_exclusions?.exclusions
          )
            ? d?.data?.inclusions_exclusions?.exclusions
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
                .join(". ")
            : "";
          const notesString = Array.isArray(d?.data?.notes)
            ? d?.data?.notes
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
                .join(". ")
            : "";
          setState((prevs) => ({
            ...prevs,
            current_modal_page_count: 1,
            modal_open_purpose: modal_purpose,
            iti_name: d?.data?.title,
            iti_desc: d?.data?.description,
            iti_short_desc: d?.data?.shortDescription,
            //iti_city: d?.data?.city,
            iti_img: d?.data?.view_images,
            iti_duration: d?.data?.duration,
            iti_altitude: d?.data?.altitude,
            iti_scenary: d?.data?.scenery,
            iti_cultural_site: d?.data?.cultural_sites,
            iti_brochure_banner: d?.data?.itin_pdf,
            iti_notes: d?.data?.notes,
            iti_notes_single: notesString,
            selected_category: d?.data?.categoryId,
            iti_exclusion: d?.data?.inclusions_exclusions?.exclusions,
            iti_exclusion_single: exclusionString,
            iti_inclusion: d?.data?.inclusions_exclusions?.inclusions,
            iti_inclusion_single: inclusionString,
            original_is_active: d?.data?.is_active,
            is_modalopen: !prevs.is_modalopen,
            seo_modal_open: false,
            seo_indexed: d?.data?.seo_indexed ?? true,
            seo_title: d?.data?.seo_title || "",
            seo_description: d?.data?.seo_description || "",
            seo_keywords: d?.data?.seo_keywords || "",
            seo_author: d?.data?.seo_author || "Safarwanderlust",
          }));
          setdayintro(d?.data?.day_details);
          sethotelinfo(d?.data?.hotels);
          setpackagedetails((prevs) => ({
            ...prevs,
            base_packages: d?.data?.base_packages,
            pickup_point: d?.data?.pickup_point,
            drop_point: d?.data?.drop_point,
            batches: d?.data?.batches,
          }));
          if (modal_purpose == "edit_iti") {
            setState((prevs) => ({ ...prevs, iti_id: id }));
          }

          // Set selected location for editing
          if (d?.data?.locations && d?.data?.locations.length > 0) {
            setSelectedLocationId(d?.data?.locations[0].location.id);
          } else {
            setSelectedLocationId("");
          }
          // console.log('logging data', d)
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

  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;

      isScrolling = true;

      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !isFetching &&
        hasMore
      ) {
        fetch_itinerary({ initialLoad: false });
      }

      setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.next_cursor_id, hasMore, isFetching]);

  useEffect(() => {
    fetch_itinerary();
    fetchLocations();
  }, []);

  const handleToggleChange = async ({ id }) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await patch(API_ENDPOINTS.ADMIN.TOGGLE_ITINERARY_ACTIVE + "/" + id).then(
        (d) => {
          if (d?.message == "ITINERARIES_UPDATED" && d?.success == true) {
            dispatch(setValue({ key: "to_show_loader", value: false }));
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
              dispatch(
                setValue({
                  key: "alert_content",
                  value: "Itineraries Updated Successfully",
                })
              );
            fetch_itinerary(state.fetched_data[0]?.id);
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

  const handleNewItineraryAdded = async (newItinerary) => {
    setState((prev) => ({
      ...prev,
      fetched_data: [newItinerary, ...prev.fetched_data],
      is_modalopen: false,
    }));

    await fetch_itinerary({ reset: true });

    notifySuccess("Itinerary added successfully!");
  };

  const handleiIsTrendingChange = async ({ id, is_trend }) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await patch(
        API_ENDPOINTS.ADMIN.UPDATE_IS_TRENDING_STATUS +
          `?id=${id}&is_trending=${is_trend}`
      ).then((d) => {
        if (d?.message == "TRENDING_ITIN_UPDATED" && d?.success == true) {
          notifySuccess("Itinerary Updated");
          dispatch(setValue({ key: "to_show_loader", value: false }));
          dispatch(
            setValue({
              key: "to_show_alert",
              value: true,
            })
          ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Itineraries Trending Status Changed Successfully",
              })
            );
          fetch_itinerary(state.fetched_data[0]?.id);
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

  const handleAddNewItinerary = () => {
    fetchLocations();
    setState((prevs) => ({
      ...prevs,
      current_modal_page_count: 1,
      is_modalopen: !prevs.is_modalopen,
      iti_name: "",
      iti_desc: "",
      iti_short_desc: "",
      //iti_city: '',
      iti_img: [""],
      iti_duration: 1,
      iti_altitude: "",
      iti_scenary: "",
      iti_cultural_site: "",
      iti_brochure_banner: "",
      iti_notes: "",
      iti_notes_single: "",
      categoryId: [],
      iti_inclusion: "",
      iti_inclusion_single: "",
      iti_exclusion: "",
      iti_exclusion_single: "",
      iti_id: 0,
      modal_open_purpose: "add_new",
      seo_modal_open: false,
      seo_indexed: true,
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      seo_author: "Safarwanderlust",
    }));
    setdayintro([]);
    sethotelinfo([]);
    setpackagedetails([]);
    setSelectedLocationId("");
  };
  const delete_Iti = async ({ id }) => {
    // const isConfirmed = await showConfirmationDialog(dispatch)
    const isConfirmed = await ConfirmationDialog();
    if (isConfirmed) {
      dispatch(setValue({ key: "to_show_loader", value: true }));
      try {
        await remove(API_ENDPOINTS.ADMIN.POST_NEW_ITINERARY + `/${id}`).then(
          (d) => {
            if (d.message == "ITINERARY_DELETED" && d.success == true) {
              notifySuccess("Itinerary Deleted");
              dispatch(
                setValue({
                  key: "to_show_loader",
                  value: false,
                }),
                dispatch(
                  setValue({
                    key: "to_show_alert",
                    value: true,
                  })
                ),
                dispatch(
                  setValue({
                    key: "alert_content",
                    value: "Itinerary Deleted",
                  })
                ),
                fetch_itinerary(state.fetched_data[0]?.id)
              );
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
    }
  };

  return (
    <div className=" flex h-screen w-full  bg-white ">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="ml-0 w-full animate-fadeIn rounded-2xl bg-white p-16 sm:ml-60 ">
        <AdminTopbar topbar_title={"Itinerary"} />
        <div className="mt-10 flex flex-wrap justify-between">
          <CustomText
            secondaryfontweight
            fontsize="16px"
            content={"List of Itinerary"}
            className="text-black"
          />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="relative w-[300px]">
              <input
                type="text"
                placeholder="Search Title or City"
                value={searchInput.title}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput((prev) => ({ ...prev, title: value }));
                  fetchSuggestions(value);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setShowSuggestions(false);
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none"
              />

              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={handleSearch}
              >
                🔍
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-52 overflow-y-auto text-sm">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchInput({
                          ...searchInput,
                          title: suggestion.title,
                        });
                        setShowSuggestions(false);
                        handleSearch();
                      }}
                    >
                      {suggestion.title} — {suggestion.city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <CustomButton
              logo_path={
                <div className="mr-2">
                  <AddIcon />
                </div>
              }
              content="Add New Itinerary"
              btncolor={light.signinbtnbackground}
              className="custom-fixed-width-btn"
              onClick={handleAddNewItinerary}
            />
          </div>
        </div>
        <div className="mt-3 ">
          <table className="min-w-full border-collapse text-center  ">
            <thead className="rounded-full bg-inputbg p-5">
              <tr>
                <th className="rounded-l-lg px-4 py-2">
                  <CustomText
                    content={"Sr No."}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-start">
                  <CustomText
                    content={"Itinerary"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-start">
                  <CustomText
                    content={"Travel Location"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-start">
                  <CustomText
                    content={"Price Onwards"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2">
                  <CustomText
                    content={"Trending"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2">
                  <CustomText
                    content={"Status"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2"></th>
                <th className="rounded-r-lg px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="w-auto">
              {state.fetched_data?.length > 0 ? (
                state.fetched_data?.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="px-4 py-2">
                        <CustomText
                          content={index + 1 + "." || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-start">
                        <CustomText
                          content={item?.title || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-start">
                        <CustomText
                          content={
                            item?.locations?.[0]?.location?.name ||
                            item?.city ||
                            "NA"
                          }
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-start">
                        <CustomText
                          content={
                            item?.startin_price != null
                              ? `₹${item.startin_price.toLocaleString(
                                  "en-IN"
                                )}/-`
                              : "NA"
                          }
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="mx-auto w-2 px-10 py-2">
                        <CustomCheckboxWithLabel
                          content={""}
                          defaultchecked={item?.is_trending || false}
                          checked_color="#3E4947"
                          onChange={(e) => {
                            setState((prevs) => ({
                              ...prevs,
                              selected_itinerary: item,
                            })),
                              handleiIsTrendingChange({
                                id: item?.id,
                                is_trend: !item.is_trending,
                              });
                          }}
                          // disabled={true}
                        />
                      </td>
                      <td>
                        <div
                          className={`${
                            (item?.is_active || false) == true
                              ? "bg-btnactivecolor"
                              : "bg-btninactivecolor"
                          } mx-2 rounded-2xl`}
                        >
                          <CustomText
                            content={
                              (item?.is_active || false) == true
                                ? "Active"
                                : "Inactive"
                            }
                            fontsize="13px"
                            secondaryfontweight
                            className="select-none py-[6px] text-white"
                          />
                        </div>
                      </td>
                      <td className="mx-auto w-2 px-4 py-2">
                        <CustomButton
                          className="ml-3"
                          logo_path={<EditIcon />}
                          content={""}
                          onClick={() =>
                            fetch_Itinerary_By_Id(item?.id, "edit_iti")
                          }
                        />
                      </td>
                      <td className="group relative mx-auto w-2 px-4 py-2">
                        <CustomButton
                          logo_path={<ThreedotIcon />}
                          content={""}
                        />
                        <div className="shadow-[rgba(0, 0, 0.25)] absolute right-10 top-10 z-20 hidden rounded-lg bg-white p-5 px-6 text-start shadow-2xl group-hover:block">
                          <div
                            onClick={() => {
                              fetch_Itinerary_By_Id(item?.id);
                            }}
                            className="mb-2 cursor-pointer select-none transition-transform duration-75 active:scale-95"
                          >
                            View Page
                          </div>
                          <div
                            onClick={() => {
                              fetch_Itinerary_By_Id(item?.id, "duplicate_iti");
                            }}
                            className="mb-2 cursor-pointer select-none transition-transform duration-75 active:scale-95"
                          >
                            Duplicate Itinerary
                          </div>
                          <div
                            onClick={() => handleToggleChange({ id: item?.id })}
                            className="mb-2 cursor-pointer select-none transition-transform duration-75 active:scale-95"
                          >
                            {(item?.is_active || false) == true
                              ? "Inactive"
                              : "Active"}
                          </div>
                          <div
                            onClick={() => delete_Iti({ id: item?.id })}
                            className="cursor-pointer select-none text-deletetextcolor transition-transform duration-75 active:scale-95"
                          >
                            Delete
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="100%" className="p-0">
                        <hr className="my-1 w-full bg-bordercolor" />
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Commeted by Yuvraj  */}
          {/* <div className="flex justify-end ">
            <PaginationComp
              total_pages={state.total_pages}
              current_page={state.current_page}
              prevonClick={() => {
                if (
                  state.current_page - 1 != 0 &&
                  state.prev_cursor_id?.length > 0
                ) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page - 1
                  }))
                  fetch_itinerary(state.prev_cursor_id)
                }
              }}
              onClick={(e) => {
                if (
                  state.current_page != e &&
                  state.next_cursor_id?.length > 0 &&
                  state.current_page + 1 == e
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }))
                  fetch_itinerary(state.next_cursor_id)
                } else if (
                  state.current_page != e &&
                  state.prev_cursor_id?.length > 0 &&
                  state.current_page - 1 == e
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }))
                  fetch_itinerary(state.prev_cursor_id)
                }
              }}
              nextonClick={() => {
                if (
                  state.current_page + 1 <= state.total_pages &&
                  state.next_cursor_id?.length > 0
                ) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page + 1
                  }))
                  fetch_itinerary(state.next_cursor_id)
                }
              }}
            />
          </div> */}
        </div>
        <AddNewItiComp
          state={state}
          setState={setState}
          dayintro={dayintro}
          setdayintro={setdayintro}
          hotelinfo={hotelinfo}
          sethotelinfo={sethotelinfo}
          packagedetails={packagedetails}
          setpackagedetails={setpackagedetails}
          onSuccess={handleNewItineraryAdded}
          locations={locations}
          selectedLocationId={selectedLocationId}
          setSelectedLocationId={setSelectedLocationId}
        />
      </div>
    </div>
  );
}

export default Itinerary;