import { setValue } from '../globalSlice'
import { post } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

// Thunk to create a new booking
export const createBooking =
  (people, totalPrice, total) => async (dispatch) => {
    // Set loader to true
    dispatch(setValue({ key: 'to_show_loader', value: true }))

    // Prepare the booking data
    const bookingData = {
      customer: {
        name: `${people[0].firstName} ${people[0].lastName}`,
        base_city: people[0]?.baseCity || '',
        age: 24, // Modify as needed
        phone: Number(people[0]?.contactNumber) || '',
        email: people[0]?.email || '',
        gender: people[0]?.gender || '',
        instagram: people[0]?.instagramID || '',
        refer: '',
        starting_point: people[0]?.startingPoint?.name || '',
        drop_point: people[0]?.droppingPoint?.name || '',
        package_id: people[0]?.selectedPackage?.id || ''
      },
      people_count: people.length,
      travellers: people.slice(1).map((person) => ({
        name: `${person.firstName} ${person.lastName}`,
        base_city: person.baseCity || '',
        age: 24, // Modify as needed
        phone: Number(person.contactNumber) || '',
        email: person.email || '',
        gender: person.gender || '',
        instagram: person.instagramID || '',
        starting_point: person.startingPoint?.name || '',
        drop_point: person.droppingPoint?.name || '',
        package_id: person.selectedPackage?.id || ''
      })),
      itinerary_id: people[0]?.selectedPackage?.itineraryId, // Use dynamic data if needed
      batch_id: people[0]?.selectedBatch?.id || '',
      total_price: total, // Calculate dynamically if needed
      paid_amount: total * 0.1 // Update if necessary
    }


    try {
      // Make the POST request to create a new booking
      const response = await post(
        API_ENDPOINTS.BOOKING.NEW_BOOKING,
        bookingData
      )

      // Make sure the response is properly structured
      if (response?.success) {


        // Dispatch success state
        dispatch(setValue({ key: 'booking_success', value: true }))

        // Return the response data for further handling
        return response
      } else {
        console.error(
          'Booking failed:',
          response?.statusText || response?.message
        )

        // Dispatch failure state
        dispatch(setValue({ key: 'booking_failed', value: true }))

        // Return a failure response for handling
        return { success: false }
      }
    } catch (error) {
      console.error('Error while booking:', error)

      // Dispatch error state
      dispatch(setValue({ key: 'booking_error', value: error.message }))

      // Return an error object to handle it in the calling code
      return { success: false, error: error.message }
    } finally {
      // Hide loader
      dispatch(setValue({ key: 'to_show_loader', value: false }))
    }
  }
