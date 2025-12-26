import { setValue } from '../globalSlice'
import { post } from '../../constants/axiosClient' // Axios POST instance
import { API_ENDPOINTS } from '../../constants/apiEndpoints' // Endpoints

// Thunk to submit callback request
export const submitCallbackRequest = (formData) => async (dispatch) => {


  // Show loader before the API call
  dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    // Make the API call to submit callback request
    const response = await post(API_ENDPOINTS.USERS.CALLBACK_REQUEST, formData)


    // Return the response to handle it in the component
    return response
  } catch (error) {
    console.error('Error submitting callback request:', error)

    // Return error so it can be handled in the component
    throw error
  } finally {
    // Hide loader after the API call
    dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
}
