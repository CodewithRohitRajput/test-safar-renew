import { setHomeCategories, setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchHomeCategories = () => async (dispatch) => {
  try {
    await get(API_ENDPOINTS.COMMON.GET_HOME_CATEGORIES).then((d) => {
      if (d.message == 'CATEGORIES_FETCHED' && d.success == true) {
        // Handle both array and object formats
        const categoriesArray = Array.isArray(d.data) ? d.data : (d.data?.categories || []);
        
        const homeCategories = categoriesArray.map((category) => ({
          id: category._id || category.id,
          name: category.name,
          image: category.image,
          banner_image: category.feature_images?.[0] || category.banner_image,
          description: category.long_description || category.description,
          short_description: category.short_description,
          route_map: category.route_map,
          is_home: category.status === 'active'
        }))
        dispatch(setHomeCategories(homeCategories))
      }
    })
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}