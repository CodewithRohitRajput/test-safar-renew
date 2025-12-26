import { setValue } from '../globalSlice'
import { post } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

// Define the POST thunk for creating a trip request
export const createTripRequest = (tripData) => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true })) // Show loader

  try {
    // Perform the POST request to create a new trip request
    const response = await post(
      API_ENDPOINTS.USERS.CREATE_TRIP_REQUEST,
      tripData
    )

    if (response.success) {


      // Handle any updates to the state, e.g., showing a success message
      dispatch(setValue({ key: 'trip_request_success', value: true }))

      // Return the response to be handled in the component
      return response
    } else {
      throw new Error(response.message || 'Trip request failed')
    }
  } catch (error) {
    console.error('Failed to create trip request:', error)

    // Optionally handle error state
    dispatch(setValue({ key: 'trip_request_error', value: true }))

    // Re-throw error to be handled in the component if needed
    throw error
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false })) // Hide loader
  }
}
