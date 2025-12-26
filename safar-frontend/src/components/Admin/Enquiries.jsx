"use client";

import CustomText from "../CustomText";
import AdminTopbar from "../AdminTopbar";
import React, { useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import ThreedotIcon from "@/_assets/svgs/logo/ThreedotIcon";
import { light } from "@/_assets/themes/themes";
import CustomModal from "../CustomModal";
import CustomSelect from "../CustomSelect";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { get } from "../../constants/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import globalSlice, { setValue } from "@/lib/globalSlice";
import PaginationComp from "../PaginationComp";
import { useRouter } from "next/navigation";
import { PAGES } from "../../constants/PagesName";
import moment from "moment";
import { localStorageHelper } from "../../helper/storageHelper";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { fetchEnquiries } from "@/lib/thunks/fetchEnquiries";

function Enquiries() {
  useAuthRedirect();

  const [state, setState] = useState({
    is_modalopen: false,
    fetched_data: [],
    current_page: 1,
    total_pages: 0,
    next_cursor_id: 0,
    prev_cursor_id: 0,
    selected_enquiry: {},
    searchTerm: "",
    filterStatus: "all",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const globalState = useSelector((state) => state.global);

  const fetch_All_Enquiries = async (next_cursor = 0) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await dispatch(fetchEnquiries());
      dispatch(setValue({ key: "to_show_loader", value: false }));
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      console.error(error);
      const err_response = error?.response?.data;
      if (
        err_response.success == false &&
        err_response.message == "VALIDATION_INVALID_TOKEN"
      ) {
        console.log("logging out");
      }
    }
  };

  const fetch_Enquiry_By_Id = async ({ id = 0 }) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const enquiry = globalState.enquiries.find((e) => e.id === id);
      if (enquiry) {
        setState((prevs) => ({
          ...prevs,
          selected_enquiry: enquiry,
          is_modalopen: true,
        }));
      }
      dispatch(setValue({ key: "to_show_loader", value: false }));
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      console.error(error);
    }
  };

  useEffect(() => {
    fetch_All_Enquiries();
  }, []);

  useEffect(() => {
    console.log("Current enquiries data:", globalState.enquiries);
  }, [globalState.enquiries]);

  const filteredEnquiries = globalState.enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      enquiry.destination
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Limit to 10 items per page (same as bookings)
  const itemsPerPage = 10;
  const startIndex = (state.current_page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);

  return (
    <div className="w-full bg-white p-16 rounded-2xl animate-fadeIn ml-0 sm:ml-60">
      <AdminTopbar
        title="Customize Enquiries Management"
        subtitle="Manage and view customer enquiries from customize itinerary forms"
      />

      {/* Search Section */}
      <div className="flex flex-wrap justify-between mt-4">
        <CustomText
          secondaryfontweight
          fontsize="16px"
          content={"List of Customize Enquiries"}
          className="text-black"
        />
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search by name, email, or destination..."
            value={state.searchTerm}
            onChange={(e) =>
              setState((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
          <CustomButton
            onClick={fetch_All_Enquiries}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm"
            content="Refresh"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-3">
        <table className="min-w-full border-collapse text-center">
          <thead className="bg-inputbg rounded-full p-5">
            <tr>
              <th className="rounded-l-lg px-4 py-2 text-center">
                <CustomText
                  content={"Customer Name"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="px-4 py-2 text-center">
                <CustomText
                  content={"Email"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="px-4 py-2 text-center">
                <CustomText
                  content={"Phone"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="px-4 py-2 text-center">
                <CustomText
                  content={"City"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="px-4 py-2 text-center">
                <CustomText
                  content={"Itinerary"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="px-4 py-2 text-center">
                <CustomText
                  content={"Travel Date"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="px-4 py-2 text-center">
                <CustomText
                  content={"Travelers"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="px-4 py-2 text-center">
                <CustomText
                  content={"Submitted On"}
                  fontsize="13px"
                  secondaryfontweight
                />
              </th>
              <th className="rounded-r-lg px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="w-auto">
            {paginatedEnquiries.length > 0 ? (
              paginatedEnquiries.map((item, index) => {
                console.log("Processing enquiry item:", item);
                return (
                  <React.Fragment key={item?.id || index}>
                    <tr>
                      {/* Customer Name */}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={item?.name || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {/* Email */}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={item?.email || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {/* Phone */}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={`+91 ${item?.phone}` || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {/* City */}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={item?.destination || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {/* Itinerary */}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={
                            item?.itinerary_title
                              ? item.itinerary_title.length > 30
                                ? item.itinerary_title.substring(0, 30) + "..."
                                : item.itinerary_title
                              : "Not specified"
                          }
                          fontsize="13px"
                          secondaryfontweight
                          className="cursor-pointer hover:text-blue-600"
                          title={
                            item?.itinerary_title || "No itinerary specified"
                          }
                        />
                      </td>
                      {/* Travel Date */}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={
                            moment(item?.travelDate).format("DD MMMM YYYY") ||
                            "NA"
                          }
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {/* Travelers */}
                      <td className="px-4 py-2 text-center">
                        <CustomText
                          content={`${item?.travelers} people` || "NA"}
                          fontsize="13px"
                          secondaryfontweight
                        />
                      </td>
                      {/* Submitted On */}
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
                      {/* Actions */}
                      <td className="px-4 py-2 text-center">
                        <div className="relative group">
                          <CustomButton
                            logo_path={<ThreedotIcon />}
                            content={""}
                          />
                          <div className="group-hover:block hidden absolute top-10 right-10 bg-white z-20 shadow-2xl shadow-[rgba(0, 0, 0, 0.25)] rounded-lg p-5 px-6 text-start">
                            <div
                              onClick={() => {
                                fetch_Enquiry_By_Id({ id: item?.id });
                              }}
                              className="mb-2 cursor-pointer transition-transform transform duration-75 active:scale-95 select-none"
                            >
                              Details
                            </div>
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
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No enquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4">
            <PaginationComp
              total_pages={totalPages}
              current_page={state.current_page}
              prevonClick={() => {
                if (state.current_page - 1 > 0) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page - 1,
                  }));
                }
              }}
              onClick={(e) => {
                setState((prevs) => ({ ...prevs, current_page: e }));
              }}
              nextonClick={() => {
                if (state.current_page + 1 <= totalPages) {
                  setState((prevs) => ({
                    ...prevs,
                    current_page: prevs.current_page + 1,
                  }));
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      <CustomModal
        open={state.is_modalopen}
        handleClose={() =>
          setState((prev) => ({ ...prev, is_modalopen: false }))
        }
        restContent={
          <div className="p-6 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <CustomText
                content="Enquiry Details"
                className="text-xl font-bold text-gray-800"
              />
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, is_modalopen: false }))
                }
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <CustomText
                  content="Customer Information"
                  className="text-lg font-semibold text-gray-800 mb-3"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomText
                      content="Name"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={state.selected_enquiry.name}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                  <div>
                    <CustomText
                      content="Email"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={state.selected_enquiry.email}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                  <div>
                    <CustomText
                      content="Phone"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={`+91 ${state.selected_enquiry.phone}`}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <CustomText
                  content="Trip Information"
                  className="text-lg font-semibold text-gray-800 mb-3"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomText
                      content="City"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={state.selected_enquiry.destination}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                  <div>
                    <CustomText
                      content="Itinerary"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={
                        state.selected_enquiry.itinerary_title ||
                        "Not specified"
                      }
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                  <div>
                    <CustomText
                      content="Travel Date"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={moment(state.selected_enquiry.travelDate).format(
                        "DD/MM/YYYY"
                      )}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                  <div>
                    <CustomText
                      content="Number of Travelers"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={`${state.selected_enquiry.travelers} people`}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Submission Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <CustomText
                  content="Submission Details"
                  className="text-lg font-semibold text-gray-800 mb-3"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomText
                      content="Submitted On"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={moment(state.selected_enquiry.createdAt).format(
                        "DD/MM/YYYY"
                      )}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                  <div>
                    <CustomText
                      content="Time"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={moment(state.selected_enquiry.createdAt).format(
                        "HH:mm"
                      )}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <CustomButton
                onClick={() =>
                  setState((prev) => ({ ...prev, is_modalopen: false }))
                }
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                content="Close"
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Enquiries;
