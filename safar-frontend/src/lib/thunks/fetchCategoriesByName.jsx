import { setValue } from '../globalSlice' // Action from the global slice
import { get } from '../../constants/axiosClient' // Axios instance for API requests
import { API_ENDPOINTS } from '../../constants/apiEndpoints' // Endpoints

// Thunk to fetch category by ID
export const fetchCategoriesByName = (categoryName) => async (dispatch) => {

  // Set loader to true
  dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    // Make an API call to get the category by ID
    const response = await get(
      `${API_ENDPOINTS.USERS.GET_CAT_BY_NAME}/${categoryName}`
    )


    // Check if the category is found
    if (response.success === true) {
      const category = response.data // Extract the data

      // Dispatch the category to the global state
      dispatch(setValue({ key: 'CategoryByID', value: category }))
    } else {
      // Handle cases where the category was not found
      console.warn('Category not found')
    }
  } catch (error) {
    console.error('Error fetching category by ID:', error)
  } finally {
    // Set loader to false
    dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
}
