import { setValue } from '../globalSlice'
import { get } from '../../constants/axiosClient'
import { API_ENDPOINTS } from '../../constants/apiEndpoints'


export const fetchHeroItineraries = () => async (dispatch) => {
  dispatch(setValue({ key: 'to_show_loader', value: true }))
  try {
    await get(API_ENDPOINTS.COMMON.GET_HERO_ITINERARY).then((d) => {
      if (d.message == 'ITINERARIES_FETCHED' && d.success == true) {
        const HeroItineraries = d.data.map((Itinerary) => ({
          id: Itinerary.id,
          title: Itinerary.title,
          image: Itinerary.view_images,
          description: Itinerary.description,
          short_description: Itinerary.shortDescription,
          itineraries: Itinerary.itinerary,
          city: Itinerary.city,
          notes: Itinerary.notes,
          duration: Itinerary.duration,
          altitude: Itinerary.altitude,
          scenery: Itinerary.scenery,
          cultural_sites: Itinerary.cultural_sites,
          itin_pdf: Itinerary.itin_pdf,
          route_map:Itinerary.route_map
        }))
        console.log('hero itineraries res', HeroItineraries)
        dispatch(setValue({ key: 'HeroItineraries', value: HeroItineraries }));
      }
    })
  } catch (error) {
    console.error('hero itineraries err', error)
  } finally {
    dispatch(setValue({ key: 'to_show_loader', value: false }))
  }
}