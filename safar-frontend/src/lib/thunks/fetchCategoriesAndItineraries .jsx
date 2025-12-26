import { setCategories, setItineraries, setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'

export const fetchCategoriesAndItineraries = () => async (dispatch) => {
  // dispatch(setValue({ key: 'to_show_loader', value: true }))

  try {
    await get(API_ENDPOINTS.COMMON.GET_CATEGORIES + '?limit=20').then((d) => {
      if (d.message == 'CATEGORIES_FETCHED' && d.success == true) {
        const categories = d.data.categories.map((category) => ({
          id: category.id,
          name: category.name,
          image: category.image,
          description: category.description,
          short_description: category.short_description,
          is_home: category.is_home,
          route_map: category.route_map,
          itineraries: category.itinerary
        }))
        dispatch(setCategories(categories))
        // Optionally, you can also set itineraries if needed
        const allItineraries = categories.flatMap(
          (category) => category.itineraries
        )

        dispatch(setItineraries(allItineraries))
      }
    })

    // dispatch(setItineraries(data.itineraries))
  } catch (error) {
    console.error('Failed to fetch data', error)
  } finally {
    //dispatch(setValue({ key: 'to_show_loader', value: false })) // Hide loader after fetching
  }
}
