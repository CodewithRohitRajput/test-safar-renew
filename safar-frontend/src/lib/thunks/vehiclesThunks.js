// redux/vehicles/vehiclesThunks.js
import { get, post, put } from "@/constants/axiosClient";
import { setError, setVehicles, startLoading } from "../features/vehicleSlice";

const API_BASE = "/admin"; // BASE_URL is already set in axiosClient

export const fetchVehicles = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await get(`${API_BASE}/get-vehicles`);
    console.log(result)
    dispatch(setVehicles({ vehicles: result.data }));
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || error.message));
  }
};

export const filterVehicles = (filterParams) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const data = await get(`${API_BASE}/filter-vehicles`, filterParams);
    dispatch(setVehicles({
      vehicles: data.vehicles,
      pagination: data.pagination,
    }));
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || error.message));
  }
};

export const createVehicle = (vehicleData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await post(`${API_BASE}/create-vehicle`, vehicleData);
    dispatch(fetchVehicles());
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || error.message));
  }
};

export const updateVehicle = (id, updatedData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await put(`${API_BASE}/update-vehicle/${id}`, updatedData);
    dispatch(fetchVehicles());
  } catch (error) {
    dispatch(setError(error?.response?.data?.message || error.message));
  }
};
