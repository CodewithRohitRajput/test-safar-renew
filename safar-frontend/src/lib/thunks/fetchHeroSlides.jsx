import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { setValue } from "@/lib/globalSlice";
import { get } from "@/constants/axiosClient"; // ✅ Correct axios instance

export const fetchHeroSlides = () => async (dispatch) => {
  dispatch(setValue({ key: "to_show_loader", value: true }));
  try {
    console.log("Fetching hero slides...");
    const data = await get(API_ENDPOINTS.COMMON.GET_HERO_SLIDES);
    console.log("Hero slides API response:", data);
    if (data?.success) {
      console.log("Dispatching hero_slides to Redux:", data.data);
      dispatch(setValue({ key: "hero_slides", value: data.data }));
    }
  } catch (error) {
    console.error("Error fetching hero slides:", error);
  } finally {
    dispatch(setValue({ key: "to_show_loader", value: false }));
  }
};