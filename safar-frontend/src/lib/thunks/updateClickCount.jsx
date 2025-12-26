"use client"
import { setValue } from '../globalSlice'
import { put } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

// Define the PUT thunk
export const putBanner = (bannerData, bannerId) => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true })) // Show loader

  try {
    const url = `${API_ENDPOINTS.USERS.PUT_BANNER_COUNT}?id=${bannerId}`

    // Perform the PUT request to update the banner data
    await put(url, bannerData).then((response) => {
      if (response.success && response.message === 'CLICK_COUNT_UPDATED') {

        // You could update the local state with new data here if needed
      }
    })
  } catch (error) {
    console.error('Failed to update banner', error)
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false })) // Hide loader
  }
}
