import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'


export const fetchTrendingItineraries  = () => async (dispatch) => {
      dispatch(setValue({ key: 'to_show_loader', value: true }))

        try {
          await get(API_ENDPOINTS.USERS.GET_TRENDING_ITINERARY).then((d) => {
            if (d.message == 'ITINERARIES_FETCHED' && d.success == true) {
              const trendingItineraries = d.data
              dispatch(
                setValue({
                  key: 'trendingItineraries',
                  value: trendingItineraries
                })
              )
              // Optionally, you can also set itineraries if needed
            }
          })
        } catch (error) {
          console.error('Failed to fetch data', error)
        } finally {
          dispatch(setValue({ key: 'to_show_loader', value: false })) // Hide loader after fetching
        }

}
