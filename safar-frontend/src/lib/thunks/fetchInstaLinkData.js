import { createAsyncThunk } from '@reduxjs/toolkit'
import { get } from '@/constants/axiosClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

export const fetchInstaLinkData = createAsyncThunk(
  'global/fetchInstaLinkData',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await get(API_ENDPOINTS.USERS.INSTALINK, params)
      
      // Check if the response is successful and has the expected structure
      if (response.success && response.data) {
        return response.data // Return the data property, not the whole response
      } else {
        throw new Error(response.message || 'Failed to fetch InstaLink data')
      }
    } catch (error) {
      console.error('Error fetching InstaLink data:', error)
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch InstaLink data')
    }
  }
)