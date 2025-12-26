export const MODAL_PURPOSES = {
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view'
  };
  
  export const INITIAL_STATE = {
    is_modalopen: false,
    fetched_data: [],
    current_page: 1,
    total_pages: 0,
    next_cursor_id: 0,
    prev_cursor_id: 0,
    selected_review: {},
    modal_open_purpose: MODAL_PURPOSES.VIEW,
    review_text: '',
    reviewer_name: '',
    reviewer_image: '',
    rating: 1,
    itineraryId: '',
    to_show_error: false,
    itineraries: [],
    selectedItinerary: null,
    isDropdownOpen: false,
  };
  
  export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '800px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    outline: 'none',
    p: 4
  };