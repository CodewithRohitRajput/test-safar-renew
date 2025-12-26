"use client";

import React, { useEffect, useRef, useState } from "react";
import AdminTopbar from "../../components/AdminTopbar";
import CustomText from "../../components/CustomText";
// import { HiMiniChartBar } from 'react-icons/hi2'
import { light } from "@/_assets/themes/themes";
import MultiplePerson from "@/_assets/svgs/logo/MultiplePerson";
import SinglePerson from "@/_assets/svgs/logo/SinglePerson";
import PersonWithStar from "@/_assets/svgs/logo/PersonWithStar";
import { BarChart } from "@mui/x-charts";
import CustomSelect from "../../components/CustomSelect";
import CustomButton from "../../components/CustomButton";
import AddIcon from "@/_assets/svgs/logo/AddIcon";
import Upgraph from "@/_assets/svgs/logo/Upgraph";
import Downgraph from "@/_assets/svgs/logo/Downgraph";
import { RiArrowDropRightLine } from "react-icons/ri";
// import { LiaEdit } from 'react-icons/lia'
// import { MdOutlinePhoto } from 'react-icons/md'
import { useDispatch } from "react-redux";
import { setValue } from "@/lib/globalSlice";
import { get, post } from "../../constants/axiosClient";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import moment from "moment";
// import { useNavigate } from 'react-router-dom'
import { useRouter } from "next/navigation";
import { PAGES } from "../../constants/PagesName";
import { localStorageHelper } from "../../helper/storageHelper";
import AddNewItiComp from "../../components/AddNewItiComp";
import UploadNewBannerComp from "../../components/UploadNewBannerComp";
import useAuthRedirect from "@/hooks/useAuthRedirect";

function Dashboard() {
  useAuthRedirect();

  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const router = useRouter();
  const CurrentYear = moment().year();
  const CurrentMonth = moment().format("MMMM");
  const [state, setState] = useState({
    fetched_data: [],
    banner_date: "",
    upload_modal: false,
    categories_data: [],
    categories_list: [],
    itinerary_list: [],
    selected_category: [],
    selected_itinerary: [],
    banner_img_url: "",
    banner_title: "",
    banner_route_map: null,
    banner_category_name: null,
    is_modalopen: false,
    fetched_data: [],
    categories_data: [],
    categories_list: [],
    next_cursor_id: 0,
    prev_cursor_id: 0,
    total_pages: 0,
    current_page: 1,
    view_selected_itinerary: {},
    current_modal_page_count: 1,
    iti_id: 0,
    iti_name: "",
    iti_city: "",
    iti_img: [""],
    iti_short_desc: "",
    iti_desc: "",
    iti_altitude: "",
    iti_duration: 1,
    iti_scenary: "",
    iti_cultural_site: "",
    iti_brochure_banner: "",
    iti_inclusion: "",
    iti_exclusion: "",
    iti_notes: "",
    is_active: null,
    is_trending: null,
    modal_open_purpose: "add_new",
    to_show_error: false,
    page2_error: false,
    page3_error: false,
    page4_error: false,
    uploading: false,
  });
  const [dayintro, setdayintro] = useState([]);
  const [hotelinfo, sethotelinfo] = useState([]);
  const [packagedetails, setpackagedetails] = useState([]);

  // useEffect(()=> {
  //   if(localStorageHelper.getItem('login_data') == null){
  //     router.push(PAGES.LOGIN, { replace: true })
  //   }
  // }, [])

  const fetch_dashboard_data = async () => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await get(API_ENDPOINTS.ADMIN.GET_DASHBOARD_DATA).then((d) => {
        if (d.message == "DASHBOARD_DATA_FETCHED" && d.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          setState((prevs) => ({
            ...prevs,
            fetched_data: d?.data,
          }));
          console.log("logging data", d);
        }
      });
      throw {
        response: {
          data: {
            success: false,
            message: "VALIDATION_INVALID_TOKEN",
          },
        },
      };
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
        // useAuthRedirect();
        console.log("logging out");
      }
    }
  };

  const open_Banner_Modal = () => {
    setState((prevs) => ({
      ...prevs,
      upload_modal: true,
    }));
  };
  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files)
  //   if (files.length > 0) {
  //     setState((prevs) => ({
  //       ...prevs,
  //       uploading: true
  //     }))

  //     files.forEach((file) => {
  //       handleUpload(file)
  //     })
  //   }
  // }

  // const handleUpload = (file) => {
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   formData.append('upload_preset', 'Test Safar Wanderlust')

  //   fetch(`https://api.cloudinary.com/v1_1/djvzpsyvt/image/upload`, {
  //     method: 'POST',
  //     body: formData
  //   })
  //     .then((response) => {
  //       if (!response.ok) throw new Error('Upload failed')
  //       return response.json()
  //     })
  //     .then((data) => {
  //       // Store the uploaded image URL in the state
  //       setState((prevState) => ({
  //         ...prevState,
  //         iti_img: [...prevState.iti_img, data.secure_url], // Add uploaded image URL to the array
  //         uploading: false // Stop uploading after completion
  //       }))
  //     })
  //     .catch((error) => {
  //       console.error('Upload failed', error)
  //       setState((prevState) => ({ ...prevState, uploading: false }))
  //     })
  // }
  const handleAddNewItinerary = () => {
    setState((prevs) => ({
      ...prevs,
      is_modalopen: !prevs.is_modalopen,
      iti_name: "",
      iti_desc: "",
      iti_short_desc: "",
      iti_city: "",
      iti_img: [""],
      iti_duration: "",
      iti_altitude: "",
      iti_scenary: "",
      iti_cultural_site: "",
      iti_brochure_banner: "",
      iti_notes: "",
      categoryId: [],
      iti_inclusion: "",
      iti_exclusion: "",
      modal_open_purpose: "add_new",
      selected_category: [],
      to_show_error: false,
    }));
    setdayintro([]);
    sethotelinfo([]);
    setpackagedetails([]);
  };

  useEffect(() => {
    fetch_dashboard_data();
  }, []);

  const orderedMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const sortedMonthlyData = (
    state.fetched_data?.yearlyDataForGraph?.monthly_data || []
  ).sort(
    (a, b) => orderedMonths.indexOf(a.month) - orderedMonths.indexOf(b.month)
  );

  return (
    <div className=" h-screen w-full flex  bg-white">
      <div className="w-[80%]   pl-16 pt-8 rounded-2xl animate-fadeIn ml-0 sm:ml-60 ">
        <div className="flex justify-end  mr-72 mb-6 cursor-pointer select-none">
          <div
            className="transition-transform transform duration-75 active:scale-95"
            onClick={fetch_dashboard_data}
          >
            <CustomText
              content={"Reload Dashboard Content"}
              className="rounded-full bg-signinbtnbackground py-2 px-4 text-white"
            />
          </div>
        </div>
        <AdminTopbar topbar_title={"My Dashboard"} />
        <div className="w-[70%] flex ">
          <div className="w-[70%]  mr-6">
            <div className="flex gap-7 mt-6 ">
              <div className="flex flex-1 flex-wrap justify-between px-4 pr-6 py-4 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
                <div className="mr-9">
                  <SinglePerson />
                  <CustomText
                    className="mt-4"
                    secondaryfontsize
                    secondaryfontweight
                    content={"Total Bookings"}
                  />
                  <CustomText
                    fontsize="7px"
                    content={`Year ${CurrentYear}`}
                    className="-mt-1 ml-[2px]"
                  />
                </div>
                <div className="flex flex-col  items-end w-100">
                  <CustomText
                    content={
                      state.fetched_data?.currentYearData?.bookings?.[0] || 0
                    }
                    className={`mb-6  ${
                      (state.fetched_data?.currentYearData?.bookings?.[1] ||
                        false) == true
                        ? "text-graphtextgreen"
                        : "text-signinbtnbackground"
                    } `}
                    fontsize="24px"
                  />
                  {(state.fetched_data?.currentYearData?.bookings?.[1] ||
                    false) == true ? (
                    <Upgraph />
                  ) : (
                    <Downgraph />
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-wrap justify-between px-4 pr-6 py-4 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
                <div className="mr-9">
                  <PersonWithStar />
                  <CustomText
                    className="mt-4"
                    secondaryfontsize
                    secondaryfontweight
                    content={"Total Revenue"}
                  />
                  <CustomText
                    fontsize="7px"
                    content={CurrentYear}
                    className="-mt-1 ml-[2px]"
                  />
                </div>
                <div className="flex flex-col  items-end w-100">
                  <CustomText
                    content={
                      state.fetched_data?.currentYearData?.revenue?.[0] || 0
                    }
                    className={`mb-6 ${
                      (state.fetched_data?.currentYearData?.revenue?.[1] ||
                        false) == true
                        ? "text-graphtextgreen"
                        : "text-signinbtnbackground"
                    } `}
                    fontsize="24px"
                  />
                  {(state.fetched_data?.currentYearData?.revenue?.[1] ||
                    false) == true ? (
                    <Upgraph />
                  ) : (
                    <Downgraph />
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-wrap justify-between px-4 pr-6 py-4 bg-white z-20 shadow-md shadow-[rgba(0, 0, 0, 0.25)] rounded-md">
                <div className="mr-9">
                  <MultiplePerson />
                  <CustomText
                    className="mt-4"
                    secondaryfontsize
                    secondaryfontweight
                    content={"Total Requests"}
                  />
                  <CustomText
                    fontsize="7px"
                    content={CurrentYear}
                    className="-mt-1 ml-[2px]"
                  />
                </div>
                <div className="flex flex-col  items-end w-100">
                  <CustomText
                    content={
                      state.fetched_data?.currentYearData?.requests?.[0] || 0
                    }
                    className={`mb-6 ${
                      (state.fetched_data?.currentYearData?.requests?.[1] ||
                        false) == true
                        ? "text-graphtextgreen"
                        : "text-signinbtnbackground"
                    } `}
                    fontsize="24px"
                  />
                  {(state.fetched_data?.currentYearData?.requests?.[1] ||
                    false) == true ? (
                    <Upgraph />
                  ) : (
                    <Downgraph />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between  mt-8">
              <CustomText
                secondaryfontweight
                fontsize="16px"
                content={"Bookings"}
              />
              <div className="flex mr-[23rem]">
                <div className="flex mr-[4rem]">
                  <div className="rounded-full w-3 h-3 bg-barcolor1 mr-2 mt-1" />
                  <CustomText
                    secondaryfontweight
                    fontsize="12px"
                    content={"Bookings"}
                  />
                </div>
                <div className="flex ">
                  <div className="rounded-full w-3 h-3 bg-barcolor2 mr-2 mt-1" />
                  <CustomText
                    secondaryfontweight
                    fontsize="12px"
                    content={"New Requests"}
                  />
                </div>
              </div>
              {/* <CustomSelect
                fontSize={'11px'}
                option_data={['Current Year']}
                to_disable={true}
              /> */}
            </div>
            <div className="chart-container ">
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                    categoryGapRatio: 0.5,
                    barGapRatio: 0,
                  },
                ]}
                series={[
                  {
                    data: sortedMonthlyData.map((item) => item.bookings),
                    color: light.barcolor1,
                  },
                  {
                    data: sortedMonthlyData.map((item) => item.requests),
                    color: light.barcolor2,
                  },
                ]}
                leftAxis={{
                  disableLine: true,
                  disableTicks: true,
                }}
                bottomAxis={{
                  disableLine: true,
                  disableTicks: true,
                }}
                grid={{ horizontal: true }}
                width={500}
                height={300}
              />
              <style>{`
                .chart-container text[x] {
                  fill: rgba(0, 0, 0, 0.5);
                }

                .chart-container text[y] {
                  fill: rgba(0, 0, 0, 0.5);
                }
              `}</style>
            </div>
            <div className="overflow-x-auto mt-3">
              <div className="flex justify-between items-center opacity-90">
                <CustomText
                  secondaryfontweight
                  fontsize="16px"
                  content={"User Requests"}
                  className="my-6"
                />
                {/* <CustomSelect
                  to_disable={true}
                  fontSize={'11px'}
                  option_data={['Recent 10 Requests']}
                /> */}
              </div>
              <table className="min-w-full border-collapse text-center  ">
                <thead className="bg-inputbg rounded-full p-5 ">
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
                        content={"Destination"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"No. of People"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Date"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Mode of Travel"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className="rounded-r-lg px-4 py-2">
                      <CustomText
                        content={"Status"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="w-auto ">
                  <tr className="h-[5px]" />
                  {(state.fetched_data?.customRequestRecentTen || []).map(
                    (item, index) => (
                      <React.Fragment key={index}>
                        <tr key={index}>
                          <td className=" px-4 py-2">
                            <CustomText
                              content={(index + 1 || 1) + "."}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className=" px-4 py-2 text-start">
                            <CustomText
                              content={item.destination || "City Name"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className=" px-4 py-2 text-center">
                            <CustomText
                              content={item.people_count || "Count"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className=" px-4 py-2 text-center">
                            <CustomText
                              content={
                                item?.start_date?.length > 0
                                  ? moment(item?.start_date).format("DD MMM")
                                  : "Date"
                              }
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className=" px-4 py-2 text-center">
                            <CustomText
                              content={item.travel_mode || "Self"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td>
                            <div
                              className={`${
                                {
                                  REQUESTED: "bg-[#F2C94C]",
                                  CONTACTED: "bg-[#56CCF2]",
                                  INTERESTED: "bg-[#A6D785]",
                                  NOT_INTERESTED: "bg-[#EB5757]",
                                  BOOKED: "bg-[#27AE60]",
                                }[item.status || "REQUESTED"] || "bg-[#A6D785]"
                              } rounded-2xl mx-2`}
                            >
                              <CustomText
                                content={item.status || "REQUESTED"}
                                fontsize="13px"
                                secondaryfontweight
                                className="text-white  py-[6px]"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="100%" className="p-0">
                            <hr className="w-full my-1 bg-bordercolor" />
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="my-6  rounded-3xl py-7 px-5  bg-dashboardbookingcard">
              <div className="flex justify-between">
                <CustomText
                  secondaryfontweight
                  fontsize="16px"
                  content={`${CurrentMonth} Bookings`}
                />
                {(state.fetched_data?.currentMonthData?.bookings?.[1] ||
                  false) == true ? (
                  <Upgraph />
                ) : (
                  <Downgraph />
                )}
              </div>

              <div className="flex gap-10">
                <div className=" mt-4">
                  <CustomText
                    className="mb-3 text-nowrap"
                    content={"Total Bookings"}
                    fontsize="12px"
                  />
                  <CustomText
                    content={
                      state.fetched_data?.currentMonthData?.bookings?.[0] || 0
                    }
                    fontsize="24px"
                  />
                </div>
                <div className="mt-4">
                  <CustomText
                    className="mb-3 text-nowrap"
                    content={"Total Requests"}
                    fontsize="12px"
                  />
                  <CustomText
                    className="text-barcolor2"
                    content={
                      state.fetched_data?.currentMonthData?.requests?.[0] || 0
                    }
                    fontsize="24px"
                  />
                </div>
                <div className="mt-4">
                  <CustomText
                    className="mb-3 text-nowrap"
                    content={"Revenue"}
                    fontsize="12px"
                  />
                  <CustomText
                    content={
                      state.fetched_data?.currentMonthData?.revenue?.[0] || 0
                    }
                    fontsize="24px"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between rounded-3xl p-2 py-4 px-5 bg-bookingscardcolor">
              <div className="flex flex-col  ">
                <CustomText
                  className="mb-3 text-bookingstextwhitecolor opacity-70"
                  content={"Itineraries"}
                  fontsize="12px"
                />
                <CustomText
                  className="text-barcolor1"
                  content={state?.fetched_data?.total_active_itineraries || 0}
                  fontsize="24px"
                />
              </div>
              <div className="  justify-center items-center">
                <CustomButton
                  logo_path={
                    <div className="mr-3">
                      <AddIcon />
                    </div>
                  }
                  font_size={"12px"}
                  content={"Add New Itinerary"}
                  btncolor={light.signinbtnbackground}
                  onClick={() => handleAddNewItinerary()}
                />
              </div>
            </div>

            <div>
              <div className="mt-10 flex justify-between">
                <CustomText
                  content={"Recent Bookings"}
                  secondaryfontweight
                  fontsize="16px"
                  className="text-sidebarborder"
                />
                <div
                  onClick={() => router.push(PAGES.BOOKINGS)}
                  className="flex justify-center items-center mr-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                >
                  <CustomText
                    className="-mr-1"
                    content={"More"}
                    fontsize="10px"
                  />
                  <RiArrowDropRightLine size={26} color="black" />
                </div>
              </div>

              <table className="min-w-full border-collapse text-center  mt-4">
                <thead className="bg-inputbg  p-5">
                  <tr>
                    <th className="rounded-l-lg px-4 py-2">
                      <CustomText
                        content={"B. ID"}
                        fontsize="13px"
                        secondaryfontweight
                        className="text-nowrap"
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Name"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Date"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className=" px-4 py-2 text-center">
                      <CustomText
                        content={"Price"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                    <th className="rounded-r-lg px-3 py-2">
                      <CustomText
                        content={"Status"}
                        fontsize="13px"
                        secondaryfontweight
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="w-auto">
                  <tr className="h-[5px]" />
                  {(state.fetched_data?.recentTopFiveBookings || []).map(
                    (item, index) => (
                      <React.Fragment key={item?.id || index}>
                        <tr key={item.id || index}>
                          <td className=" px-1 py-2">
                            <CustomText
                              content={item?.id.slice(-5) || "NA"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className=" px-1 py-2 text-center">
                            <CustomText
                              content={item?.customer?.name || "NA"}
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className=" px-1 py-2 text-center text-nowrap">
                            <CustomText
                              content={
                                moment(item?.createdAt).format("DD MMM") || "NA"
                              }
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td className=" px-2 py-2 text-center">
                            <CustomText
                              content={
                                "₹" +
                                  item?.total_price?.toLocaleString("en-IN") +
                                  "/-" || "NA"
                              }
                              fontsize="13px"
                              secondaryfontweight
                            />
                          </td>
                          <td>
                            <div
                              className={`${
                                {
                                  SUCCESS: "bg-[#28A745]",
                                  FAILED: "bg-[#FF4D4D]",
                                  CANCELLED: "bg-[#EB5757]",
                                }[item?.transaction_status] || "bg-[#FFA500]" // Orange for pending/null status
                              } rounded-2xl py-1`}
                            >
                              <CustomText
                                content={item?.transaction_status || "Pending"}
                                className="text-white"
                                fontsize="13px"
                                secondaryfontweight
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="100%" className="p-0">
                            <hr className="w-full my-1 bg-bordercolor" />
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-dashboardbookingcard rounded-3xl mt-6 py-6 px-8">
              <CustomText
                content={"Promotional Offers Banners"}
                secondaryfontweight
                fontsize="16px"
                lineHeight="21.82px"
              />

              <div className="flex justify-between mt-6">
                <div>
                  <CustomText
                    primaryfontweight
                    content={"Active Offers"}
                    fontsize="12px"
                    lineHeight="16.37px"
                  />
                  <CustomText
                    secondaryfontweight
                    content={
                      state.fetched_data?.promotionalOffers?.activeBanners || 0
                    }
                    fontsize="24px"
                    lineHeight="32.74px"
                    className="text-sidebarborder"
                  />
                </div>
                <div>
                  <CustomText
                    primaryfontweight
                    content={"Inactive"}
                    fontsize="12px"
                    lineHeight="16.37px"
                  />
                  <CustomText
                    secondaryfontweight
                    content={
                      state.fetched_data?.promotionalOffers?.expiredBanners || 0
                    }
                    fontsize="24px"
                    lineHeight="32.74px"
                    className="text-signinbtnbackground"
                  />
                </div>
                <div>
                  <CustomText
                    primaryfontweight
                    content={"Clicks"}
                    fontsize="12px"
                    lineHeight="16.37px"
                  />
                  <CustomText
                    secondaryfontweight
                    content={
                      state.fetched_data?.promotionalOffers?.totalClicks || 0
                    }
                    fontsize="24px"
                    lineHeight="32.74px"
                    className="text-sidebarborder"
                  />
                </div>
              </div>

              <div className="w-100 mt-2 flex justify-end">
                <div className=" w-[50%] h-[30%] ">
                  <CustomButton
                    logo_path={
                      <div className="mr-3">
                        <AddIcon color="black" />
                      </div>
                    }
                    font_size={"8px"}
                    content={"Upload new banner"}
                    text_color="text-black"
                    btncolor={light.uploadbtncolor}
                    small_btn={true}
                    onClick={open_Banner_Modal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <UploadNewBannerComp state={state} setState={setState} />
        <AddNewItiComp
          state={state}
          setState={setState}
          dayintro={dayintro}
          setdayintro={setdayintro}
          hotelinfo={hotelinfo}
          sethotelinfo={sethotelinfo}
          packagedetails={packagedetails}
          setpackagedetails={setpackagedetails}
        />
      </div>
    </div>
  );
}

export default Dashboard;
