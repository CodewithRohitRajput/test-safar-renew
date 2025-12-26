import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchTermAndCondition = () => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    await get(API_ENDPOINTS.USERS.GET_TERM_CONDITIONS).then((d) => {

      if ( d.success == true) {
        const termAndCondition = d.data
        dispatch(
          setValue({
            key: 'termAndCondition',
            value: termAndCondition
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
