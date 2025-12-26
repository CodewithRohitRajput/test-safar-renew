// --- ReviewPage.jsx ---

"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setValue } from "@/lib/globalSlice";
import AdminTopbar from "../AdminTopbar";
import Sidebar from "../Sidebar";
import ConfirmationDialog from "./review/components/ConfirmationDialog";
import ReviewModal from "./review/components/ReviewModal";
import ReviewTable from "./review/components/ReviewTable";
import { INITIAL_STATE, MODAL_PURPOSES } from "./review/constants/reviewConstants";
import { useItineraries } from "./review/hooks/useItineraries";
import { useReviews } from "./review/hooks/useReviews";
import { validateReview } from "./review/schemas/reviewSchema";
import AddIcon from "@/_assets/svgs/logo/AddIcon";
import useAuthRedirect from "@/hooks/useAuthRedirect";

function ReviewPage() {
  useAuthRedirect();
  const dispatch = useDispatch();

  const [state, setState] = useState(INITIAL_STATE);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, reviewId: null });

  const { fetchReviews, createReview, updateReview, deleteReview } = useReviews();
  const { itineraries } = useItineraries();

  const loadReviews = async (page = 1) => {
    if (isLoading) return;

    setIsLoading(true);
    const data = await fetchReviews(page);
    if (data) {
      setState((prev) => ({
        ...prev,
        fetched_data: data.reviews,
        total_pages: data.totalPages,
      }));
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    loadReviews(page);
  };

  const handleCreateReview = async () => {
    const success = await createReview({
      text: state.review_text,
      reviewer_name: state.reviewer_name,
      reviewer_image: state.reviewer_image,
      rating: Number(state.rating),
      isLandingPage: false,
      itineraryId: state.itineraryId || null,
    });

    if (success) {
      handleSuccess("Review Created Successfully");
      loadReviews(currentPage);
    }
  };

  const handleUpdateReview = async () => {
    const success = await updateReview(state.selected_review.id, {
      text: state.review_text,
      reviewer_name: state.reviewer_name,
      reviewer_image: state.reviewer_image,
      rating: Number(state.rating),
      itineraryId: state.itineraryId || null,
    });

    if (success) {
      handleSuccess("Review Updated Successfully");
      handleModalClose();
      loadReviews(currentPage);
    }
  };

  const handleSubmit = async (formData) => {
    const { success } = validateReview(formData);

    if (success) {
      if (state.modal_open_purpose === MODAL_PURPOSES.ADD) {
        await handleCreateReview(formData);
      } else {
        await handleUpdateReview(formData);
      }
    } else {
      dispatch(setValue({ key: "to_show_alert", value: true }));
      dispatch(setValue({ key: "alert_content", value: "Please fix the form errors before submitting" }));
    }
  };

  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      is_modalopen: false,
      review_text: "",
      reviewer_name: "",
      reviewer_image: "",
      rating: 1,
      itineraryId: "",
      selected_review: {},
      to_show_error: false,
      isDropdownOpen: false,
    }));
    setSearchTerm("");
  };

  const handleEditReview = (review) => {
    setState((prev) => ({
      ...prev,
      is_modalopen: true,
      modal_open_purpose: MODAL_PURPOSES.EDIT,
      selected_review: review,
      review_text: review.text,
      reviewer_name: review.reviewer_name,
      reviewer_image: review.reviewer_image,
      rating: review.rating,
      itineraryId: review.itineraryId || "",
      to_show_error: false,
    }));

    const selectedItinerary = itineraries.find((i) => i.id === review.itineraryId);
    if (selectedItinerary) {
      setSearchTerm(`${selectedItinerary.title} - ${selectedItinerary.city}`);
    }
  };

  const handleDeleteReview = (reviewId) => {
    setDeleteDialog({ isOpen: true, reviewId });
  };

  const handleConfirmDelete = async () => {
    const success = await deleteReview(deleteDialog.reviewId);
    if (success) {
      handleSuccess("Review Deleted Successfully");
      loadReviews(currentPage);
    }
    setDeleteDialog({ isOpen: false, reviewId: null });
  };

  const handleItinerarySelect = (itinerary) => {
    setState((prev) => ({
      ...prev,
      itineraryId: itinerary.id,
      isDropdownOpen: false,
    }));
    setSearchTerm(`${itinerary.title} - ${itinerary.city}`);
  };

  const handleItineraryClear = () => {
    setState((prev) => ({
      ...prev,
      itineraryId: "",
      isDropdownOpen: false,
    }));
    setSearchTerm("");
  };

  const handleSuccess = (message) => {
    dispatch(setValue({ key: "to_show_alert", value: true }));
    dispatch(setValue({ key: "alert_content", value: message }));
    dispatch(setValue({ key: "alert_type", value: "success" }));
  };
  const handleInputChange = (field, value) => {
  setState((prev) => ({
    ...prev,
    [field]:
    value,
  }));
};


  return (
    <div className="h-screen w-full flex bg-white">
      <Sidebar onHover={(isHovered) => setSidebarOpen(isHovered)} isOpen={sidebarOpen} />

      <div className="w-full bg-white p-8 rounded-2xl animate-fadeIn ml-0 sm:ml-60">
        <AdminTopbar topbar_title={"Reviews"} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex justify-end w-full">
          <button
            className="bg-[#F47521] text-white px-6 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-[#e06b1d] transition-colors"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                is_modalopen: true,
                modal_open_purpose: MODAL_PURPOSES.ADD,
                to_show_error: false,
              }))
            }
          >
            <AddIcon className="w-4 h-4" /> Add New Review
          </button>
        </div>

        <ReviewTable
          reviews={state.fetched_data}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          onLandingPageChange={() => {}}
          isLoading={isLoading}
          itineraries={itineraries}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <ReviewModal
          isOpen={state.is_modalopen}
          onClose={handleModalClose}
          formData={state}
          onChange={(field, value) => handleInputChange(field, value)}
          onSubmit={state.modal_open_purpose === MODAL_PURPOSES.ADD ? handleCreateReview : handleUpdateReview}
          showError={state.to_show_error}
          modalPurpose={state.modal_open_purpose}
          searchableSelect={{
            searchTerm,
            onSearchChange: setSearchTerm,
            isDropdownOpen: state.isDropdownOpen,
            onDropdownOpenChange: (value) =>
              setState((prev) => ({ ...prev, isDropdownOpen: value })),
            itineraries,
            onItinerarySelect: handleItinerarySelect,
            onItineraryClear: handleItineraryClear,
          }}
        />

        <ConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, reviewId: null })}
          onConfirm={handleConfirmDelete}
          title="Delete Review"
          message="Are you sure you want to delete this review?"
        />
      </div>
    </div>
  );
}

export default ReviewPage;
