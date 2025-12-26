"use client";

import CustomText from "../CustomText";
import AdminTopbar from "../AdminTopbar";
import React, { useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import ThreedotIcon from "@/_assets/svgs/logo/ThreedotIcon";
import { light } from "@/_assets/themes/themes";
import CustomModal from "../CustomModal";
import CustomSelect from "../CustomSelect";
import { get } from "../../constants/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import globalSlice, {
  setValue,
  setInstalinkEnquiries,
} from "@/lib/globalSlice";
import PaginationComp from "../PaginationComp";
import { useRouter } from "next/navigation";
import { PAGES } from "../../constants/PagesName";
import moment from "moment";
import { localStorageHelper } from "../../helper/storageHelper";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { fetchInstalinkEnquiries } from "@/lib/thunks/fetchInstalinkEnquiries";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { put } from "../../constants/axiosClient";
import { fetchInstaLinkData } from "@/lib/thunks/fetchInstaLinkData";
import { post } from "../../constants/axiosClient";

function Leads() {
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
    convertedLeads: [],
    showAddRemarkModal: false,
    selectedLeadForRemark: null,
    editingRemark: null,
    tempRemarkText: "",
    leadStatus: "all",
    reminderToggle: false,
    reminderTime: "",
    individualLeadStatus: {},
    individualEnquiryStatus: {},
    showLeadStagesModal: false,
    showAddEnquiryModal: false,
    showActionsDropdown: false,
    selectAll: false,
    selectedLeads: [],
    enquiryForm: {
      name: "",
      phone: "",
      event: "",
      batch: "",
      guests: "",
      message: "",
    },
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const globalState = useSelector((state) => state.global);

  // Lead status options
  const leadStatusOptions = [
    { value: "all", label: "All" },
    { value: "hot", label: "Hot" },
    { value: "warm", label: "Warm" },
    { value: "cold", label: "Cold" },
    { value: "reminder", label: "Reminder" },
  ];

  const leadStatusDropdownOptions = [
    { value: "hot", label: "Hot" },
    { value: "warm", label: "Warm" },
    { value: "cold", label: "Cold" },
  ];

  // Quick action options
  const enquiryStatusOptions = [
    { value: "new_enquiry", label: "New Enquiry" },
    { value: "call_not_pick", label: "Call Not Pick" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "plan_quote_sent", label: "Plan & Quote Sent" },
    { value: "in_pipeline", label: "In Pipeline" },
    { value: "negotiating", label: "Negotiating" },
    { value: "awaiting_payment", label: "Awaiting Payment" },
    { value: "booked", label: "Booked" },
    { value: "lost_closed", label: "Lost & Closed" },
    { value: "future_prospect", label: "Future Prospect" },
  ];

  // Lead Stages data
  const leadStagesData = [
    {
      stage: "New Enquiry",
      description: "A new enquiry has been logged into the Instalink",
    },
    {
      stage: "Call Not Picked",
      description: "You've tried contacting but they've been unresponsive.",
    },
    {
      stage: "Contacted",
      description:
        "You've contacted the lead but yet to lock all the requirements.",
    },
    {
      stage: "Qualified",
      description:
        "You were able to have a meaningful discovery call with the lead and have locked the requirement.",
    },
    {
      stage: "Plan & Quote Sent",
      description:
        "You've shared the plan details and the quote with cost break up.",
    },
    {
      stage: "In Pipeline",
      description:
        "The lead is still pondering and hasn't started negotiating yet.",
    },
    {
      stage: "Negotiating",
      description: "The lead is now hot and can be converted.",
    },
    {
      stage: "Awaiting Payment",
      description:
        "You've closed negotiations and sent the booking link. Payment is awaited.",
    },
    {
      stage: "Booked",
      description: "Lead is now your guest, Congratulations!",
    },
    {
      stage: "Lost & Closed",
      description: "Standard archive bucket.",
    },
    {
      stage: "Future Prospect",
      description:
        "You've tried contacting but they're looking for some future dates.",
    },
  ];
  const fetch_All_Leads = async (next_cursor = 0) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      await dispatch(fetchInstalinkEnquiries());
      dispatch(setValue({ key: "to_show_loader", value: false }));
    } catch (error) {
      dispatch(setValue({ key: "to_show_loader", value: false }));
      console.error(error);
    }
  };

  const handleOpenAddEnquiry = () => {
    setState((prev) => ({
      ...prev,
      showAddEnquiryModal: true,
      showActionsDropdown: false,
    }));
  };

  const handleCloseAddEnquiry = () => {
    setState((prev) => ({
      ...prev,
      showAddEnquiryModal: false,
      enquiryForm: {
        name: "",
        phone: "",
        event: "",
        batch: "",
        guests: "",
        message: "",
      },
    }));
  };

  const handleEnquiryFormChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      enquiryForm: {
        ...prev.enquiryForm,
        [field]: value,
      },
    }));
  };

  const handleUpdateEnquiry = async () => {
    if (
      !state.enquiryForm.name ||
      !state.enquiryForm.phone ||
      !state.enquiryForm.event
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Find the selected itinerary
      const selectedItinerary = globalState.instaLinkData.itineraries.find(
        (it) => it.id === state.enquiryForm.event
      );

      if (!selectedItinerary) {
        alert("Selected itinerary not found");
        return;
      }

      console.log("Selected itinerary:", selectedItinerary); // Debug log

      const enquiryData = {
        name: state.enquiryForm.name,
        email: "instalink@example.com",
        phone: state.enquiryForm.phone,
        destination:
          selectedItinerary.city ||
          selectedItinerary.destination ||
          "Not specified",
        travelDate: new Date().toISOString(),
        travelers: parseInt(state.enquiryForm.guests) || 1,
        itinerary_title: selectedItinerary.title || "",
        itinerary_image: selectedItinerary.thumbnail || "",
        itinerary_id: state.enquiryForm.event,
        batch_id: state.enquiryForm.batch || null,
        enquiry_type: "instalink",
        callback_request: false,
        remark: state.enquiryForm.message || null,
      };

      console.log("Sending enquiry data:", enquiryData);

      const response = await post(
        API_ENDPOINTS.USERS.INSTALINK_ENQUIRY,
        enquiryData
      );

      console.log("API Response:", response);

      if (response.success) {
        // Use the actual data returned from the API
        const apiEnquiry = response.data;

        // Create a properly formatted enquiry object for local state
        const detailedEnquiry = {
          id: apiEnquiry.id || Date.now().toString(),
          name: apiEnquiry.name,
          phone: apiEnquiry.phone,
          email: apiEnquiry.email || "",
          destination: apiEnquiry.destination || "",
          travelDate: new Date(apiEnquiry.travelDate),
          travelers: apiEnquiry.travelers || 1,
          itinerary_title: apiEnquiry.itinerary_title || "",
          itinerary_image: apiEnquiry.itinerary_image || "",
          itinerary_id: apiEnquiry.itinerary_id || "",
          batch_id: apiEnquiry.batch_id || null,
          enquiry_type: apiEnquiry.enquiry_type || "instalink",
          callback_request: apiEnquiry.callback_request || false,
          remark: apiEnquiry.remark || "", // Only show remark if it exists
          createdAt: new Date(apiEnquiry.createdAt || new Date()).toISOString(),
        };

        // Add to local state for immediate display
        const updatedEnquiries = [
          ...globalState.instalinkEnquiries,
          detailedEnquiry,
        ];
        dispatch(setInstalinkEnquiries(updatedEnquiries));

        // Reset form and close modal
        handleCloseAddEnquiry();

        alert("Enquiry created successfully!");
      } else {
        console.error("API Error:", response);
        alert(
          `Failed to create enquiry: ${response.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error creating enquiry:", error);
      alert("Failed to create enquiry. Please try again.");
    }
  };

  const handleConvertToggle = (leadId) => {
    setState((prev) => {
      const newConvertedLeads = prev.convertedLeads.includes(leadId)
        ? prev.convertedLeads.filter((id) => id !== leadId)
        : [...prev.convertedLeads, leadId];

      localStorage.setItem("convertedLeads", JSON.stringify(newConvertedLeads));

      return {
        ...prev,
        convertedLeads: newConvertedLeads,
      };
    });
  };

  const handleAddRemark = (leadId) => {
    setState((prev) => ({
      ...prev,
      showAddRemarkModal: true,
      selectedLeadForRemark: leadId,
      editingRemark: leadId,
      tempRemarkText: "",
    }));
  };

  const handleSaveRemark = async () => {
    if (state.selectedLeadForRemark && state.tempRemarkText.trim()) {
      try {
        const response = await put(API_ENDPOINTS.ADMIN.UPDATE_LEAD_REMARK, {
          leadId: state.selectedLeadForRemark,
          remark: state.tempRemarkText.trim(),
          reminder: state.reminderToggle,
          reminderTime: state.reminderToggle ? state.reminderTime : null,
        });

        if (response.success) {
          const updatedEnquiries = globalState.instalinkEnquiries.map(
            (enquiry) =>
              enquiry.id === state.selectedLeadForRemark
                ? {
                    ...enquiry,
                    remark: state.tempRemarkText.trim(),
                    reminder: state.reminderToggle,
                    reminderTime: state.reminderToggle
                      ? state.reminderTime
                      : null,
                  }
                : enquiry
          );

          dispatch(setInstalinkEnquiries(updatedEnquiries));

          // Save reminder data to localStorage
          if (state.reminderToggle && state.reminderTime) {
            const savedReminders = JSON.parse(
              localStorage.getItem("leadReminders") || "{}"
            );
            savedReminders[state.selectedLeadForRemark] = {
              reminder: state.reminderToggle,
              reminderTime: state.reminderTime,
            };
            localStorage.setItem(
              "leadReminders",
              JSON.stringify(savedReminders)
            );
          } else {
            // Remove reminder if toggle is off
            const savedReminders = JSON.parse(
              localStorage.getItem("leadReminders") || "{}"
            );
            delete savedReminders[state.selectedLeadForRemark];
            localStorage.setItem(
              "leadReminders",
              JSON.stringify(savedReminders)
            );
          }

          setState((prev) => ({
            ...prev,
            showAddRemarkModal: false,
            selectedLeadForRemark: null,
            editingRemark: null,
            tempRemarkText: "",
            reminderToggle: false,
            reminderTime: "",
          }));
        } else {
          console.error("Failed to update remark:", response);
          alert("Failed to save remark. Please try again.");
        }
      } catch (error) {
        console.error("Error updating remark:", error);
        alert("Failed to save remark. Please try again.");
      }
    }
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    setState((prev) => {
      const newSelectAll = !prev.selectAll;
      let newSelectedLeads = [];

      if (newSelectAll) {
        // Select all visible leads
        newSelectedLeads = paginatedLeads.map((lead) => lead.id);
      }

      return {
        ...prev,
        selectAll: newSelectAll,
        selectedLeads: newSelectedLeads,
      };
    });
  };

  const handleIndividualSelect = (leadId) => {
    setState((prev) => {
      const isSelected = prev.selectedLeads.includes(leadId);
      let newSelectedLeads;

      if (isSelected) {
        newSelectedLeads = prev.selectedLeads.filter((id) => id !== leadId);
      } else {
        newSelectedLeads = [...prev.selectedLeads, leadId];
      }

      const allSelected = newSelectedLeads.length === paginatedLeads.length;

      return {
        ...prev,
        selectedLeads: newSelectedLeads,
        selectAll: allSelected,
      };
    });
  };
  const handleLeadStatusChange = (leadId, newStatus) => {
    setState((prev) => ({
      ...prev,
      individualLeadStatus: {
        ...prev.individualLeadStatus,
        [leadId]: newStatus,
      },
    }));

    // Save to localStorage
    const updatedStatus = {
      ...state.individualLeadStatus,
      [leadId]: newStatus,
    };
    localStorage.setItem("individualLeadStatus", JSON.stringify(updatedStatus));
  };

  const handleCancelRemark = () => {
    setState((prev) => ({
      ...prev,
      showAddRemarkModal: false,
      selectedLeadForRemark: null,
      editingRemark: null,
      tempRemarkText: "",
      reminderToggle: false,
      reminderTime: "",
    }));
  };

  const handleOpenLeadStages = () => {
    setState((prev) => ({
      ...prev,
      showLeadStagesModal: true,
    }));
  };

  const handleCloseLeadStages = () => {
    setState((prev) => ({
      ...prev,
      showLeadStagesModal: false,
    }));
  };

  const fetch_Lead_By_Id = async ({ id = 0 }) => {
    dispatch(setValue({ key: "to_show_loader", value: true }));
    try {
      const enquiry = globalState.instalinkEnquiries.find((e) => e.id === id);
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

  // Helper function to get channel tag
  const getChannelTag = (enquiry) => {
    // You can customize this logic based on your data
    if (enquiry.enquiry_type === "instalink") return "Instalink";
    if (enquiry.enquiry_type === "itinerary") return "Itinerary";
    if (enquiry.phone) return "WhatsApp";
    return "Website";
  };

  const getLeadStatus = (enquiry) => {
    if (enquiry.reminder && enquiry.reminderTime) {
      return "reminder";
    }
    if (state.individualLeadStatus[enquiry.id]) {
      return state.individualLeadStatus[enquiry.id];
    }
    if (state.convertedLeads.includes(enquiry.id)) return "hot";
    if (enquiry.callback_request) return "warm";
    return "cold";
  };
  useEffect(() => {
    if (globalState.instalinkEnquiries.length === 0) {
      fetch_All_Leads();
    }
  }, []);
  useEffect(() => {
    console.log("Current leads data:", globalState.instalinkEnquiries);
  }, [globalState.instalinkEnquiries]);

  useEffect(() => {
    const savedConvertedLeads = localStorage.getItem("convertedLeads");
    if (savedConvertedLeads) {
      setState((prev) => ({
        ...prev,
        convertedLeads: JSON.parse(savedConvertedLeads),
      }));
    }
  }, []);

  const filteredLeads = globalState.instalinkEnquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      enquiry.destination
        .toLowerCase()
        .includes(state.searchTerm.toLowerCase());

    const matchesStatus =
      state.leadStatus === "all" || getLeadStatus(enquiry) === state.leadStatus;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const savedLeadStatus = localStorage.getItem("individualLeadStatus");
    const savedEnquiryStatus = localStorage.getItem("individualEnquiryStatus");

    if (savedLeadStatus) {
      setState((prev) => ({
        ...prev,
        individualLeadStatus: JSON.parse(savedLeadStatus),
      }));
    }

    if (savedEnquiryStatus) {
      setState((prev) => ({
        ...prev,
        individualEnquiryStatus: JSON.parse(savedEnquiryStatus),
      }));
    }
  }, []);

  useEffect(() => {
    if (state.enquiryForm.event) {
      setState((prev) => ({
        ...prev,
        enquiryForm: {
          ...prev.enquiryForm,
          batch: "",
        },
      }));
    }
  }, [state.enquiryForm.event]);

  useEffect(() => {
    if (globalState.instalinkEnquiries.length > 0) {
      const savedReminders = localStorage.getItem("leadReminders");
      if (savedReminders) {
        const reminders = JSON.parse(savedReminders);
        const hasReminderData = globalState.instalinkEnquiries.some(
          (enquiry) => enquiry.reminder !== undefined
        );

        if (!hasReminderData) {
          const updatedEnquiries = globalState.instalinkEnquiries.map(
            (enquiry) => {
              if (reminders[enquiry.id]) {
                return {
                  ...enquiry,
                  reminder: reminders[enquiry.id].reminder,
                  reminderTime: reminders[enquiry.id].reminderTime,
                };
              }
              return enquiry;
            }
          );
          dispatch(setInstalinkEnquiries(updatedEnquiries));
        }
      }
    }
  }, [globalState.instalinkEnquiries.length]);

  useEffect(() => {
    if (globalState.instaLinkData.itineraries.length === 0) {
      dispatch(fetchInstaLinkData());
    }
  }, [dispatch, globalState.instaLinkData.itineraries.length]);
  const itemsPerPage = 10;
  const startIndex = (state.current_page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <div className="w-full  max-w-[1110px] bg-white p-16 rounded-2xl animate-fadeIn ml-0 sm:ml-60">
      <AdminTopbar
        title="Instalink Leads"
        subtitle="Manage and view customer leads from all channels"
      />
      <div className="mb-2 mt-2">
        <h1 className="text-4xl font-bold text-gray-900">Instalink Leads</h1>
      </div>

      {/* Statistics Cards */}
      <div className="flex gap-4 mb-4 mt-3 h-[100px]">
        {/* Overall Leads Captured */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-[355px]">
          <div className="flex flex-col">
            <p className="text-sm font-normal text-gray-600 mb-2">
              Overall Leads Captured
            </p>
            <p className="text-2xl font-normal text-gray-800">
              {globalState.instalinkEnquiries.length}
            </p>
          </div>
        </div>

        {/* Today's Leads */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-80">
          <div className="flex flex-col">
            <p className="text-sm font-normal text-gray-600 mb-2">
              Today's Leads
            </p>
            <p className="text-2xl font-normal text-gray-800">
              {
                globalState.instalinkEnquiries.filter((lead) => {
                  const today = new Date();
                  const leadDate = new Date(lead.createdAt);
                  return leadDate.toDateString() === today.toDateString();
                }).length
              }
            </p>
          </div>
        </div>

        {/* Overall Leads Converted */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-80">
          <div className="flex flex-col">
            <p className="text-sm font-normal text-gray-600 mb-2">
              Overall Leads Converted
            </p>
            <p className="text-2xl font-normal text-gray-800">
              {state.convertedLeads.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Actions Row */}
      <div className="flex flex-col lg:flex-row justify-start items-start lg:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-[830px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={state.searchTerm}
              onChange={(e) =>
                setState((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <CustomButton
            onClick={handleOpenAddEnquiry}
            text_color="text-black"
            className="bg-white hover:bg-gray-100 text-black border border-gray-300 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap font-sans"
            content="Add Enquiry"
          />
          <CustomButton
            onClick={fetch_All_Leads}
            text_color="text-black"
            className="bg-white hover:bg-gray-100 text-black border border-gray-300 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap font-sans"
            content="Refresh"
          />
        </div>
      </div>

      {/* Lead Status Filters - Moved below search bar */}
      <div className="mb-4 flex justify-between items-center flex-wrap">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {leadStatusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setState((prev) => ({ ...prev, leadStatus: option.value }))
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                state.leadStatus === option.value
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Lead Count Text */}
        <p className="text-sm text-black mt-1">
          Showing {paginatedLeads.length} lead(s) out of {filteredLeads.length}
        </p>
      </div>

      {/* Table */}
      <div className="w-full max-w-[1025px] bg-white rounded-2xl animate-fadeIn ml-0 ">
        <table className="min-w-full rounded-lg border-collapse border border-gray-300">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={state.selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-black"
                />
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No.
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Details
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enquiry Details
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks & Reminders
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quick Actions
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CallBack Request
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((item, index) => {
                const isConverted = state.convertedLeads.includes(item.id);
                const channelTag = getChannelTag(item);
                const leadStatus = getLeadStatus(item);
                const leadStatusColor = {
                  hot: "bg-red-100 text-red-800",
                  warm: "bg-yellow-100 text-yellow-800",
                  cold: "bg-blue-100 text-blue-800",
                  reminder: "bg-orange-100 text-orange-800",
                };

                return (
                  <tr
                    key={item?.id || index}
                    className={`relative ${
                      isConverted ? "bg-green-50" : "hover:bg-gray-50"
                    } border-b border-gray-300`}
                  >
                    {/* Colored Vertical Line - Absolute positioned to cover full row */}
                    {/* {state.individualLeadStatus[item.id] && (
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          state.individualLeadStatus[item.id] === "hot"
                            ? "bg-red-500"
                            : state.individualLeadStatus[item.id] === "warm"
                              ? "bg-yellow-500"
                              : state.individualLeadStatus[item.id] === "cold"
                                ? "bg-blue-500"
                                : state.individualLeadStatus[item.id] ===
                                    "reminder"
                                  ? "bg-orange-500"
                                  : "bg-black"
                        }`}
                      />
                    )} */}

                    {/* Checkbox */}

                    <td className="px-2 py-2 whitespace-nowrap relative">
                      <input
                        type="checkbox"
                        checked={state.selectedLeads.includes(item.id)}
                        onChange={() => handleIndividualSelect(item.id)}
                        className="rounded border-black  text-black focus:ring-black"
                      />

                      {/* Colored Vertical Line - Positioned within the checkbox cell */}
                      {state.individualLeadStatus[item.id] && (
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${
                            state.individualLeadStatus[item.id] === "hot"
                              ? "bg-red-500"
                              : state.individualLeadStatus[item.id] === "warm"
                                ? "bg-yellow-500"
                                : state.individualLeadStatus[item.id] === "cold"
                                  ? "bg-blue-500"
                                  : state.individualLeadStatus[item.id] ===
                                      "reminder"
                                    ? "bg-orange-500"
                                    : "bg-white"
                          }`}
                        />
                      )}
                    </td>

                    {/* S.No */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>

                    {/* Lead Details */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {/* Name */}
                        <div className="text-sm font-semibold text-gray-900 underline">
                          {item?.name || "NA"}
                        </div>

                        {/* Channel Tag - Pink with Instagram icon */}
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-normal ${
                              channelTag === "Instalink"
                                ? "bg-pink-600 text-white"
                                : channelTag === "Itinerary"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-600 text-white"
                            }`}
                          >
                            <svg
                              className="w-2 h-2 mr-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {channelTag === "Instalink" ? (
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                              ) : (
                                <path d="M9 2v2H7v14h14V4h-2V2h-2v2h-6V2H9zm0 4h10v10H9V6z" />
                              )}
                            </svg>
                            {channelTag}
                          </span>
                        </div>

                        {/* Timestamp with clock icon - Black color */}
                        <div className="flex items-center space-x-1 text-xs text-black">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>
                            {(() => {
                              const date = new Date(item?.createdAt);
                              const now = new Date();
                              const today = new Date(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate()
                              );
                              const leadDate = new Date(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate()
                              );

                              if (leadDate.getTime() === today.getTime()) {
                                return `Today at ${date.toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}`;
                              } else {
                                return date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                });
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Enquiry Details */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {/* Contact Details */}
                        {item?.phone && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-black underline">
                              {item.phone}
                            </span>
                            <span className="text-black-400">|</span>
                            <a
                              href={`https://wa.me/91${item.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-500 hover:text-green-600"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                              </svg>
                            </a>
                            <a
                              href={`tel:+91${item.phone}`}
                              className="text-gray-500 hover:text-gray-600"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                              </svg>
                            </a>
                          </div>
                        )}

                        {/* Itinerary Name - Multi-line with old font styling */}
                        {item?.itinerary_title && (
                          <div className="text-xs text-black">
                            {item.itinerary_title
                              .split(" ")
                              .map((word, index) => (
                                <span key={index}>
                                  {word}
                                  {(index + 1) % 2 === 0 &&
                                    index <
                                      item.itinerary_title.split(" ").length -
                                        1 && <br />}
                                </span>
                              ))}
                          </div>
                        )}

                        {/* Number of Travelers - Like the image you shared */}
                        {item?.travelers && (
                          <div className="flex items-center space-x-1 text-xs text-black">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>{item.travelers} Pax</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Remarks & Reminders */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {/* Add Remark Button */}
                        <button
                          onClick={() => handleAddRemark(item.id)}
                          className="flex items-center space-x-2 text-black hover:text-black"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-black text-xs font-bold">
                              +
                            </span>
                          </div>
                          <span className="text-xs underline">Add Remark</span>
                        </button>

                        {/* Existing Remark with heading */}
                        {item?.remark && (
                          <div className="text-xs text-black font-medium">
                            <div className="flex items-center space-x-1">
                              <span>Remark:</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {item.remark}
                            </div>
                          </div>
                        )}

                        {/* Reminder Information */}
                        {item?.reminder && item?.reminderTime && (
                          <div className="text-xs text-black font-medium">
                            <div className="flex items-center space-x-1">
                              <span className="text-black">🔔</span>
                              <span>Reminder:</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {new Date(item.reminderTime).toLocaleString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {/* First Dropdown - Lead Status */}
                        <select
                          className="text-xs border border-black rounded px-2 py-1 focus:outline-none focus:ring-1 w-28"
                          value={state.individualLeadStatus[item.id] || ""}
                          onChange={(e) => {
                            setState((prev) => ({
                              ...prev,
                              individualLeadStatus: {
                                ...prev.individualLeadStatus,
                                [item.id]: e.target.value,
                              },
                            }));
                            // Save to localStorage
                            const updatedStatus = {
                              ...state.individualLeadStatus,
                              [item.id]: e.target.value,
                            };
                            localStorage.setItem(
                              "individualLeadStatus",
                              JSON.stringify(updatedStatus)
                            );
                          }}
                        >
                          <option value="">Lead Status</option>
                          {leadStatusDropdownOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className=" bg-white text-black"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {/* Second Dropdown - Enquiry Status */}
                        <select
                          className="text-xs border border-black rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-black w-28"
                          value={state.individualEnquiryStatus[item.id] || ""}
                          onChange={(e) => {
                            setState((prev) => ({
                              ...prev,
                              individualEnquiryStatus: {
                                ...prev.individualEnquiryStatus,
                                [item.id]: e.target.value,
                              },
                            }));
                            // Save to localStorage
                            const updatedStatus = {
                              ...state.individualEnquiryStatus,
                              [item.id]: e.target.value,
                            };
                            localStorage.setItem(
                              "individualEnquiryStatus",
                              JSON.stringify(updatedStatus)
                            );
                          }}
                        >
                          <option value="">New...</option>
                          {enquiryStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={handleOpenLeadStages}
                          className="text-xs text-black hover:text-black flex items-center space-x-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>More</span>
                        </button>
                      </div>
                    </td>

                    {/* CallBack Request */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-xs text-black">
                        {item?.callback_request ? "Yes" : "No"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap ">
                      <div className="flex flex-col space-y-1">
                        <button className="bg-black text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                          Actions
                        </button>
                        {/* <button className="text-xs text-black hover:text-black flex items-center space-x-1 underline">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>AI Insights</span>
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
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

      {/* Lead Detail Modal - Keep existing modal */}
      <CustomModal
        open={state.is_modalopen}
        handleClose={() =>
          setState((prev) => ({ ...prev, is_modalopen: false }))
        }
        restContent={
          <div className="p-6 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <CustomText
                content="Lead Details"
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
                  <div>
                    <CustomText
                      content="Callback Request"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={
                        state.selected_enquiry.callback_request ? "Yes" : "No"
                      }
                      className={`text-base mt-1 ${
                        state.selected_enquiry.callback_request
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
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

              {/* Additional Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <CustomText
                  content="Additional Information"
                  className="text-lg font-semibold text-gray-800 mb-3"
                />
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <CustomText
                      content="Remark"
                      className="text-sm font-medium text-gray-600"
                    />
                    <CustomText
                      content={state.selected_enquiry.remark || "No remarks"}
                      className="text-base text-gray-800 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Lead Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <CustomText
                  content="Lead Status"
                  className="text-lg font-semibold text-gray-800 mb-3"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={state.convertedLeads.includes(
                      state.selected_enquiry.id
                    )}
                    onChange={() =>
                      handleConvertToggle(state.selected_enquiry.id)
                    }
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <CustomText
                    content="Mark as Converted"
                    className="text-sm text-gray-700"
                  />
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

      {/* Add Remark Modal */}
      <CustomModal
        open={state.showAddRemarkModal}
        handleClose={handleCancelRemark}
        title=""
        restContent={
          <div className="p-6 max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Add Remark</h2>
              <button
                onClick={handleCancelRemark}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Remark Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  value={state.tempRemarkText}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      tempRemarkText: e.target.value,
                    }))
                  }
                  placeholder="Type your message here."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Set Reminder Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Set reminder
                </label>
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      reminderToggle: !prev.reminderToggle,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    state.reminderToggle ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      state.reminderToggle ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Reminder Time Input - Show only when reminder is enabled */}
              {state.reminderToggle && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="datetime-local"
                    value={state.reminderTime}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        reminderTime: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveRemark}
                  className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        }
      />
      {/* Lead Stages Modal */}
      <CustomModal
        open={state.showLeadStagesModal}
        handleClose={handleCloseLeadStages}
        title=""
        restContent={
          <div className="p-6 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Lead Stages</h2>
              <button
                onClick={handleCloseLeadStages}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      Stage Label
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                      What this signals?
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadStagesData.map((stage, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        {stage.stage}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {stage.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
      />
      {/* Add Enquiry Modal */}
      <CustomModal
        open={state.showAddEnquiryModal}
        handleClose={handleCloseAddEnquiry}
        title=""
        restContent={
          <div className="p-6 max-w-2xl relative z-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Enquiry</h2>
              <button
                onClick={handleCloseAddEnquiry}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={state.enquiryForm.name}
                  onChange={(e) =>
                    handleEnquiryFormChange("name", e.target.value)
                  }
                  placeholder="Enter Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <select className="px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>🇮🇳 +91</option>
                  </select>
                  <input
                    type="tel"
                    value={state.enquiryForm.phone}
                    onChange={(e) =>
                      handleEnquiryFormChange("phone", e.target.value)
                    }
                    placeholder="Enter Phone Number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Event Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event
                </label>
                <select
                  value={state.enquiryForm.event}
                  onChange={(e) =>
                    handleEnquiryFormChange("event", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={globalState.instaLinkData.loading}
                >
                  <option value="">
                    {globalState.instaLinkData.loading
                      ? "Loading..."
                      : "Select Event"}
                  </option>
                  {globalState.instaLinkData.itineraries?.map((itinerary) => (
                    <option key={itinerary.id} value={itinerary.id}>
                      {itinerary.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batches
                </label>
                <select
                  value={state.enquiryForm.batch}
                  onChange={(e) =>
                    handleEnquiryFormChange("batch", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={
                    !state.enquiryForm.event ||
                    globalState.instaLinkData.loading
                  }
                >
                  <option value="">
                    {!state.enquiryForm.event
                      ? "Select Event first"
                      : globalState.instaLinkData.loading
                        ? "Loading..."
                        : "Select Batch"}
                  </option>
                  {state.enquiryForm.event &&
                    (() => {
                      const selectedItinerary =
                        globalState.instaLinkData.itineraries?.find(
                          (itinerary) =>
                            itinerary.id === state.enquiryForm.event
                        );

                      // Check if batches exist and display with proper dates
                      if (
                        selectedItinerary?.batches &&
                        Array.isArray(selectedItinerary.batches)
                      ) {
                        return selectedItinerary.batches
                          .filter((batch) => !batch.is_sold) // Only show available batches
                          .map((batch, index) => {
                            try {
                              // Safely parse dates
                              const startDate = batch.start_date
                                ? new Date(batch.start_date)
                                : null;
                              const endDate = batch.end_date
                                ? new Date(batch.end_date)
                                : null;

                              if (
                                !startDate ||
                                !endDate ||
                                isNaN(startDate.getTime()) ||
                                isNaN(endDate.getTime())
                              ) {
                                return (
                                  <option
                                    key={batch.id || index}
                                    value={batch.id || index}
                                  >
                                    Batch {index + 1}
                                  </option>
                                );
                              }

                              // Format dates like "15 Jan - 20 Jan 2024"
                              const formatDate = (date) => {
                                return date.toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                });
                              };

                              const dateRange = `${formatDate(
                                startDate
                              )} - ${formatDate(endDate)}`;

                              return (
                                <option
                                  key={batch.id || index}
                                  value={batch.id || index}
                                >
                                  {dateRange}
                                </option>
                              );
                            } catch (error) {
                              console.error(
                                "Error formatting batch date:",
                                error
                              );
                              return (
                                <option
                                  key={batch.id || index}
                                  value={batch.id || index}
                                >
                                  Batch {index + 1}
                                </option>
                              );
                            }
                          });
                      } else {
                        // If no batches found, create default options
                        return (
                          <option value="default" disabled>
                            No batches available for this itinerary
                          </option>
                        );
                      }
                    })()}
                </select>
              </div>

              {/* No. of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. of guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={state.enquiryForm.guests}
                  onChange={(e) =>
                    handleEnquiryFormChange("guests", e.target.value)
                  }
                  placeholder="Enter No. of guests"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Customer Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Message
                </label>
                <textarea
                  value={state.enquiryForm.message}
                  onChange={(e) =>
                    handleEnquiryFormChange("message", e.target.value)
                  }
                  placeholder="Enter Message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Update Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateEnquiry}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Leads;
