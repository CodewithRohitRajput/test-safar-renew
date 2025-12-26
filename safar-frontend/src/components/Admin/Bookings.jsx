"use client";

import CustomText from "../../components/CustomText";
import AdminTopbar from "../../components/AdminTopbar";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
// import AddIcon from '@/_assets/svgs/logo/AddIcon'
// import EditIcon from '@/_assets/svgs/logo/EditIcon'
import ThreedotIcon from "@/_assets/svgs/logo/ThreedotIcon";
import { light } from "@/_assets/themes/themes";
import CustomModal from "../../components/CustomModal";
import CustomSelect from "../../components/CustomSelect";
// import CustomInputFile from '../../components/CustomInputFile'
// import { MdLocationPin } from 'react-icons/md'
// import CustomRadioButtonGroup from '../../components/CustomRadioButtonGroup'
// import { Pagination, PaginationItem, styled } from '@mui/material'
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { get, patch, post, put } from "../../constants/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import globalSlice, { setValue } from "@/lib/globalSlice";
import PaginationComp from "../../components/PaginationComp";
// import CustomInput from '../../components/CustomInput'
// import CustomAccordion from '../../components/CustomAccordion'
// import { useNavigate } from 'react-router-dom'
import { useRouter } from "next/navigation";
import { PAGES } from "../../constants/PagesName";
import moment from "moment";
import { localStorageHelper } from "../../helper/storageHelper";
import useAuthRedirect from "@/hooks/useAuthRedirect";

function Bookings() {
  useAuthRedirect();

  const [state, setState] = useState({
    is_modalopen: false,
    fetched_data: [],
    current_page: 1,
    total_pages: 0,
    next_cursor_id: 0,
    prev_cursor_id: 0,
    booking_by_id_data: [],
    total_iti: [],
    total_selected_batches: [],
    selected_iti: {},
    selected_batch: {},
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const globalState = useSelector((state) => state.global);
  const fetch_All_Bookings = async (iti_id, batch_id, next_cursor = 0) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      let updated_api = API_ENDPOINTS.ADMIN.GET_ALL_BOOKINGS;
      if (iti_id != null && batch_id != null) {
        updated_api += `?itinerary_id=${iti_id}&batch_id=${batch_id}`;
      }
      if (next_cursor != null && next_cursor != 0) {
        updated_api += updated_api.includes("?")
          ? `&cursor=${next_cursor}`
          : `?cursor=${next_cursor}`;
      }
      await get(updated_api).then((d) => {
        if (d?.message == "BOOKINGS_FETCHED" && d?.success == true) {
          if (iti_id != null) {
            setState((prevs) => ({
              ...prevs,
              fetched_data: d?.data?.bookings,
              total_pages: d?.data?.totalPages,
              next_cursor_id: d.data?.nextCursor,
              prev_cursor_id: d.data?.previousCursor,
            }));
          } else {
            setState((prevs) => ({
              ...prevs,
              fetched_data: d?.data?.bookings,
              total_pages: d?.data?.totalPages,
              next_cursor_id: d.data?.nextCursor,
              prev_cursor_id: d.data?.previousCursor,
              total_iti: d?.data?.itineraries,
            }));
          }
          dispatch(setValue({ key: "to_show_loader", value: false }));
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
  const fetch_Bookings_Id = async ({ id = 0 }) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await get(API_ENDPOINTS.ADMIN.GET_BOOKINGS_BY_ID + "/" + id).then((d) => {
        if (d?.message == "BOOKING_FETCHED" && d?.success == true) {
          dispatch(setValue({ key: "to_show_loader", value: false }));
          setState((prevs) => ({
            ...prevs,
            booking_by_id_data: d?.data,
            is_modalopen: true,
          }));
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
  const PersonCard = ({ item, index }) => {
    return (
      <div className="bg-[#FAFAFA] border-2 border-[#EEEEEE] p-5 mt-4 rounded-md">
        <div>
          <div className="flex justify-start my-2">
            <CustomText
              secondaryfontweight
              fontsize="15px"
              content={`Person ${index + 1}:`}
              className="text-black"
            />
          </div>
          <div className=" w-full mx-4 pr-4">
            <div className="flex w-full justify-around my-1">
              <div className="flex w-full mr-8">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Full Name : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.name}
                  className="text-black text-nowrap"
                />
              </div>
              <div className="flex w-full">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Base City : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.base_city}
                  className="text-black text-nowrap"
                />
              </div>
              <div className="flex w-full">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Age :"}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.age}
                  className="text-black text-nowrap"
                />
              </div>
            </div>
            <div className="flex w-full justify-around my-1">
              <div className="flex w-full ">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Contact No. : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.phone}
                  className="text-black text-nowrap"
                />
              </div>
              <div className="flex w-full">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Email Address : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.email}
                  className="text-black text-nowrap"
                />
              </div>
            </div>
            <div className="flex w-full justify-around my-1">
              <div className="flex w-full mr-8">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Instagram ID : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.instagram}
                  className="text-black text-nowrap"
                />
              </div>
              <div className="flex w-full">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Ref. : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.refer}
                  className="text-black text-nowrap"
                />
              </div>
              <div className="flex w-full">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Package : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.package_name}
                  className="text-black text-nowrap"
                />
              </div>
            </div>
            <div className="flex w-full justify-around my-1">
              <div className="flex w-full mr-8">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Starting : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.starting_point}
                  className="text-black text-nowrap"
                />
              </div>
              <div className="flex w-full">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={"Dropping : "}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.drop_point}
                  className="text-black text-nowrap"
                />
              </div>
              {/* <div className="flex w-full">
                <CustomText
                  primaryfontweight
                  fontsize="13px"
                  content={'Booking Price : '}
                  className="text-black text-nowrap"
                />
                <CustomText
                  fontsize="13px"
                  content={item?.total_amount}
                  className="text-black text-nowrap"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    fetch_All_Bookings();
  }, []);
  return (
    <div className=" h-screen w-full flex  bg-white">
      <div className="w-full bg-white p-16 rounded-2xl animate-fadeIn ml-0 sm:ml-60 ">
        <AdminTopbar topbar_title={"Bookings"} />
        <div className="flex mt-4 ">
          <div className="flex gap-4 w-full">
            <div className="w-full">
              <CustomSelect
                fontSize={"11px"}
                option_data={[...state.total_iti]}
                top_title={"Itineray"}
                border_color="rgba(110, 118, 132, 0.33)"
                padding="10px"
                content_destruct={(item) => (
                  <CustomText content={item?.title ? item.title : item} />
                )}
                selectedValue={state.selected_iti}
                onChange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    selected_iti: e,
                    total_selected_batches: e?.batches,
                  }))
                }
              />
            </div>
            <div className="w-full">
              <CustomSelect
                fontSize={"11px"}
                option_data={[...state.total_selected_batches]}
                top_title={"Batches"}
                border_color="rgba(110, 118, 132, 0.33)"
                padding="10px"
                selectedValue={state.selected_batch}
                content_destruct={(item) => (
                  <CustomText
                    content={
                      item?.start_date
                        ? moment(item.start_date).format("DD MMMM YYYY")
                        : item
                    }
                  />
                )}
                onChange={(e) =>
                  setState((prevs) => ({
                    ...prevs,
                    selected_batch: e,
                  }))
                }
              />
            </div>
          </div>
          <div className=" w-full mt-8 ml-10 mx-56">
            <CustomButton
              content={"Search"}
              btncolor={light.signinbtnbackground}
              small_btn={false}
              md_round={false}
              pill_rounded={true}
              padding="p-[11px]"
              onClick={() => {
                if (state.selected_iti?.id && state.selected_batch?.id) {
                  fetch_All_Bookings(
                    state.selected_iti?.id || null,
                    state.selected_batch?.id || null,
                    null
                  );
                }
              }}
            />
          </div>
        </div>
        <div className="flex justify-end  mt-8  cursor-pointer select-none">
          <div
            className="transition-transform transform duration-75 active:scale-95"
            onClick={() =>
              fetch_All_Bookings().then(() => {
                setState((prevs) => ({
                  ...prevs,
                  selected_iti: {},
                  selected_batch: {},
                  current_page: 1,
                }));
              })
            }
          >
            <CustomText
              content={"Reload Booking Content"}
              className="rounded-full bg-signinbtnbackground py-2 px-4 text-white"
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-between mt-4">
          <CustomText
            secondaryfontweight
            fontsize="16px"
            content={"List of Bookings"}
            className="text-black"
          />
          <CustomSelect
            fontSize={"11px"}
            option_data={["Last 7 days"]}
            border_color="rgba(110, 118, 132, 0.33)"
            padding="2px"
            to_disable={true}
            // onChange={(e) =>
            //   setState((prevs) => ({
            //     ...prevs,
            //     role: e
            //   }))
            // }
          />
          {/* <div className="  justify-center items-center">
            <CustomButton
              logo_path={
                <div className="mr-3">
                  <AddIcon />
                </div>
              }
              content={'Add Admin'}
              btncolor={light.signinbtnbackground}
              onClick={() =>
                setState((prevs) => ({
                  ...prevs,
                  is_modalopen: !prevs.is_modalopen
                }))
              }
            />
          </div> */}
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="min-w-full border-collapse text-center  ">
            <thead className="bg-inputbg rounded-full p-5">
              <tr>
                <th className="rounded-l-lg px-4 py-2 text-center">
                  <CustomText
                    content={"List of Bookings"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={"Full Name"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={"Booking Date"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={"Starting Point"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={"Dropping Point"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={"Amount Received"}
                    fontsize="13px"
                    secondaryfontweight
                  />
                </th>
                <th className=" px-4 py-2 text-center">
                  <CustomText
                    content={"Total Amount"}
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
                <th className="rounded-r-lg px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="w-auto">
              {state.fetched_data?.length > 0 ? (
                state.fetched_data?.map((item, index) => (
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
                          content={item?.customer?.name || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={
                            moment(item?.createdAt).format("DD MMMM YYYY") ||
                            "NA"
                          }
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={item?.customer?.starting_point || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={item?.customer?.drop_point || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={
                            "₹" +
                              item?.paid_amount?.toLocaleString("en-IN") +
                              "/-" || "NA"
                          }
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
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
                      <td className="px-4 py-2 text-center">
                        <div
                          className={`${
                            {
                              SUCCESS: "bg-[#28A745]",
                              FAILED: "bg-[#FF4D4D]",
                              CANCELLED: "bg-[#EB5757]",
                            }[item?.transaction_status] || "bg-[#FFA500]" 
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

                      <td className="group relative px-4 py-2 w-2 mx-auto">
                        <CustomButton
                          logo_path={<ThreedotIcon />}
                          content={""}
                        />
                        <div className="group-hover:block hidden absolute top-10 right-10 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                          <div
                            onClick={() => {
                              fetch_Bookings_Id({ id: item?.id });
                            }}
                            className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                          >
                            Details
                          </div>
                          {/* <div className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                            Inactive
                          </div>

                          <div className="text-deletetextcolor cursor-pointer transition-transform transform duration-75 active:scale-95 select-none">
                            Delete
                          </div> */}
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

          <div className="flex justify-end ">
            <PaginationComp
              total_pages={state.total_pages}
              current_page={state.current_page}
              prevonClick={() => {
                if (
                  state.current_page - 1 != 0 &&
                  state.prev_cursor_id?.length > 0 &&
                  globalState.to_show_loader == false
                ) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page - 1,
                  }));
                  fetch_All_Bookings(null, null, state.prev_cursor_id);
                }
              }}
              onClick={(e) => {
                if (
                  state.current_page != e &&
                  state.next_cursor_id?.length > 0 &&
                  state.current_page + 1 == e &&
                  globalState.to_show_loader == false
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }));
                  fetch_All_Bookings(null, null, state.next_cursor_id);
                } else if (
                  state.current_page != e &&
                  state.prev_cursor_id?.length > 0 &&
                  state.current_page - 1 == e
                ) {
                  setState((prevs) => ({ ...prevs, current_page: e }));
                  fetch_All_Bookings(null, null, state.prev_cursor_id);
                }
              }}
              nextonClick={() => {
                if (
                  state.current_page + 1 <= state.total_pages &&
                  state.next_cursor_id?.length > 0 &&
                  globalState.to_show_loader == false
                ) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page + 1,
                  }));
                  fetch_All_Bookings(null, null, state.next_cursor_id);
                }
              }}
            />
          </div>
        </div>
        <CustomModal
          open={state.is_modalopen}
          handleClose={() =>
            setState((prevs) => ({ ...prevs, is_modalopen: false }))
          }
          title="Booking Details"
          modalSize="large"
          // title={
          // ''
          // }
          // description={
          //   'Here is the short description of corporate trip create a new category by filling out details.  '
          // }
          restContent={
            <div>
              <div className="text-start">
                <span className="text-start w-full">
                  <strong>Booking ID: </strong>
                  {state.booking_by_id_data?.id?.slice(-5)}
                </span>
                <div className="flex justify-start items-center mt-2">
                  <CustomText
                    content={"Itinerary Name: "}
                    className="font-bold pr-1"
                  />
                  <CustomText
                    content={state.booking_by_id_data?.itinerary?.title}
                  />
                </div>
                <div className="flex justify-start items-center mt-2">
                  <CustomText
                    content={"Start Date: "}
                    className="font-bold pr-1"
                  />
                  <CustomText
                    content={
                      state.booking_by_id_data?.itinerary?.batches?.[0]
                        ?.start_date != undefined
                        ? moment(
                            state.booking_by_id_data?.itinerary?.batches?.[0]
                              ?.start_date
                          ).format("DD MMMM YYYY")
                        : "Batch Date"
                    }
                  />
                </div>
              </div>
              {state.booking_by_id_data?.travellers?.length > 0 ||
              state.booking_by_id_data?.customer != null ? (
                [
                  ...state.booking_by_id_data?.travellers,
                  state.booking_by_id_data?.customer,
                ]?.map((item, index) => (
                  <PersonCard key={index} item={item} index={index} />
                ))
              ) : (
                <div className="mt-4">
                  <CustomText
                    content={"No data available"}
                    className="text-black"
                  />
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Bookings;
