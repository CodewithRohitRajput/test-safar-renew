import { createSlice } from '@reduxjs/toolkit'
import { setTextRange } from 'typescript'

const initialState = {
  to_show_loader: false,
  to_show_alert: false,
  alert_type: 'success',
  alert_content: '',
  to_show_dialog: false,
  categories: [], // Add categories to state
  itineraries: [], // Add itineraries to state
  enquiries: [],
  homeCategories: [],
  banners: [],
  featuredCategory: [],
  HeroItineraries: [],
  GalleryImages: [],
  CategoryByID: [],
  trendingItineraries: [],
  itenerayByID: [],
  BookingPeopleDetails: [],
  NavBarCategories: [],
  search_results: [],
  search_parmas: [],
  reviews: [],
  OfferHeading: '',
  termAndCondition:[],
  userData:null,
  hero_slides:[],
  locations:[],
  instaLinkData: {
    categories: [],
    locations: [],
    itineraries: [],
    total: 0,
    loading: false,
    error: null
  },
  instalinkEnquiries: [],
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setValue: (state, action) => {
      const { key, value } = action.payload
      console.log('key', key)
      console.log('value', value)
      state[key] = value
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setUserDataFromLocalStorage: (state, action) => {
      state.userData = action.payload
    },
    setHomeCategories: (state, action) => {
      state.homeCategories = action.payload
    },
    setItineraries: (state, action) => {
      state.itineraries = action.payload
    },
    setEnquiries: (state, action) => {
      state.enquiries = action.payload;
    },
    setInstalinkEnquiries: (state, action) => {
      state.instalinkEnquiries = action.payload;
    },
    setBanners: (state, action) => {
      state.banners = action.payload
    },
    setFeaturedCategory: (state, action) => {
      state.featuredCategory = action.payload
    },
    setTermAndCondition: (state, action) => {
      state.termAndCondition = action.payload
    },
    setLocations: (state, action) => {
      state.locations = action.payload
    },
    addLocation: (state, action) => {
      state.locations = [action.payload, ...(state.locations || [])]
    },
    updateLocation: (state, action) => {
      state.locations = (state.locations || []).map((x) =>
        x.id === action.payload.id ? action.payload : x
      )
    },
    removeLocation: (state, action) => {
      state.locations = (state.locations || []).filter(
        (x) => x.id !== action.payload
      )
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase('global/fetchInstaLinkData/pending', (state) => {
        state.instaLinkData.loading = true
        state.instaLinkData.error = null
      })
      .addCase('global/fetchInstaLinkData/fulfilled', (state, action) => {
        state.instaLinkData.loading = false
        state.instaLinkData.categories = action.payload.categories
        state.instaLinkData.locations = action.payload.locations
        state.instaLinkData.itineraries = action.payload.itineraries
        state.instaLinkData.total = action.payload.total
        state.instaLinkData.error = null
      })
      .addCase('global/fetchInstaLinkData/rejected', (state, action) => {
        state.instaLinkData.loading = false
        state.instaLinkData.error = action.payload
      })  
  },
});

export const {
  setValue,
  setCategories,
  setItineraries,
  setEnquiries,
  setInstalinkEnquiries,
  setHomeCategories,
  setBanners,
  setUserDataFromLocalStorage,
  setFeaturedCategory,
  setTermAndCondition,
  setLocations,
  addLocation,
  updateLocation,
  removeLocation,
} = globalSlice.actions
export default globalSlice.reducer;
