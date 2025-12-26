import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setValue } from '../../../redux/globalSlice'
import { showConfirmationDialog } from '../../../App'
import { INITIAL_STATE, MODAL_PURPOSES } from './constants/reviewConstants'
import { useInView } from 'react-intersection-observer'

// Components
import AdminTopbar from '../../../components/AdminTopbar'
import CustomButton from '../../../components/CustomButton'
import Sidebar from '../../../components/Sidebar'
import ReviewTable from './components/ReviewTable'
import ReviewModal from './components/ReviewModal'
import ConfirmationDialog from './components/ConfirmationDialog'

// Hooks
import { useReviews } from './hooks/useReviews'
import { useItineraries } from './hooks/useItineraries'

// Icons
import AddIcon from '../../../assets/svgs/logo/AddIcon'

// Schemas
import { validateReview } from './schemas/reviewSchema'

function Review() {
  const dispatch = useDispatch()
  const [state, setState] = useState(INITIAL_STATE)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    reviewId: null
  })

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5
  })

  const { fetchReviews, createReview, updateReview, deleteReview } =
    useReviews()
  const { itineraries } = useItineraries()

  const loadReviews = async (page = 1) => {
    if (isLoading) return

    setIsLoading(true)
    const data = await fetchReviews(page)
    if (data) {
      setState((prev) => ({
        ...prev,
        fetched_data: data.reviews,
        total_pages: data.totalPages
      }))
      setTotalPages(data.totalPages)
      setCurrentPage(page)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const handlePageChange = (page) => {
    loadReviews(page)
  }

  const handleCreateReview = async () => {
    const success = await createReview({
      text: state.review_text,
      reviewer_name: state.reviewer_name,
      reviewer_image: state.reviewer_image,
      rating: Number(state.rating),
      isLandingPage: false,
      itineraryId: state.itineraryId || null
    })

    if (success) {
      handleSuccess('Review Created Successfully')
      loadReviews()
    }
  }

  const handleSubmit = async (formData) => {
    const { success, errors } = validateReview(formData)

    if (success) {
      if (state.modal_open_purpose === MODAL_PURPOSES.ADD) {
        await handleCreateReview(formData)
      } else {
        await handleUpdateReview(formData)
      }
    } else {
      // Handle validation errors
      dispatch(
        setValue({
          key: 'to_show_alert',
          value: true
        })
      )
      dispatch(
        setValue({
          key: 'alert_content',
          value: 'Please fix the form errors before submitting'
        })
      )
    }
  }

  const handleModalClose = () => {
    setState((prev) => ({
      ...prev,
      is_modalopen: false,
      review_text: '',
      reviewer_name: '',
      reviewer_image: '',
      rating: 1,
      itineraryId: '',
      selected_review: {},
      to_show_error: false,
      isDropdownOpen: false
    }))
    setSearchTerm('')
  }

  const handleInputChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      [field]: value
    }))
  }

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
      itineraryId: review.itineraryId || '',
      to_show_error: false
    }))

    // If there's an associated itinerary, set the search term
    if (review.itineraryId) {
      const selectedItinerary = itineraries.find(
        (i) => i.id === review.itineraryId
      )
      if (selectedItinerary) {
        setSearchTerm(`${selectedItinerary.title} - ${selectedItinerary.city}`)
      }
    }
  }

  const handleUpdateReview = async () => {
    const success = await updateReview(state.selected_review.id, {
      text: state.review_text,
      reviewer_name: state.reviewer_name,
      reviewer_image: state.reviewer_image,
      rating: Number(state.rating),
      itineraryId: state.itineraryId || null
    })

    if (success) {
      handleSuccess('Review Updated Successfully')
      handleModalClose()
      loadReviews()
    }
  }

  const handleDeleteReview = async (reviewId) => {
    setDeleteDialog({
      isOpen: true,
      reviewId
    })
  }

  const handleConfirmDelete = async () => {
    const success = await deleteReview(deleteDialog.reviewId)
    if (success) {
      handleSuccess('Review Deleted Successfully')
      loadReviews()
    }
    setDeleteDialog({ isOpen: false, reviewId: null })
  }

  const handleLandingPageChange = async (reviewId, isLandingPage) => {
    const success = await updateReview(reviewId, { isLandingPage })
    if (success) {
      handleSuccess('Review Updated Successfully')
      loadReviews()
    }
  }

  const handleSuccess = (message) => {
    dispatch(
      setValue({
        key: 'to_show_alert',
        value: true
      })
    )
    dispatch(
      setValue({
        key: 'alert_content',
        value: message
      })
    )
    dispatch(
      setValue({
        key: 'alert_type',
        value: 'success'
      })
    )
  }

  const handleItinerarySelect = (itinerary) => {
    setState((prev) => ({
      ...prev,
      itineraryId: itinerary.id,
      isDropdownOpen: false
    }))
    setSearchTerm(`${itinerary.title} - ${itinerary.city}`)
  }

  const handleItineraryClear = () => {
    setState((prev) => ({
      ...prev,
      itineraryId: '',
      isDropdownOpen: false
    }))
    setSearchTerm('')
  }

  return (
    <div className="h-screen w-full flex bg-white">
      <Sidebar
        onHover={(isHovered) => setSidebarOpen(isHovered)}
        isOpen={sidebarOpen}
      />

      <div className="w-full bg-white p-8 rounded-2xl animate-fadeIn ml-0 sm:ml-60">
        <AdminTopbar
          topbar_title={'Reviews'}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex justify-end w-full">
          <button
            className="bg-[#F47521] text-white px-6 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-[#e06b1d] transition-colors"
            onClick={() =>
              setState((prev) => ({
                ...prev,
                is_modalopen: true,
                modal_open_purpose: MODAL_PURPOSES.ADD,
                to_show_error: false
              }))
            }
          >
            <AddIcon className="w-4 h-4" />
            Add New Review
          </button>
        </div>

        <ReviewTable
          reviews={state.fetched_data}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          onLandingPageChange={handleLandingPageChange}
          isLoading={isLoading}
        />

<div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 text-sm bg-[#F47521] text-white rounded-lg hover:bg-[#e06b1d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-[#F47521] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 text-sm bg-[#F47521] text-white rounded-lg hover:bg-[#e06b1d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <ReviewModal
          isOpen={state.is_modalopen}
          onClose={handleModalClose}
          formData={state}
          onChange={handleInputChange}
          onSubmit={
            state.modal_open_purpose === MODAL_PURPOSES.ADD
              ? handleCreateReview
              : handleUpdateReview
          }
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
            onItineraryClear: handleItineraryClear
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
  )
}

export default Review
