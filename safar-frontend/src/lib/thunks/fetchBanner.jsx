import { setBanners, setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchBanner = () => async (dispatch) => {
  //dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    await get(API_ENDPOINTS.USERS.GET_BANNER).then((d) => {
      if (d.message == 'BANNERS_FETCHED' && d.success == true) {
        const banners = d.data.map((banner) => ({
          id: banner.id,
          image: banner.image,
          title: banner.title,
          itinerary_id: banner.itinerary_id,
          category_id: banner.category_id,
          route_map: banner.route_map,
          category_name: banner.category_name
        }))

        dispatch(setBanners(banners))
        // Optionally, you can also set itineraries if needed
      }
    })
  } catch (error) {
    console.error('Failed to fetch data', error)
  } finally {
    //dispatch(setValue({ key: 'to_show_loader', value: false })) // Hide loader after fetching
  }
}
