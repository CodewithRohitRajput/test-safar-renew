import { setValue } from '../globalSlice'


// Define the POST thunk for creating a trip request
export const addPeopleDetails = (people) => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true })) // Show loader

  try {

    dispatch(setValue({ key: 'BookingPeopleDetails', value: people }))
  } catch (error) {
    console.error('Failed to create trip request', error)
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false })) // Hide loader
  }
}
