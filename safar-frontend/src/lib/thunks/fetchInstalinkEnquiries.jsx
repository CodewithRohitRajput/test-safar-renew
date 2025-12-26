import { setInstalinkEnquiries, setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchInstalinkEnquiries = () => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true }))
  
  try {
    console.log('Fetching instalink enquiries from:', API_ENDPOINTS.ADMIN.GET_ALL_INSTALINK_ENQUIRIES)
    const response = await get(API_ENDPOINTS.ADMIN.GET_ALL_INSTALINK_ENQUIRIES);
    
    console.log('Instalink enquiries response:', response)
    
    if (response.message === 'INSTALINK_ENQUIRIES_FETCHED' && response.success === true) {
      const enquiries = response.data.map((enquiry) => ({
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        destination: enquiry.destination,
        travelDate: enquiry.travelDate,
        travelers: enquiry.travelers,
        itinerary_title: enquiry.itinerary_title,
        itinerary_image: enquiry.itinerary_image, 
        itinerary_id: enquiry.itinerary_id,
        enquiry_type: enquiry.enquiry_type || "instalink",
        callback_request: enquiry.callback_request,
        remark: enquiry.remark,
        createdAt: enquiry.createdAt
      }));
      
      dispatch(setInstalinkEnquiries(enquiries));
    }
  } catch (error) {
    console.error('Failed to fetch instalink enquiries', error);
    console.error('Error response:', error.response);
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
};