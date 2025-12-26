"use client";

import CustomText from "../../components/CustomText";
import AdminTopbar from "../../components/AdminTopbar";
import React, { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/CustomButton";
import AddIcon from "@/_assets/svgs/logo/AddIcon";
import EditIcon from "@/_assets/svgs/logo/EditIcon";
import ThreedotIcon from "@/_assets/svgs/logo/ThreedotIcon";
import { light } from "@/_assets/themes/themes";
import CustomModal from "../../components/CustomModal";
import CustomSelect from "../../components/CustomSelect";
import CustomInputFile from "../../components/CustomInputFile";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDragIndicator } from "react-icons/md";
import {
  CircularProgress,
  Pagination,
  PaginationItem,
  styled,
  Switch,
} from "@mui/material";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { get, patch, post, put, remove } from "../../constants/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import globalSlice, { setValue } from "@/lib/globalSlice";
import PaginationComp from "../../components/PaginationComp";
import CustomInput from "../../components/CustomInput";
import CustomAccordion from "../../components/CustomAccordion";
import { useRouter } from "next/navigation";
import { PAGES } from "../../constants/PagesName";
import { FaFolder } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { FiMapPin } from "react-icons/fi";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import moment from "moment";
import InfiniteInputBox from "../../components/InfiniteInputBox";
import { localStorageHelper } from "../../helper/storageHelper";
import UploadNewBannerComp from "../../components/UploadNewBannerComp";
import {
  UPLOAD_PRESET_NAME,
  CLOUD_NAME,
} from "../../constants/CloudinaryConstants";
import { showConfirmationDialog } from "../Dialog/ShowConfirmationDialog";
import useAuthRedirect from "@/hooks/useAuthRedirect";

function Content() {
  useAuthRedirect();
  const [state, setState] = useState({
    is_modalopen: false,
    fetched_data: [],
    test_iti: [
      {
        id: "66b659d7a88078708a51786d",
        title: "Explore the Himalayas",
        shortDescription: "A 7-day adventure in the Himalayas.",
        city: "Manali",
        view_images: ["https://picsum.photos/200/400"],
        itin_pdf: "https://example.com/itinerary.pdf",
        duration: 7,
        is_active: true,
        is_trending: false,
        base_packages: [{ discounted_price: 25000 }],
        startin_price: 25000,
      },
    ],
    total_itineraries: [],
    added_itineraries: [],
    next_cursor_id: 0,
    prev_cursor_id: 0,
    total_pages: 0,
    current_page: 1,
    selected_itinerary: {},
    selected_category: {},
    to_which_modal_content: "view_cat",
    terms_data: [],
    policy_data: [],
    offer_headline_status: true,
    banner_img_url: "",
    banner_title: "",
    banner_route_map: null,
    banner_category_name: null,
    banner_date: "",
    upload_modal: false,
    categories_data: [],
    categories_list: [],
    itinerary_list: [],
    selected_itinerary: 0,
    to_show_offer_headline: false,
    to_show_terms_modal: false,
    to_show_cancellation_modal: false,
    offer_headline: [],
    activeBannersCount: 0,
    expiredBannersCount: 0,
    total_clicks: 0,
    banner_data: [],
    gallery_photos: [],
    all_cat: [],
    featured_iti: [],
    featured_cat: [],
    explore_cat: [],
    active_iti: [],
    selected_featured_cat: [],
    selected_featured_iti: [],
    selected_explored_cat: [],
    selected_active_iti: [],
    to_show_pic: false,
    pic_index: null,
    pic_src: null,
    selected_img: null,
    selected_img_preview: null,
    uploaded_img: null,
    to_show_error: false,
    compare_error1: false,
    compare_error2: false,
    compare_error3: false,
    heroSlides: [],
    to_show_hero_modal: false,
  });
  const [offerheadlinedata, setofferheadlinedata] = useState([]);
  const [Termsandconditiondata, setTermsandcondition] = useState([]);
  const [cancellationdata, setcancellationdata] = useState([]);
  const globalState = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const router = useRouter();
  const dateref = useRef();

  // useEffect(()=> {
  //     if(localStorageHelper.getItem('login_data') == null){
  //       router.push(PAGES.LOGIN, { replace: true })
  //     }
  //   }, [])

  const fetch_All_Content_Data = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await get(API_ENDPOINTS.ADMIN.GET_CONTENTS).then((d) => {
        if (d?.message == "CONTENTS_FETCHED" && d?.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          setState((prevs) => ({
            ...prevs,
            fetched_data: d?.data?.all_categories,
            terms_data: d?.data?.contents?.terms_and_conditions,
            offer_headline: d?.data?.contents?.offer_headline?.title,
            activeBannersCount: d?.data?.activeBannersCount,
            expiredBannersCount: d?.data?.expiredBannersCount,
            total_clicks: d?.data?.totalClicksData?.total_clicks,
            banner_data: d?.data?.banners,
            gallery_photos: d?.data?.contents?.gallery,
            featured_cat: d?.data?.featured_categories,
            featured_iti: d?.data?.featured_itineraries,
            all_cat: d?.data?.all_categories,
            selected_featured_iti: [...d?.data?.featured_itineraries],
            selected_featured_cat: [...d?.data?.featured_categories],
            selected_explored_cat: [...d?.data?.explore_categories],
            explore_cat: d?.data?.explore_categories,
            active_iti: d?.data?.active_itineraries,
            policy_data: d?.data?.cancellation_policy?.policies,
          }));
          setcancellationdata(d?.data?.cancellation_policy?.policies);
          setTermsandcondition(d?.data?.contents?.terms_and_conditions);
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
        // localStorageHelper.removeItem('login_data')
        // router.push(PAGES.LOGIN, { replace: true })
        console.log("logging out");
      }
    }
  };
  // const fetch_All_Categories = async (next_cursor = 0) => {
  //   dispatch(setValue({ key: 'to_show_loader', value: true }))
  //   try {
  //     const api_update =
  //       next_cursor?.length > 0
  //         ? API_ENDPOINTS.COMMON.GET_ALL_CATEGORIES +
  //           `?cursor=${next_cursor}&isAdmin=true`
  //         : API_ENDPOINTS.COMMON.GET_ALL_CATEGORIES + '?isAdmin=true'
  //     await get(api_update).then((d) => {
  //       if (d?.message == 'CATEGORIES_FETCHED' && d?.success == true) {
  //         dispatch(setValue({ key: 'to_show_loader', value: false }))
  //         setState((prevs) => ({
  //           ...prevs,
  //           fetched_data: d?.data?.categories,
  //           total_pages: d?.data?.totalPages,
  //           next_cursor_id: d.data?.nextCursor,
  //           prev_cursor_id: d.data?.previousCursor
  //         }))
  //       }
  //     })
  //   } catch (error) {
  //     dispatch(setValue({ key: 'to_show_loader', value: false }))
  //     console.error(error)
  //     const err_response = error?.response?.data
  //     if (
  //       err_response.success == false &&
  //       err_response.message == 'VALIDATION_INVALID_TOKEN'
  //     ) {
  //       localStorageHelper.removeItem('login_data')
  //       router.push(PAGES.LOGIN, { replace: true })
  //     }
  //   }
  // }
  // const fetch_All_Terms = async () => {
  //   dispatch(setValue({ key: 'to_show_loader', value: true }))
  //   try {
  //     await get(API_ENDPOINTS.COMMON.GET_ALL_TERMS).then((d) => {
  //       if (d?.message == 'TERMS_FETCHED' && d?.success == true) {
  //         dispatch(setValue({ key: 'to_show_loader', value: false }))
  //         setState((prevs) => ({
  //           ...prevs,
  //           terms_data: d?.data
  //         }))
  //         setofferheadlinedata(d?.data)
  //       }
  //     })
  //   } catch (error) {
  //     dispatch(setValue({ key: 'to_show_loader', value: false }))
  //     console.error(error)
  //     const err_response = error?.response?.data
  //     if (
  //       err_response.success == false &&
  //       err_response.message == 'VALIDATION_INVALID_TOKEN'
  //     ) {
  //       localStorageHelper.removeItem('login_data')
  //       router.push(PAGES.LOGIN, { replace: true })
  //     }
  //   }
  // }
  const fetch_All_CANCELLATION_POLICY = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await get(API_ENDPOINTS.COMMON.GET_ALL_POLICY).then((d) => {
        if (
          d?.message == "CANCELLATION_POLICIES_FETCHED" &&
          d?.success == true
        ) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          setState((prevs) => ({
            ...prevs,
            policy_data: d?.data?.policies,
          }));
          setcancellationdata(d?.data?.policies);
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
  const update_Offer_Headling = async ({ passed_active_status = true }) => {
    if (state.offer_headline?.length == 0) {
      setState((prevs) => ({ ...prevs, to_show_error: true }));
      return;
    }
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const data = {
        title: state.offer_headline,
        is_active: passed_active_status,
      };
      await put(API_ENDPOINTS.ADMIN.UPDATE_OFFER_HEADLINE, data).then((d) => {
        if (d?.message == "OFFER_HEADLINE_UPDATED" && d?.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          setState((prevs) => ({
            ...prevs,
            offer_headline_status: d?.data,
            to_show_offer_headline: false,
          }));
          dispatch(
            setValue({
              key: "to_show_alert",
              value: true,
            })
          ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Offer Headline Updated Successfully",
              })
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
  const postOfferBanner = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const data = {
        itinerary_id: state.selected_itinerary?.id,
        title: state.banner_title,
        image: state.banner_img_url,
        expire_at: state.banner_date
          ? moment(state.banner_date)
              .format("YYYY-MM-DDTHH:mm:ss.SSSZ")
              .toString()
          : "",
      };
      if (
        state.selected_itinerary?.id == undefined ||
        state.selected_category?.id == undefined ||
        state.banner_title?.length == 0 ||
        state.banner_img_url?.length == 0 ||
        state.banner_date?.length == 0
      ) {
        setState((prevs) => ({ ...prevs, to_show_error: true }));
        dispatch(setValue({ key: "to_show_loader", value: false }));
        return;
      }
      await post(API_ENDPOINTS.ADMIN.POST_OFFER_BANNER, data).then((d) => {
        if (d.message == "BANNER_ADDED" && d.success == true) {
          setState((prevs) => ({ ...prevs, to_show_error: false }));
          dispatch(
            setValue({
              key: "to_show_loader",
              value: false,
            })
          ),
            setState((prevs) => ({ ...prevs, upload_modal: false })),
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Banner Added Successfully",
              })
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
  const update_Terms = async () => {
    if (Termsandconditiondata?.[0]?.length == 0) {
      setState((prevs) => ({ ...prevs, to_show_error: true }));
      return;
    }
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const data = {
        terms: Termsandconditiondata,
      };
      await put(API_ENDPOINTS.ADMIN.UPDATE_TERMS, data).then((d) => {
        if (d.message == "TERMS_UPDATED" && d.success == true) {
          setState((prevs) => ({ ...prevs, to_show_error: false }));
          dispatch(
            setValue({
              key: "to_show_loader",
              value: false,
            })
          ),
            setState((prevs) => ({ ...prevs, to_show_terms_modal: false })),
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Terms Updated Successfully",
              })
            ),
            fetch_All_Content_Data();
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
  const update_Cancellation = async () => {
    if (cancellationdata?.[0]?.length == 0) {
      setState((prevs) => ({ ...prevs, to_show_error: true }));
      return;
    }
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const data = {
        policies: cancellationdata,
      };
      await put(API_ENDPOINTS.ADMIN.UPDATE_CANCELLATION, data).then((d) => {
        if (d.message == "POLICY_UPDATED" && d.success == true) {
          setState((prevs) => ({ ...prevs, to_show_error: false }));
          dispatch(
            setValue({
              key: "to_show_loader",
              value: false,
            })
          ),
            setState((prevs) => ({
              ...prevs,
              to_show_cancellation_modal: false,
            })),
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Policy Updated Successfully",
              })
            ),
            fetch_All_Content_Data();
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
  const update_Gallery = async () => {
    if (!state.uploaded_img) {
      setState((prevs) => ({ ...prevs, to_show_error: true }));
      return;
    }
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const data = {
        image: state.uploaded_img,
        is_center: false,
      };
      console.log("loggin data to send", data);
      await put(API_ENDPOINTS.ADMIN.UPDATE_GALLERY, data).then((d) => {
        if (d.message == "GALLERY_UPDATED" && d.success == true) {
          setState((prevs) => ({
            ...prevs,
            to_show_error: false,
            uploaded_img: null,
          }));
          dispatch(
            setValue({
              key: "to_show_loader",
              value: false,
            })
          ),
            setState((prevs) => ({
              ...prevs,
              to_show_cancellation_modal: false,
              selected_img: null,
            })),
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Gallery Updated Successfully",
              })
            ),
            fetch_All_Content_Data();
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

  const delete_image_from_Gallery = async ({ id }) => {
    const isConfirmed = await showConfirmationDialog(dispatch);
    if (isConfirmed) {
      dispatch(setValue({ key: "to_show_loader", value: true }));
      try {
        await remove(
          API_ENDPOINTS.ADMIN.DELETE_IMAGE_FROM_GALLERY + `/${id}`
        ).then((d) => {
          if (d.message == "GALLERY_IMAGE_DELETED" && d.success == true) {
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
                  value: "Gallery Image Deleted",
                })
              ),
              fetch_All_Content_Data()
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
    }
  };
  const update_Hero_Iti = async () => {
    if (
      state.selected_featured_iti?.length < 3 ||
      state.selected_featured_iti?.length > 3
    ) {
      setState((prevs) => ({ ...prevs, compare_error1: true }));
      return;
    }
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const newData = state.selected_featured_iti?.map(
        (item, index) => item?.id
      );
      const data = {
        itineraries: newData,
      };
      await patch(API_ENDPOINTS.ADMIN.UPDATE_HERO_ITI, data).then((d) => {
        if (d.message == "HERO_ITIN_UPDATED" && d.success == true) {
          setState((prevs) => ({ ...prevs, compare_error1: false }));
          dispatch(
            setValue({
              key: "to_show_loader",
              value: false,
            })
          ),
            setState((prevs) => ({
              ...prevs,
              to_show_cancellation_modal: false,
            })),
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Hero Itinerary Updated Successfully",
              })
            ),
            fetch_All_Content_Data();
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
  const update_Home_Categories = async () => {
    if (state.selected_featured_cat?.length > 3) {
      setState((prevs) => ({ ...prevs, compare_error2: true }));
      return;
    }
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const newData = state.selected_featured_cat?.map(
        (item, index) => item?.id
      );
      const data = {
        categories: newData,
      };
      await patch(API_ENDPOINTS.ADMIN.UPDATE_HERO_CATEGORIES, data).then(
        (d) => {
          if (d.message == "CATEGORIES_UPDATED" && d.success == true) {
            setState((prevs) => ({ ...prevs, compare_error2: false }));
            dispatch(
              setValue({
                key: "to_show_loader",
                value: false,
              }),
              setState((prevs) => ({
                ...prevs,
                to_show_cancellation_modal: false,
              })),
              dispatch(
                setValue({
                  key: "to_show_alert",
                  value: true,
                })
              ),
              dispatch(
                setValue({
                  key: "alert_content",
                  value: "Hero Category Updated Successfully",
                })
              ),
              fetch_All_Content_Data()
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
  };
  const update_nav_Categories = async () => {
    if (
      state.selected_explored_cat?.length < 2 ||
      state.selected_explored_cat?.length > 4
    ) {
      setState((prevs) => ({ ...prevs, compare_error3: true }));
      return;
    }
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const newData = state.selected_explored_cat?.map(
        (item, index) => item?.id
      );
      const data = {
        categories: newData,
      };
      await patch(API_ENDPOINTS.ADMIN.UPDATE_NAV_CATEGORIES, data).then((d) => {
        if (d.message == "NAV_CATEGORIES_UPDATED" && d.success == true) {
          setState((prevs) => ({ ...prevs, compare_error3: false }));
          dispatch(
            setValue({
              key: "to_show_loader",
              value: false,
            })
          ),
            setState((prevs) => ({
              ...prevs,
              to_show_cancellation_modal: false,
            })),
            dispatch(
              setValue({
                key: "to_show_alert",
                value: true,
              })
            ),
            dispatch(
              setValue({
                key: "alert_content",
                value: "Nav Category Updated Successfully",
              })
            ),
            fetch_All_Content_Data();
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

  const open_Banner_Modal = () => {
    setState((prevs) => ({
      ...prevs,
      upload_modal: true,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      console.log("logging img ", file);
      setState((prevs) => ({
        ...prevs,
        selected_img: file,
        selected_img_preview: URL.createObjectURL(file),
      }));
    }
  };
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
  const convertImageType = async (imageFile, targetType = "image/webp") => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          targetType,
          1.0
        );
      };

      img.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (state.selected_img == null) return;

    const convertedImageBlob = await convertImageType(state.selected_img);
    const convertedImageFile = new File(
      [convertedImageBlob],
      state.selected_img.name,
      { type: "image/webp" }
    );

    const formData = new FormData();
    formData.append("file", convertedImageFile);
    formData.append("upload_preset", UPLOAD_PRESET_NAME);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "handleUpload - Image uploaded successfully:",
          data.secure_url
        );
        setState((prevs) => ({
          ...prevs,
          uploaded_img: data.secure_url,
        }));
      })
      .catch((error) => {
        console.error("Upload failed", error);
        setImageUploaded(false);
      });
  };
  const InputFile = () => {
    return (
      <div className="flex">
        <div
          className={` flex flex-col flex-1 justify-center items-center  rounded-md border border-dashed border-black  px-10  py-20 mt-4
            bg-[#FAFAFA]  transition-transform transform duration-75 active:scale-95`}
          onClick={() => {
            if (state.selected_img == null) {
              document.getElementById(`inputfile`).click();
            }
          }}
        >
          {state.selected_img == null ? (
            <>
              <FaFolder size={40} color="#57B0FF" />
              <label
                className="font-nunitosemiBold600 text-black"
                style={{ fontSize: "11.25px" }}
                onClick={() => {}}
              >
                {"Drag & Drop or choose file to upload"}
              </label>
              <label
                className="font-nunitoregular400 text-[#515978]  "
                style={{ fontSize: "12px" }}
                onClick={() => {}}
              >
                {"Select zip,image,pdf or ms.word"}
              </label>{" "}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center">
              {state.uploaded_img == null ? (
                <div>
                  <CustomButton
                    content={"Upload"}
                    btncolor={"black"}
                    onClick={() => handleUpload()}
                  />
                </div>
              ) : (
                <div>
                  <CustomButton
                    content={"Image Uploaded"}
                    btncolor={"black"}
                    // onClick={() => handleUpload()}
                  />
                </div>
              )}
              <img
                className="w-[65%] aspect-square rounded-md mt-4"
                src={state.selected_img_preview}
                alt="selected_img"
              />
            </div>
          )}
          <input
            id="inputfile"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  };

  const CompareCard = ({
    total_item = [],
    selected_item = [],
    add_onclick,
    remove_onclick,
    is_cat = false,
    is_explore = false,
    handleonclick = null,
    to_show_error = true,
    err_con = "",
  }) => {
    return (
      <>
        <div className="flex justify-start ">
          <div className="mt-4 ml-2">
            <div className="text-start">
              <CustomText
                content={
                  is_cat == false ? "Total Itineraries" : "Total Categories"
                }
                primaryfontweight
                fontsize="12px"
              />
            </div>
            <div className="border-2 border-[rgba(110, 118, 132, 0.33)] p-2 rounded-md mt-4 max-h-[300px] overflow-y-scroll ">
              {total_item?.length > 0 ? (
                total_item?.map((item, index) => (
                  <div
                    key={item?.id || index}
                    className=" group mb-2 flex items-center gap-2 rounded-md"
                  >
                    <div className="relative flex rounded-md group-hover:bg-gradient-to-r group-hover:from-[#FCFCFC] group-hover:to-[#00B69B]  border-2 border-[rgba(110, 118, 132, 0.33)] p-2 ">
                      <div
                        onClick={() => add_onclick(item)}
                        className="hidden absolute right-[6%] top-[34%] group-hover:flex z-10"
                      >
                        <CustomText
                          content={"Add"}
                          className="text-white select-none cursor-pointer transition-transform transform duration-75 active:scale-95"
                        />
                      </div>
                      <div
                        className={`flex  ${
                          is_cat == true
                            ? "min-w-[10rem] justify-start items-center"
                            : "justify-center items-center"
                        }`}
                      >
                        {/* {is_cat == false && ( */}
                        <div
                          style={{
                            height: "25px",
                            minWidth: "25px",
                            borderRadius: "50%",
                            marginRight: "10px",
                            backgroundColor:
                              is_cat == true
                                ? is_explore
                                  ? item?.is_nav == true
                                    ? "#4DFF5F"
                                    : "#FF4D4D"
                                  : item?.is_home == true
                                    ? "#4DFF5F"
                                    : "#FF4D4D"
                                : item?.is_active == true
                                  ? "#4DFF5F"
                                  : "#FF4D4D",
                          }}
                          className="flex justify-center items-center"
                        />
                        {/* )} */}
                        <CustomText
                          content={is_cat == false ? item?.title : item?.name}
                          fontsize="10.91px"
                          className="text-center"
                        />
                      </div>
                      {is_cat == false && (
                        <div className="flex justify-center items-center">
                          <SlCalender
                            size={12}
                            color="black"
                            className="mr-2 ml-4"
                          />
                          <CustomText
                            content={`${item?.duration} Days & ${
                              item?.duration - 1
                            }  Nights`}
                            fontsize="10.91px"
                            className="text-center"
                          />
                        </div>
                      )}
                      {is_cat == false && (
                        <div className="w-[1px] bg-[#6E7684] self-stretch mx-4 my-1" />
                      )}
                      {is_cat == false && (
                        <div className="flex justify-center items-center">
                          <FiMapPin size={10} color="black" className="mr-1" />
                          <CustomText content={item?.city} fontsize="10.91px" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <CustomText content={"No data available"} />
                </div>
              )}
            </div>
          </div>

          {selected_item?.length > 0 && (
            <div className="flex items-center mt-12 ml-1">
              <CgArrowsExchangeAlt size={30} color="black" />
            </div>
          )}

          <div className="mt-4 ml-2">
            <div className="text-start">
              <CustomText
                content={
                  is_cat == false
                    ? "Featured Itineraries"
                    : "Featured Categories"
                }
                primaryfontweight
                fontsize="12px"
              />
            </div>
            <div className="border-2 border-[rgba(110, 118, 132, 0.33)] p-2 rounded-md mt-4 max-h-[300px] overflow-y-scroll">
              {selected_item?.length > 0 ? (
                selected_item?.map((item, index) => (
                  <div
                    key={item?.id || index}
                    className="group mb-2 flex items-center gap-2  rounded-md"
                  >
                    <div className="relative flex rounded-md group-hover:bg-gradient-to-r group-hover:from-[#FCFCFC] group-hover:to-[#E96042]  border-2 border-[rgba(110, 118, 132, 0.33)] p-2 ">
                      <div
                        onClick={() => remove_onclick(item)}
                        className="hidden absolute right-[6%] top-[34%] group-hover:flex z-10"
                      >
                        <CustomText
                          content={"Remove"}
                          className="text-white select-none cursor-pointer transition-transform transform duration-75 active:scale-95"
                        />
                      </div>

                      <div
                        className={`flex ${
                          is_cat == true
                            ? "min-w-[10rem] justify-start items-center"
                            : "justify-center items-center"
                        } `}
                      >
                        {/* {is_cat == false && ( */}
                        <div
                          style={{
                            height: "25px",
                            minWidth: "25px",
                            borderRadius: "50%",
                            backgroundColor:
                              is_cat == true
                                ? "#4DFF5F"
                                : item?.is_active == true
                                  ? "#4DFF5F"
                                  : "#FF4D4D",
                          }}
                          className="flex justify-center items-center mr-4"
                        />
                        {/* )} */}
                        <CustomText
                          content={is_cat == false ? item?.title : item?.name}
                          fontsize="10.91px"
                        />
                      </div>
                      {is_cat == false && (
                        <div className="flex justify-center items-center">
                          <SlCalender
                            size={12}
                            color="black"
                            className="mr-2 ml-4"
                          />
                          <CustomText
                            content={`${item?.duration} Days & ${
                              item?.duration - 1
                            }  Nights`}
                            fontsize="10.91px"
                            className="text-center"
                          />
                        </div>
                      )}
                      {is_cat == false && (
                        <div className="w-[1px] bg-[#6E7684] self-stretch mx-4 my-1" />
                      )}
                      {is_cat == false && (
                        <div className="flex justify-center items-center">
                          <FiMapPin size={10} color="black" className="mr-2" />
                          <CustomText content={item?.city} fontsize="10.91px" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <CustomText content={"No data available"} />
                </div>
              )}
            </div>
          </div>

          {selected_item?.length > 0 && (
            <div className="text-start ml-6">
              <CustomButton
                content={"Upload"}
                btncolor={light.signinbtnbackground}
                onClick={handleonclick}
              />
            </div>
          )}
        </div>
        {to_show_error && (
          <div className="flex justify-start my-2">
            <CustomText
              content={err_con}
              className="text-red-500"
              fontsize="12px"
            />
          </div>
        )}
      </>
    );
  };

  const deleteBanner = async ({ id }) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!isConfirmed) return;

    console.log("Delete banner triggered with id:", id);
    dispatch(setValue({ key: "to_show_loader", value: true }));

    try {
      await remove(API_ENDPOINTS.ADMIN.DELETE_BANNER + "/" + id).then((d) => {
        if (d?.message == "BANNER_DELETED" && d?.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          dispatch(setValue({ key: "to_show_alert", value: true }));
          dispatch(
            setValue({
              key: "alert_content",
              value: "Banner Deleted Successfully",
            })
          );
          fetch_All_Content_Data(); // Refresh content list
        }
      });
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      console.error(error);
      const err_response = error?.response?.data;
      if (
        err_response?.success === false &&
        err_response?.message === "VALIDATION_INVALID_TOKEN"
      ) {
        localStorageHelper.removeItem("login_data");
        router.push(PAGES.LOGIN, { replace: true });
      }
    }
  };

  useEffect(() => {
    fetch_All_Content_Data();
    fetch_AdminHeroSlides();
  }, []);

  const fetch_AdminHeroSlides = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const d = await get(API_ENDPOINTS.ADMIN.GET_HERO_SLIDES);
      if (d?.success) {
        setState((prev) => ({ ...prev, heroSlides: d.data || [] }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET_NAME);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (!data?.secure_url) throw new Error("UPLOAD_FAILED");
    return data.secure_url;
  };

  const updateLocalHeroField = (idx, key, value) => {
    setState((prev) => {
      const copy = [...(prev.heroSlides || [])];
      copy[idx] = { ...(copy[idx] || {}), [key]: value };
      return { ...prev, heroSlides: copy };
    });
  };
  const updateLocalHeroCard = (idx, cardIdx, value) => {
    setState((prev) => {
      const copy = [...(prev.heroSlides || [])];
      const cards = Array.isArray(copy[idx]?.cards)
        ? [...copy[idx].cards]
        : ["", "", ""];
      cards[cardIdx] = value;
      copy[idx] = { ...(copy[idx] || {}), cards };
      return { ...prev, heroSlides: copy };
    });
  };
  const handleHeroFile = async (idx, field, file, cardIdx = null) => {
    try {
      dispatch(setValue({ key: "to_show_loader", value: true }));
      const url = await uploadToCloudinary(file);
      if (field === "background") updateLocalHeroField(idx, "background", url);
      if (field === "cards" && cardIdx !== null)
        updateLocalHeroCard(idx, cardIdx, url);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const createSlide = () => {
    setState((prev) => ({
      ...prev,
      heroSlides: [
        ...(prev.heroSlides || []),
        {
          key: "",
          title: "",
          description: "",
          background: "",
          cards: ["", "", ""],
          tempId: `temp-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        },
      ],
    }));
  };

  const saveSlide = async (slide) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      // If creating a new slide, set its index to the end
      const slideData = slide.id
        ? slide
        : {
            ...slide,
            index: (state.heroSlides || []).length,
          };

      if (slide.id) {
        await put(
          `${API_ENDPOINTS.ADMIN.UPDATE_HERO_SLIDE}/${slide.id}`,
          slideData
        );
      } else {
        await post(API_ENDPOINTS.ADMIN.CREATE_HERO_SLIDE, slideData);
      }
      await fetch_AdminHeroSlides();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const deleteSlide = async (id) => {
    if (!id) return;
    const ok = window.confirm("Delete this hero slide?");
    if (!ok) return;
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await remove(`${API_ENDPOINTS.ADMIN.DELETE_HERO_SLIDE}/${id}`);
      await fetch_AdminHeroSlides();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  const handleHeroSlidesDragEnd = async (result) => {
    const { source, destination } = result;

    // If dropped outside a droppable area, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (source.index === destination.index) return;

    // Reorder the slides in local state
    const reorderedSlides = Array.from(state.heroSlides || []);
    const [movedSlide] = reorderedSlides.splice(source.index, 1);
    reorderedSlides.splice(destination.index, 0, movedSlide);

    // Update local state immediately for UI responsiveness
    setState((prev) => ({
      ...prev,
      heroSlides: reorderedSlides,
    }));

    // Update indices in backend (only for slides that have IDs)
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      // Filter out slides without IDs and update only existing slides
      const slidesToUpdate = reorderedSlides
        .map((slide, idx) => ({ slide, idx }))
        .filter(({ slide }) => slide.id); // Only update slides with IDs

      // Update all slides with their new indices
      const updatePromises = slidesToUpdate.map(({ slide, idx }) =>
        put(`${API_ENDPOINTS.ADMIN.UPDATE_HERO_SLIDE}/${slide.id}`, {
          ...slide,
          index: idx,
        })
      );

      await Promise.all(updatePromises);

      setTimeout(async () => {
        await fetch_AdminHeroSlides();
        dispatch(setValue({ key: "to_show_loader", value: false }));
      }, 500);
    } catch (e) {
      console.error("Failed to update slide order:", e);
      // Revert to original order on error
      await fetch_AdminHeroSlides();
      dispatch(setValue({ key: "to_show_loader", value: false }));
    }
  };

  return (
    <div className=" h-screen w-full flex  bg-white">
      <div className="w-full bg-white p-16 rounded-2xl animate-fadeIn ml-0 sm:ml-52 ">
        <AdminTopbar topbar_title={"Content"} />
        <div className="flex gap-10  w-[80%]">
          <div className="">
            <div className="flex  justify-start gap-4 mt-10">
              <div className="flex  flex-wrap justify-between px-4 pr-6 py-8 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
                <div className="flex">
                  <div className="mr-10">
                    <CustomText
                      content={"Offer Headlines"}
                      fontsize="16px"
                      secondaryfontweight
                    />
                    {/* <CustomText
                      content={'Last changed a week ago'}
                      fontsize="10.01px"
                    /> */}
                  </div>
                  <div className="flex">
                    <div
                      onClick={() =>
                        setState((prevs) => ({
                          ...prevs,
                          to_show_offer_headline: true,
                        }))
                      }
                      className="mr-4 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                    >
                      <EditIcon color={light.signinbtnbackground} />
                    </div>
                    <div className="group relative w-2 ">
                      <div className="cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                        <ThreedotIcon />
                      </div>
                      <div className="group-hover:block hidden absolute top-1 right-2 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                        <div
                          onClick={() =>
                            update_Offer_Headling({
                              passed_active_status:
                                !state.offer_headline_status,
                            })
                          }
                          className="text-deletetextcolor cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                        >
                          {state.offer_headline_status == true
                            ? "Disable"
                            : "Enable"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex  flex-wrap justify-between px-4 pr-6 py-8 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
                <div className="flex">
                  <div className="mr-10">
                    <CustomText
                      content={`Terms &
                Condition`}
                      fontsize="16px"
                      secondaryfontweight
                    />
                    {/* <CustomText
                      content={'Last changed a week ago'}
                      fontsize="10.01px"
                    /> */}
                  </div>
                  <div className="flex">
                    <div
                      onClick={() =>
                        setState((prevs) => ({
                          ...prevs,
                          to_show_terms_modal: true,
                        }))
                      }
                      className="mr-4 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                    >
                      <EditIcon color={light.signinbtnbackground} />
                    </div>
                    <div className="group relative w-2 ">
                      <div className="cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                        <ThreedotIcon />
                      </div>
                      <div className="group-hover:block hidden absolute top-1 right-2 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                        <div
                          onClick={() => {
                            setState((prevs) => ({
                              ...prevs,
                              is_modalopen: true,
                              to_which_modal_content: "terms",
                            }));
                          }}
                          className="text-black cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                        >
                          View
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex  flex-wrap justify-between px-4 pr-6 py-8 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
                <div className="flex">
                  <div className="mr-10">
                    <CustomText
                      content={"Cancellation Policy"}
                      fontsize="16px"
                      secondaryfontweight
                    />
                    {/* <CustomText
                      content={'Last changed a week ago'}
                      fontsize="10.01px"
                    /> */}
                  </div>
                  <div className="flex">
                    <div
                      onClick={() =>
                        setState((prevs) => ({
                          ...prevs,
                          to_show_cancellation_modal: true,
                        }))
                      }
                      className="mr-4 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                    >
                      <EditIcon color={light.signinbtnbackground} />
                    </div>
                    <div className="group relative w-2 ">
                      <div className="cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                        <ThreedotIcon />
                      </div>
                      <div className="group-hover:block hidden absolute top-1 right-2 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                        <div
                          onClick={() => {
                            setState((prevs) => ({
                              ...prevs,
                              is_modalopen: true,
                              to_which_modal_content: "policy",
                            }));
                          }}
                          className="text-black cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                        >
                          View
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto mt-6 pb-4 ">
              <CustomText
                content={"Gallery"}
                secondaryfontweight
                fontsize="16px"
                className="mb-4"
              />
              <div className="border-2 border-[#C3C3C3] p-6 rounded-md">
                <div className="flex">
                  <CustomText
                    className="border-b-2 border-black"
                    content={"Upload & View Images"}
                    fontsize="14px"
                    secondaryfontweight
                  />
                </div>
                <div className="flex gap-10">
                  <div>
                    {/* <div className="flex mt-4">
                      <CustomSelect
                        top_title={'Image Position'}
                        category_name={'Category'}
                        option_data={['Centre', 'Left', 'Right', 'Top']}
                        to_disable
                      />
                    </div> */}
                    <div className="w-full">
                      <InputFile />
                      {state.to_show_error && state.selected_img == null && (
                        <div className="flex justify-start my-2">
                          <CustomText
                            content={"Please add a image to continue"}
                            className="text-red-500"
                            fontsize="12px"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      <div className=" mt-6 mr-4">
                        <CustomButton
                          content={"Dismiss"}
                          // btncolor={light.signinbtnbackground}
                          padding="py-3 px-16"
                          text_color="text-black"
                          pill_rounded
                          md_round={false}
                          className="border-2 border-black"
                          onClick={() =>
                            setState((prevs) => ({
                              ...prevs,
                              selected_img: null,
                              selected_img_preview: null,
                              uploaded_img: null,
                            }))
                          }
                        />
                      </div>
                      <div className=" mt-6">
                        <CustomButton
                          content={"Upload"}
                          btncolor={light.signinbtnbackground}
                          pill_rounded
                          padding="py-3 px-16"
                          md_round={false}
                          onClick={() => update_Gallery()}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="mt-4">
                      <CustomText
                        content={"Uploaded Pictures"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </div>
                    <div className="max-h-[500px] overflow-y-scroll">
                      {state.gallery_photos?.length > 0 &&
                        (state.gallery_photos || [])?.map((item, index) => (
                          <div key={item?.id || index} className="w-full mt-4">
                            <div className=" w-full flex flex-1 border-2 border-[rgba(110, 118, 132, 0.33)] p-4 rounded-md">
                              <div className="flex w-full flex-1 justify-between border-2 border-[rgba(110, 118, 132, 0.33)] p-4 rounded-md">
                                <CustomText
                                  content={`Picture ${index + 1} `}
                                  className="text-nowrap mr-12"
                                />
                                <div className="flex">
                                  <div
                                    onClick={() =>
                                      setState((prevs) => ({
                                        ...prevs,
                                        to_show_pic: true,
                                        pic_index: index,
                                        pic_src: item?.images,
                                      }))
                                    }
                                    className="transition-transform transform duration-75 active:scale-95 cursor-pointer select-none"
                                  >
                                    <CustomText
                                      content={"View"}
                                      className="text-[#383838]"
                                      fontsize="8px"
                                    />
                                  </div>
                                  <div className="w-[1px] bg-[#6E7684] self-stretch mx-5 my-1 " />
                                  <div
                                    onClick={() =>
                                      delete_image_from_Gallery({
                                        id: item?.id,
                                      })
                                    }
                                    className="transition-transform transform duration-75 active:scale-95 cursor-pointer select-none"
                                  >
                                    <CustomText
                                      content={"Delete"}
                                      className="text-[#FF0000]"
                                      fontsize="8px"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <CustomText
                  content={"Featured Itineraries"}
                  fontsize="16px"
                  className="text-[#202224]"
                  secondaryfontweight
                />
              </div>
              <div className="flex mt-4">
                <div className=" border-2 border-[#C3C3C3] p-4 rounded-md">
                  <div className="flex">
                    <CustomText
                      content={"Add featured itinerary"}
                      fontsize="13px"
                      className="border-b-2 border-black"
                    />
                  </div>
                  {state.active_iti?.length > 0 || state.featured_iti ? (
                    <CompareCard
                      total_item={state.active_iti}
                      selected_item={state.selected_featured_iti}
                      add_onclick={(item) => {
                        const item_check = state?.selected_featured_iti.some(
                          (ad_item) => ad_item.id == item.id
                        );
                        if (item_check == false) {
                          setState((prevs) => ({
                            ...prevs,
                            selected_featured_iti: [
                              ...prevs.selected_featured_iti,
                              item,
                            ],
                          }));
                        }
                      }}
                      remove_onclick={(item) =>
                        setState((prevs) => ({
                          ...prevs,
                          selected_featured_iti:
                            prevs.selected_featured_iti.filter(
                              (it) => it?.id != item?.id
                            ),
                        }))
                      }
                      handleonclick={update_Hero_Iti}
                      to_show_error={state.compare_error1}
                      err_con="There should be atleast 3 itineraries and atmost you can only add upto 3 itineraries"
                    />
                  ) : (
                    <CustomText
                      className="my-4"
                      content={"No data available"}
                    />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <CustomText
                  content={"Featured Categories"}
                  fontsize="16px"
                  className="text-[#202224]"
                  secondaryfontweight
                />
              </div>
              <div className="flex mt-4">
                <div className=" border-2 border-[#C3C3C3] p-4 rounded-md">
                  <div className="flex">
                    <CustomText
                      content={"Add featured Categories"}
                      fontsize="13px"
                      className="border-b-2 border-black"
                    />
                  </div>
                  {state.all_cat?.length > 0 ? (
                    <CompareCard
                      total_item={state.all_cat}
                      selected_item={state.selected_featured_cat}
                      add_onclick={(item) => {
                        const item_check = state?.selected_featured_cat.some(
                          (ad_item) => ad_item.id == item.id
                        );
                        if (item_check == false) {
                          setState((prevs) => ({
                            ...prevs,
                            selected_featured_cat: [
                              ...prevs.selected_featured_cat,
                              item,
                            ],
                          }));
                        }
                      }}
                      remove_onclick={(item) =>
                        setState((prevs) => ({
                          ...prevs,
                          selected_featured_cat:
                            prevs.selected_featured_cat.filter(
                              (it) => it?.id != item?.id
                            ),
                        }))
                      }
                      handleonclick={update_Home_Categories}
                      is_cat
                      to_show_error={state.compare_error2}
                      err_con="You can only add upto 3 categories"
                    />
                  ) : (
                    <CustomText
                      className="my-4"
                      content={"No data available"}
                    />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <CustomText
                  content={"Explore Categories"}
                  fontsize="16px"
                  className="text-[#202224]"
                  secondaryfontweight
                />
              </div>
              <div className="flex mt-4">
                <div className=" border-2 border-[#C3C3C3] p-4 rounded-md">
                  <div className="flex">
                    <CustomText
                      content={"Add explore category"}
                      fontsize="13px"
                      className="border-b-2 border-black"
                    />
                  </div>
                  {state.all_cat?.length > 0 ? (
                    <CompareCard
                      is_explore
                      total_item={state.all_cat}
                      selected_item={state.selected_explored_cat}
                      add_onclick={(item) => {
                        const item_check = state?.selected_explored_cat.some(
                          (ad_item) => ad_item.id == item.id
                        );
                        if (item_check == false) {
                          setState((prevs) => ({
                            ...prevs,
                            selected_explored_cat: [
                              ...prevs.selected_explored_cat,
                              item,
                            ],
                          }));
                        }
                      }}
                      remove_onclick={(item) =>
                        setState((prevs) => ({
                          ...prevs,
                          selected_explored_cat:
                            prevs.selected_explored_cat.filter(
                              (it) => it?.id != item?.id
                            ),
                        }))
                      }
                      is_cat
                      handleonclick={update_nav_Categories}
                      to_show_error={state.compare_error3}
                      err_con="There should be atleast 2 categories and atmost you can only add upto 4 categories"
                    />
                  ) : (
                    <CustomText
                      className="my-4"
                      content={"No data available"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="text-center">
              <CustomText
                content={"Promotional Offers Banners"}
                fontsize="20.2px"
                secondaryfontweight
              />
            </div>
            <div>
              <div className="bg-[#3A3A3A] rounded-2xl p-4 mt-4">
                <div className="flex flex-wrap gap-y-4 items-center justify-around border-[3px]  border-dashed border-white p-4 rounded-md">
                  <div>
                    <CustomText
                      content={"Active Offers"}
                      className="text-white mb-2 text-center"
                      fontsize="12px"
                      primaryfontweight
                    />
                    <CustomText
                      content={state?.activeBannersCount || 0}
                      className="text-white text-center"
                      fontsize="24px"
                      primaryfontweight
                    />
                  </div>
                  <div>
                    <CustomText
                      content={"Inactive"}
                      className="text-white mb-2 text-center"
                      fontsize="12px"
                    />
                    <CustomText
                      content={state?.expiredBannersCount || 0}
                      className="text-signinbtnbackground text-center"
                      fontsize="24px"
                      primaryfontweight
                    />
                  </div>
                  <div>
                    <CustomText
                      content={"Clicks"}
                      className="text-white mb-2 text-center"
                      fontsize="12px"
                      primaryfontweight
                    />
                    <CustomText
                      content={state?.total_clicks || 0}
                      className="text-white text-center"
                      fontsize="24px"
                      primaryfontweight
                    />
                  </div>
                </div>
                <div className="mx-6 mt-6">
                  <CustomButton
                    logo_path={
                      <div className="mr-3">
                        <AddIcon />
                      </div>
                    }
                    font_size={"12px"}
                    content={"Upload new banner"}
                    btncolor={light.signinbtnbackground}
                    onClick={() => open_Banner_Modal()}
                  />
                </div>
              </div>
              <div className="flex mt-4  justify-end">
                <CustomSelect
                  // top_title={'Image Position'}
                  // category_name={'Category'}
                  option_data={["Recent 10 Offers"]}
                  to_disable
                />
              </div>
              <table className="min-w-full border-collapse text-center  mt-4">
                <thead className="bg-inputbg rounded-full p-5">
                  <tr>
                    <th className="rounded-l-lg px-4 py-2">
                      <CustomText
                        content={"Sr No."}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Offer Name"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Category Name"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Expired Date"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Status"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center"></th>
                  </tr>
                </thead>
                <tbody className="w-auto">
                  {state.banner_data?.length > 0 ? (
                    state.banner_data?.map((item, index) => (
                      <React.Fragment key={item?.id || index}>
                        <tr>
                          <td className="px-4 py-2">
                            <CustomText
                              content={index + 1 + "." || "NA"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <CustomText
                              content={item?.title || "NA"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <CustomText
                              content={item?.category_name || "NA"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <CustomText
                              content={
                                moment(item?.expire_at).format(
                                  "DD MMMM YYYY"
                                ) || "NA"
                              }
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td>
                            <div
                              className={`${
                                (item?.is_active || false) == true
                                  ? "bg-btnactivecolor"
                                  : "bg-btninactivecolor"
                              } rounded-2xl mx-2`}
                            >
                              <CustomText
                                content={
                                  (item?.is_active || false) == true
                                    ? "Active"
                                    : "Inactive"
                                }
                                fontsize="13px"
                                secondaryfontweight
                                className="text-white py-[6px] select-none"
                              />
                            </div>
                          </td>
                          <td className="group relative  py-2  mx-auto">
                            <CustomButton
                              logo_path={<ThreedotIcon />}
                              content={""}
                            />
                            <div className="group-hover:block hidden absolute top-10 right-10 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                              <div
                                onClick={() => {
                                  console.log("Delete clicked:", item?.id);
                                  deleteBanner({ id: item?.id });
                                }}
                                className="mb-2 text-red-500 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                              >
                                Delete
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="100%" className="p-0">
                            <hr className="w-full my-1 bg-bordercolor" />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
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
          </div>
        </div>
        <CustomModal
          open={state.is_modalopen}
          handleClose={() =>
            setState((prevs) => ({ ...prevs, is_modalopen: false }))
          }
          title={
            state.to_which_modal_content != "terms" &&
            state.to_which_modal_content != "policy" ? (
              <span>
                <strong>Add new </strong>
                Category
              </span>
            ) : (
              ""
            )
          }
          description={
            state.to_which_modal_content != "terms" &&
            state.to_which_modal_content != "policy"
              ? "Create a new category by filling out details including destinations, dates, transportation, and activities."
              : ""
          }
          restContent={
            state.to_which_modal_content == "terms" ||
            state.to_which_modal_content == "policy" ? (
              <div>
                <div className="text-start">
                  <div>
                    <CustomText
                      fontsize="34.94px"
                      primaryfontweight
                      content={
                        state.to_which_modal_content == "terms" ? (
                          <span>
                            <strong>Terms & Conditions</strong>
                          </span>
                        ) : (
                          state.to_which_modal_content == "policy" && (
                            <span>
                              Cancellation <strong>Policy</strong>
                            </span>
                          )
                        )
                      }
                      className="mb-4"
                    />
                  </div>
                  {/* <CustomText
                    fontsize="18px"
                    content={state.selected_category?.description}
                  /> */}
                </div>
                <div className="ml-7 mt-4">
                  {state.to_which_modal_content == "terms" &&
                    state.terms_data?.length > 0 && (
                      <ul className="list-disc mt-4">
                        {state.terms_data?.length > 0 &&
                          (state.terms_data || [])?.map((item, index) => (
                            <li className="text-start" key={index}>
                              <CustomText content={item} fontsize="10px" />
                            </li>
                          ))}
                      </ul>
                    )}
                </div>
                <div className="ml-7 mt-4">
                  {state.to_which_modal_content == "policy" &&
                    state.policy_data?.length > 0 && (
                      <ul className="list-disc mt-4">
                        {state.policy_data?.length > 0 &&
                          (state.policy_data || [])?.map((item, index) => (
                            <li className="text-start" key={index}>
                              <CustomText content={item} fontsize="10px" />
                            </li>
                          ))}
                      </ul>
                    )}
                </div>
                <div className="flex justify-center items-center ">
                  <div className="  mr-4 mt-4">
                    <CustomButton
                      content={"Edit"}
                      // btncolor={light.signinbtnbackground}
                      padding="py-3 px-16"
                      text_color="text-black"
                      pill_rounded
                      md_round={false}
                      className="border-2 border-black"
                      onClick={() => {
                        if (state.to_which_modal_content == "terms") {
                          setState((prevs) => ({
                            ...prevs,
                            to_show_terms_modal: true,
                          }));
                        } else {
                          setState((prevs) => ({
                            ...prevs,
                            to_show_cancellation_modal: true,
                          }));
                        }
                      }}
                    />
                  </div>
                  <div className=" mt-4">
                    <CustomButton
                      content={"Back to Dashboard"}
                      btncolor={light.signinbtnbackground}
                      pill_rounded
                      padding="py-3 px-16"
                      md_round={false}
                      onClick={() => router.push(PAGES.DASHBOARD)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex mt-4 w-full gap-4">
                  <div className="w-full">
                    <CustomInput
                      top_title="Category Name"
                      backgroundColor="white"
                      content="Enter name of Itinerary"

                      // onchange={(e) =>
                      //   setState((prevs) => ({
                      //     ...prevs,
                      //     banner_title: e.target.value
                      //   }))
                      // }
                    />
                  </div>
                  <div className="w-full">
                    <CustomInput
                      top_title="Short Description"
                      backgroundColor="white"
                      content="Enter short description"
                      // onchange={(e) =>
                      //   setState((prevs) => ({
                      //     ...prevs,
                      //     banner_title: e.target.value
                      //   }))
                      // }
                    />
                  </div>
                </div>
                <div className="w-full mt-4">
                  <CustomInput
                    top_title="Long Description"
                    backgroundColor="white"
                    content="Enter long description"
                    // onchange={(e) =>
                    //   setState((prevs) => ({
                    //     ...prevs,
                    //     banner_title: e.target.value
                    //   }))
                    // }
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
                    />
                  </div>
                  <div>
                    <CustomInputFile
                      btncontent="Browse..."
                      second_title_btn="Or drop Banner Image here"
                      top_title_content="Banner Image :  "
                      className={"mt-4"}
                      no_right_margin={true}
                      small_btn={true}
                    />
                  </div>
                  <div className="mt-6">
                    <CustomText
                      content={"Only Home"}
                      fontsize="16.05px"
                      className="text-nowrap"
                    />
                    <Switch defaultChecked size="medium" />
                  </div>
                </div>

                <div className="flex justify-center ">
                  {state?.selected_category?.itinerary && (
                    <div className="mt-4 ml-2">
                      <div className="text-start">
                        <CustomText
                          content={"Total Itineraries"}
                          primaryfontweight
                          fontsize="12px"
                        />
                      </div>
                      <div className="border-2 border-[rgba(110, 118, 132, 0.33)] p-2 rounded-md mt-4 max-h-[300px] overflow-y-scroll">
                        {(state?.selected_category?.itinerary || [])?.map(
                          (item, index) => (
                            <div className=" group mb-2 flex items-center gap-2 rounded-md">
                              <div className="relative flex rounded-md group-hover:bg-gradient-to-r group-hover:from-[#FCFCFC] group-hover:to-[#00B69B]  border-2 border-[rgba(110, 118, 132, 0.33)] p-2 ">
                                <div
                                  onClick={() => {
                                    const item_check =
                                      state?.added_itineraries.some(
                                        (ad_item) => ad_item.id == item.id
                                      );
                                    if (item_check == false) {
                                      setState((prevs) => ({
                                        ...prevs,
                                        added_itineraries: [
                                          ...prevs.added_itineraries,
                                          item,
                                        ],
                                      }));
                                    }
                                  }}
                                  className="hidden absolute right-[6%] top-[34%] group-hover:flex z-10"
                                >
                                  <CustomText
                                    content={"Add"}
                                    className="text-white select-none cursor-pointer transition-transform transform duration-75 active:scale-95"
                                  />
                                </div>
                                <div
                                  style={{
                                    height: "25px",
                                    minWidth: "25px",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                    backgroundColor:
                                      item?.is_active == true
                                        ? "#4DFF5F"
                                        : "#FF4D4D",
                                  }}
                                  className="flex justify-center items-center"
                                />
                                <CustomText
                                  content={item?.title}
                                  fontsize="10.91px"
                                />
                                <div className="flex justify-center items-center">
                                  <SlCalender
                                    size={12}
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
                                <div className="w-[1px] bg-[#6E7684] self-stretch mx-5 my-1" />
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
                        {(state?.added_itineraries || [])?.map(
                          (item, index) => (
                            <div className="group mb-2 flex items-center gap-2 border-2 border-[rgba(110, 118, 132, 0.33)] p-2 rounded-md">
                              <div className="relative flex rounded-md group-hover:bg-gradient-to-r group-hover:from-[#FCFCFC] group-hover:to-[#E96042]  border-2 border-[rgba(110, 118, 132, 0.33)] p-2 ">
                                <div
                                  onClick={() =>
                                    setState((prevs) => ({
                                      ...prevs,
                                      added_itineraries:
                                        prevs.added_itineraries.filter(
                                          (it) => it?.id != item?.id
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
                                    backgroundColor:
                                      item?.is_active == true
                                        ? "#4DFF5F"
                                        : "#FF4D4D",
                                  }}
                                  className="flex justify-center items-center"
                                />
                                <CustomText
                                  content={item?.title}
                                  fontsize="10.91px"
                                />
                                <div className="flex justify-center items-center">
                                  <SlCalender
                                    size={12}
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
                                <div className="w-[1px] bg-[#6E7684] self-stretch mx-5 my-1" />
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
                </div>

                <div>
                  <div className="text-center my-4">
                    <CustomText
                      content={"Key Points with Images"}
                      primaryfontweight
                      fontsize="14.26px"
                    />
                  </div>
                  <div className="flex">
                    <div>
                      <div className="flex ">
                        <CustomText content={"1."} className="mt-12 mr-2" />
                        <div className="w-full">
                          <CustomInput
                            top_title="Title"
                            backgroundColor="white"
                            content="Enter first key point"
                            custompadding="p-4"
                            // onchange={(e) =>
                            //   setState((prevs) => ({
                            //     ...prevs,
                            //     banner_title: e.target.value
                            //   }))
                            // }
                          />
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <CustomText content={"2."} className="mt-5 mr-2" />
                        <div className="w-full">
                          <CustomInput
                            backgroundColor="white"
                            content="Enter second key point"
                            custompadding="p-4"
                            // onchange={(e) =>
                            //   setState((prevs) => ({
                            //     ...prevs,
                            //     banner_title: e.target.value
                            //   }))
                            // }
                          />
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <CustomText content={"3."} className="mt-4 mr-2" />
                        <div className="w-full">
                          <CustomInput
                            backgroundColor="white"
                            content="Enter third key point"
                            custompadding="p-4"
                            // onchange={(e) =>
                            //   setState((prevs) => ({
                            //     ...prevs,
                            //     banner_title: e.target.value
                            //   }))
                            // }
                          />
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <CustomText content={"4."} className="mt-5 mr-2" />
                        <div className="w-full">
                          <CustomInput
                            backgroundColor="white"
                            content="Enter fourth key point"
                            custompadding="p-4"
                            // onchange={(e) =>
                            //   setState((prevs) => ({
                            //     ...prevs,
                            //     banner_title: e.target.value
                            //   }))
                            // }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex ">
                        <div className="w-full">
                          <CustomInputFile
                            btncontent="Browse..."
                            second_title_btn="Or drop Image here"
                            top_title_content="Images"
                            // className={'mt-6'}
                            no_right_margin={true}
                            small_btn={true}
                          />
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <div className="w-full">
                          <CustomInputFile
                            btncontent="Browse..."
                            second_title_btn="Or drop Image here"
                            // className={'mt-6'}
                            no_right_margin={true}
                            small_btn={true}
                            no_title={false}
                          />
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <div className="w-full">
                          <CustomInputFile
                            btncontent="Browse..."
                            second_title_btn="Or drop Image here"
                            // className={'mt-6'}
                            no_right_margin={true}
                            small_btn={true}
                            no_title={false}
                          />
                        </div>
                      </div>
                      <div className="flex mt-4">
                        <div className="w-full">
                          <CustomInputFile
                            btncontent="Browse..."
                            second_title_btn="Or drop Image here"
                            // className={'mt-6'}
                            no_right_margin={true}
                            small_btn={true}
                            no_title={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-44 mt-6">
                  <CustomButton
                    content={"Finish"}
                    btncolor={light.signinbtnbackground}
                    pill_rounded
                    md_round={false}
                    //   onClick={() =>
                    //     setState((prevs) => ({
                    //       ...prevs,
                    //       is_modalopen: !prevs.is_modalopen,
                    //       to_which_modal_content: 'add_new_cat'
                    //     }))
                    //   }
                  />
                </div>
              </div>
            )
          }
        />
        <UploadNewBannerComp
          state={state}
          setState={setState}
          to_fetch_after_banner_upload={true}
          Fetch_content_after_banner_upload={fetch_All_Content_Data}
        />
        <CustomModal
          title={
            <span>
              <strong>Offer Headline </strong>
            </span>
          }
          description={""}
          open={state.to_show_offer_headline}
          backdropvalue="0.1"
          restContent={
            <div className="mt-6">
              <CustomInput
                top_title="Offer Title"
                value={state.offer_headline}
                backgroundColor="white"
                content="Enter name of Itinerary"
                onchange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    offer_headline: e.target.value,
                  }))
                }
                error_text={
                  state.to_show_error &&
                  state.offer_headline?.length == 0 &&
                  "Enter the headline to continue"
                }
              />

              {/* <div className="flex gap-4 mt-4">
                <CustomSelect
                  top_title={'Choose itinerary'}
                  option_data={['Choose itinerary', ...state.itinerary_list]}
                  border_color="rgba(110, 118, 132, 0.33)"
                  // onOpen={() => {
                  //   state.categories_list?.length > 1 && getItineraryById()
                  // }}
                  content_destruct={(item) => (
                    <CustomText content={item?.id ? item?.title : item} />
                  )}
                  selectedValue={state.selected_itinerary}
                  onChange={(e) =>
                    setState((prevs) => ({ ...prevs, selected_itinerary: e }))
                  }
                />
              </div>
              <div>
                <CustomText
                  secondaryfontsize
                  secondaryfontweight
                  content={'Duration'}
                  className={`mb-3 mt-4 flex self-start`}
                />
                <div className="flex justify-start items-center border border-[#6E7684] rounded-md mt-4 p-2">
                  <CustomText
                    secondaryfontweight
                    content={'Expired At'}
                    className="text-[#6E7684] "
                  />
                  <div className="w-[1px] bg-[#6E7684] self-stretch ml-5" />
                  <CustomInput
                    content="dd/mm/yy"
                    backgroundColor="white"
                    border_color="0px solid transparent"
                    contentcolor="#6E7684"
                    value={state.banner_date}
                    onClick={() => dateref.current.showPicker()}
                    onchange={() => null}
                  />
                </div>
              </div>
              <input
                ref={dateref}
                type={'datetime-local'}
                style={{ display: 'none' }}
                placeholder={'dd/mm/yy'}
                onChange={(e) => {
                  setState((prevs) => ({
                    ...prevs,
                    banner_date: e.target.value
                  }))
                  console.log('logging from onchange ', e.target.value)
                }}
              /> */}
              <div className="mx-10 mt-6 ">
                <CustomButton
                  className="mt-3 bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] "
                  text_classname={"text-white"}
                  content={"Finish"}
                  md_round={false}
                  pill_rounded={true}
                  onClick={update_Offer_Headling}
                />
              </div>
            </div>
          }
          handleClose={() =>
            setState((prevs) => ({
              ...prevs,
              to_show_offer_headline: false,
            }))
          }
        />
        <CustomModal
          title={
            <span>
              <strong>Terms & Condition</strong>
            </span>
          }
          description={""}
          open={state.to_show_terms_modal}
          backdropvalue="0.1"
          restContent={
            <div>
              <InfiniteInputBox
                initialValues={Termsandconditiondata}
                setState={setTermsandcondition}
                top_title="Terms & Condition"
              />
              {state.to_show_error &&
                Termsandconditiondata?.[0]?.length == 0 && (
                  <div className="flex justify-start my-2">
                    <CustomText
                      content={"Please add some terms to continue"}
                      className="text-red-500"
                      fontsize="12px"
                    />
                  </div>
                )}
              <div className="mx-10 mt-6 ">
                <CustomButton
                  className="mt-3 bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] "
                  text_classname={"text-white"}
                  content={"Submit"}
                  md_round={false}
                  pill_rounded={true}
                  onClick={update_Terms}
                />
              </div>
            </div>
          }
          handleClose={() =>
            setState((prevs) => ({
              ...prevs,
              to_show_terms_modal: false,
            }))
          }
        />
        <CustomModal
          title={
            <span>
              <strong>Cancellation Policy</strong>
            </span>
          }
          description={""}
          open={state.to_show_cancellation_modal}
          backdropvalue="0.1"
          restContent={
            <div>
              <InfiniteInputBox
                initialValues={cancellationdata}
                setState={setcancellationdata}
                top_title="Cancellation Policy"
              />
              <div className="mx-10 mt-6 ">
                <CustomButton
                  className="mt-3 bg-gradient-to-r from-[#FF8D38] to-[#FF5F06] "
                  text_classname={"text-white"}
                  content={"Submit"}
                  md_round={false}
                  pill_rounded={true}
                  onClick={update_Cancellation}
                />
              </div>
            </div>
          }
          handleClose={() =>
            setState((prevs) => ({
              ...prevs,
              to_show_cancellation_modal: false,
            }))
          }
        />
        <CustomModal
          title={
            <span>
              Viewing this
              <strong> Picture {state.pic_index + 1}</strong>
            </span>
          }
          description={""}
          open={state.to_show_pic}
          backdropvalue="0.1"
          restContent={
            <div className="flex justify-center items-center">
              <img
                style={{
                  aspectRatio: 1,
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: 10,
                  marginTop: 30,
                }}
                src={state.pic_src}
                alt="view_pic"
              />
            </div>
          }
          handleClose={() =>
            setState((prevs) => ({
              ...prevs,
              to_show_pic: false,
            }))
          }
        />
        <CustomButton
          content={"Edit Hero Images"}
          btncolor={light.signinbtnbackground}
          onClick={() => setState((p) => ({ ...p, to_show_hero_modal: true }))}
        />
        <CustomModal
          open={state.to_show_hero_modal}
          handleClose={() =>
            setState((p) => ({ ...p, to_show_hero_modal: false }))
          }
          title="Edit Hero Images"
          restContent={
            <div className="flex flex-col gap-6">
              <DragDropContext onDragEnd={handleHeroSlidesDragEnd}>
                <Droppable droppableId="hero-slides">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-6"
                    >
                      {(state.heroSlides || []).map((slide, idx) => {
                        // Use a stable unique ID for draggable
                        const uniqueId =
                          slide.id || slide.tempId || `temp-${idx}`;

                        return (
                          <Draggable
                            key={uniqueId}
                            draggableId={uniqueId}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  // Add transition for smooth movement
                                  transition: snapshot.isDragging
                                    ? "none"
                                    : "all 0.2s ease",
                                }}
                                className={`border rounded p-4 flex flex-col gap-4 ${
                                  snapshot.isDragging
                                    ? "bg-blue-50 shadow-lg opacity-90"
                                    : "bg-white"
                                }`}
                              >
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-center gap-2 cursor-grab active:cursor-grabbing mb-2 select-none"
                                >
                                  <MdDragIndicator className="text-gray-400 text-2xl" />
                                  <span className="text-sm text-gray-500">
                                    Slide {idx + 1} - Drag to reorder
                                  </span>
                                </div>

                                <CustomInput
                                  label="Key"
                                  value={slide.key || ""}
                                  onchange={(e) =>
                                    updateLocalHeroField(
                                      idx,
                                      "key",
                                      e.target.value
                                    )
                                  }
                                />
                                <CustomInput
                                  label="Title"
                                  value={slide.title || ""}
                                  onchange={(e) =>
                                    updateLocalHeroField(
                                      idx,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                />
                                <CustomInput
                                  label="Description"
                                  value={slide.description || ""}
                                  onchange={(e) =>
                                    updateLocalHeroField(
                                      idx,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="text-sm">
                                      Background Image
                                    </div>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        e.target.files?.[0] &&
                                        handleHeroFile(
                                          idx,
                                          "background",
                                          e.target.files[0]
                                        )
                                      }
                                    />
                                    {slide.background ? (
                                      <img
                                        src={slide.background}
                                        alt="bg"
                                        className="h-28 w-44 object-cover rounded"
                                      />
                                    ) : null}
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    <div className="text-sm">Cards (3)</div>
                                    <div className="grid grid-cols-3 gap-2">
                                      {[0, 1, 2].map((ci) => (
                                        <div
                                          key={ci}
                                          className="flex flex-col gap-2"
                                        >
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                              e.target.files?.[0] &&
                                              handleHeroFile(
                                                idx,
                                                "cards",
                                                e.target.files[0],
                                                ci
                                              )
                                            }
                                          />
                                          {slide.cards?.[ci] ? (
                                            <img
                                              src={slide.cards[ci]}
                                              alt={`card-${ci + 1}`}
                                              className="h-24 w-20 object-cover rounded"
                                            />
                                          ) : null}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <CustomButton
                                    content="Save"
                                    btncolor={light.signinbtnbackground}
                                    onClick={() => saveSlide(slide)}
                                  />
                                  {slide.id ? (
                                    <CustomButton
                                      content="Delete"
                                      btncolor={"#b91c1c"}
                                      onClick={() => deleteSlide(slide.id)}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div>
                <CustomButton
                  content="Add Slide"
                  btncolor={light.signinbtnbackground}
                  onClick={createSlide}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Content;
