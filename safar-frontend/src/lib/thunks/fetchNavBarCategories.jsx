import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchNavbarCategories = () => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    console.log('Fetching categories from:', API_ENDPOINTS.COMMON.GET_CATEGORIES)
    const response = await get(API_ENDPOINTS.COMMON.GET_CATEGORIES + '?limit=20')
    const offerResponse = await get(API_ENDPOINTS.USERS.GET_OFFER_HEADING);

    console.log('Categories response:', response)

    // Check if the categories were fetched successfully
    if (
      response.message === 'CATEGORIES_FETCHED' &&
      response.success === true
    ) {
      // Handle both formats: response.data.categories or response.data (array)
      const categoriesArray = response.data.categories || response.data || [];
      
      const categories = categoriesArray.map((category) => ({
        id: category._id || category.id,
        name: category.name,
        image: category.image,
        description: category.long_description || category.description,
        short_description: category.short_description,
        is_home: category.status === 'active',
        route_map: category.route_map,
        itinerary: category.itinerary || []
      }))
      
      console.log('Processed categories:', categories)

      dispatch(setValue({ key: 'NavBarCategories', value: categories }))
    } else {
      console.warn('Categories not found, response:', response)
    }
    
    if(offerResponse.message === 'OFFER_FETCHED' && offerResponse.success === true) {
      dispatch(setValue({ key: 'OfferHeading', value: offerResponse.data }))
    } else {
      console.warn('No offer found')
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
}