import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

// export const fetchReviews = (page = 1, isLandingPage, itineraryId) => async (dispatch) => {
//   try {
//     const params = new URLSearchParams({
//       limit: 6
//     })

//     if (isLandingPage !== undefined) {
//       params.append('isLandingPage', isLandingPage)
//     }
//     if (itineraryId) {
//       params.append('itineraryId', itineraryId)
//     }

//     let endpoint = itineraryId 
//       ? `${API_ENDPOINTS.REVIEWS.GET_REVIEW_BY_ID}?${params.toString()}`
//       : `${API_ENDPOINTS.REVIEWS.GET_LANDING_PAGE_REVIEWS}?${params.toString()}`

//     const response = await get(endpoint)

//     if (response.message === 'REVIEWS_FETCHED' && response.success === true) {
//       const { reviews } = response.data
//       const storeKey = itineraryId ? `itineraryReviews_${itineraryId}` : 'landingPageReviews'
      
//       // Append new reviews to existing ones if not page 1
//       if (page > 1) {
//         const existingReviews = getState().global[storeKey] || [];
//         dispatch(setValue({ key: storeKey, value: [...existingReviews, ...reviews] }));
//       } else {
//         dispatch(setValue({ key: storeKey, value: reviews }));
//       }

//       return {
//         success: true,
//         reviews
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching reviews:', error)
//     return {
//       success: false
//     }
//   }
// }


export const fetchReviews = (page = 1, isLandingPage, itineraryId) => async (dispatch, getState) => {
  try {
    const params = new URLSearchParams({
      limit: 6,
      page: page
    })

    if (isLandingPage !== undefined) {
      params.append('isLandingPage', isLandingPage)
    }
    if (itineraryId) {
      params.append('itineraryId', itineraryId)
    }

    let endpoint = itineraryId 
      ? `${API_ENDPOINTS.REVIEWS.GET_REVIEW_BY_ID}?${params.toString()}`
      : `${API_ENDPOINTS.REVIEWS.GET_LANDING_PAGE_REVIEWS}?${params.toString()}`

    const response = await get(endpoint)

    if (response.message === 'REVIEWS_FETCHED' && response.success === true) {
      const { reviews } = response.data
      const storeKey = itineraryId ? `itineraryReviews_${itineraryId}` : 'landingPageReviews'
      
      if (page > 1) {
        // Get current state using getState()
        const currentState = getState();
        const existingReviews = currentState.global[storeKey] || [];
        dispatch(setValue({ key: storeKey, value: [...existingReviews, ...reviews] }));
      } else {
        dispatch(setValue({ key: storeKey, value: reviews }));
      }

      return {
        success: true,
        reviews
      }
    }

    return {
      success: false
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return {
      success: false
    }
  }
}