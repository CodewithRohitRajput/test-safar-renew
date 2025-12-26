import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

// Thunk to fetch category by ID
export const fetchItenerayByName = (itenerayRouteMap) => async (dispatch) => {

  // Set loader to true
  dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    // Make an API call to get the category by ID
    const response = await get(
      `${API_ENDPOINTS.USERS.GET_ITIN_BY_NAME}/${itenerayRouteMap}`
    )


    if (response.message === 'ITINERARY_FETCHED' && response.success === true) {

      const itinerary = response.data

      const images = extractImagesIntoObject(response.data)

      // Dispatch the setCategoryById action with the fetched data
      dispatch(
        setValue({
          key: 'itenerayByID',
          value: { ...itinerary, allImages: images }
        })
      )
    }
  } catch (error) {
    console.error('Error fetching category by ID:', error)
  } finally {
    // Set loader to false
    dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
}

const extractImagesIntoObject = (data) => {
  // Initialize an object to hold different categories of images
  const allImages = {
    view_images: [],
    activityImages: [],
    hotelImages: [],
    placeImages: []
  }

  // Extract images from view_images
  if (data.view_images && Array.isArray(data.view_images)) {
    allImages.view_images = data.view_images
  }

  // Extract images from day_details and activiteis
  if (data.day_details && Array.isArray(data.day_details)) {
    data.day_details.forEach((day) => {
      // Extract images from places
      if (day.places && Array.isArray(day.places)) {
        allImages.placeImages = allImages.placeImages.concat(day.places)
      }

      // Extract images from activiteis
      if (day.activiteis && Array.isArray(day.activiteis)) {
        day.activiteis.forEach((activity) => {
          if (activity.images && Array.isArray(activity.images)) {
            allImages.activityImages = allImages.activityImages.concat(
              activity.images
            )
          }
        })
      }
    })
  }

  // Extract images from hotels
  if (data.hotels && Array.isArray(data.hotels)) {
    data.hotels.forEach((hotel) => {
      if (hotel.images && Array.isArray(hotel.images)) {
        allImages.hotelImages = allImages.hotelImages.concat(hotel.images)
      }
    })
  }

  // Return the populated object
  return allImages
}
