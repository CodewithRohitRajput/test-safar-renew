import { setFeaturedCategory, setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchFeaturedCategory = () => async (dispatch) => {
  try {
    await get(API_ENDPOINTS.USERS.GET_FREATURED_CATEGORY).then((d) => {
      if (d.success == true) {
        // Handle both array and object formats
        const categoriesArray = Array.isArray(d.data) ? d.data : (d.data?.categories || []);
        
        const featuredCwtgories = categoriesArray.map((category) => ({
          id: category._id || category.id,
          name: category.name,
          image: category.image,
          description: category.long_description || category.description,
          short_description: category.short_description,
          itineraries: category.itinerary || [],
          banner_image: category.feature_images?.[0] || category.banner_image,
          route_map: category.route_map
        }))
        dispatch(setFeaturedCategory(featuredCwtgories))
      }
    })
  } catch (error) {
    console.error(error)
  }
}