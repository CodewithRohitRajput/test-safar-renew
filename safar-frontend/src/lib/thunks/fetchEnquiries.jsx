import { setEnquiries, setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchEnquiries = () => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true }))
  
  try {
    // Change this line - use customize enquiries endpoint instead of all enquiries
    console.log('Fetching customize enquiries from:', API_ENDPOINTS.ADMIN.GET_ALL_CUSTOMIZE_ENQUIRIES)
    const response = await get(API_ENDPOINTS.ADMIN.GET_ALL_CUSTOMIZE_ENQUIRIES);
    
    console.log('Customize enquiries response:', response)
    
    // Change this line - check for customize enquiries message
    if (response.message === 'CUSTOMIZE_ENQUIRIES_FETCHED' && response.success === true) {
      const enquiries = response.data.map((enquiry) => ({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        destination: enquiry.destination,
        travelDate: enquiry.travelDate,
        travelers: enquiry.travelers,
        itinerary_title: enquiry.itinerary_title,
        callback_request: enquiry.callback_request, 
        remark: enquiry.remark, 
        createdAt: enquiry.createdAt
      }));
      
      dispatch(setEnquiries(enquiries));
    }
  } catch (error) {
    console.error('Failed to fetch customize enquiries', error);
    console.error('Error response:', error.response);
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
};