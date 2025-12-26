// redux/vehicles/vehiclesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehiclesList: [],
    loading: false,
    error: null,
    pagination: {},
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setVehicles: (state, action) => {
      state.loading = false;
      state.vehiclesList = action.payload.vehicles || [];
      state.pagination = action.payload.pagination || {};
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { startLoading, setVehicles, setError } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
