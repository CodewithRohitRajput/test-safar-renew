import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

// Thunk to fetch category by ID
export const fetchGalleryImages = () => async (dispatch) => {

  // Set loader to true
  // dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    // Make an API call to get the category by ID
    const response = await get(`${API_ENDPOINTS.USERS.GET_GALLERY}`)

    if (
      response.message === 'GALLERY_IMAGES_FETCHED' &&
      response.success === true
    ) {
      // Extract images into separate objects

      const images = response?.data?.gallery || [];


      dispatch(
        setValue({
          key: 'GalleryImages',
          value: images
        })
      )
    }
  } catch (error) {
    console.error('Error fetching category by ID:', error)
  } finally {
    // Set loader to false
    // dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
}
