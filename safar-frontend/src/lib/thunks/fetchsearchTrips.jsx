import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

// Define the thunk for performing the search request
export const fetchsearchTrips = (searchParams) => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true })) // Show loader

  try {
    // Build the query string with search parameters
    const { search, month, min_budget, max_budget, tripDuration, tripType } =
      searchParams
    const params = new URLSearchParams();

    // Add parameters only if they are defined
    if (search )  params.append('search', search)
    if (month && month !== 'Select Trip Month') params.append('month', month)
    if (tripType && tripType !== 'Select Trip Type') params.append('trip_type', tripType)

    if (min_budget !== undefined) params.append('min_budget', min_budget)
    if (max_budget !== undefined) params.append('max_budget', max_budget)


    var query = `?${params.toString()}`

    if (tripDuration && tripDuration !== 'Select Trip Duration') {
      query = query + `&duration=${tripDuration}`
    }
      


    dispatch(setValue({ key: 'search_parmas', value: searchParams }))

    // Perform the GET request
    const response = await get(
      `${API_ENDPOINTS.COMMON.GET_SEARCH_RESULT}${query}`
    )

    // Handle the response
    // && response.message =="ITINERARIES_FETCHED"
    if (response.success) {


      // Dispatch success or set the search result data to global state
      dispatch(setValue({ key: 'search_results', value: response.data }))
    } else {
      console.error('Failed to fetch search results')
      // Optionally handle failure state
      dispatch(setValue({ key: 'search_error', value: true }))
    }
  } catch (error) {
    console.error('Error occurred during search request:', error)
    // Handle the error state
    dispatch(setValue({ key: 'search_error', value: true }))
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false })) // Hide loader
  }
}
