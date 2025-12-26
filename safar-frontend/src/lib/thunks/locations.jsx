"use client";
import { get, post, put, del } from "@/constants/axiosClient";
import { API } from "@/constants/apiEndpoints";

export const locationsThunks = {
  fetchAll: () => async (dispatch) => {
    const res = await get(API.locations.list);
    const items = res?.data?.data?.items || [];
    dispatch({ type: "locations/setList", payload: items });
    return items;
  },

  create: (payload) => async (dispatch) => {
    const res = await post(API.locations.create, payload);
    const item = res?.data?.data;
    if (item) dispatch({ type: "locations/addOne", payload: item });
    return item;
  },

  update: (id, payload) => async (dispatch) => {
    const res = await put(API.locations.update(id), payload);
    const item = res?.data?.data;
    if (item) dispatch({ type: "locations/updateOne", payload: item });
    return item;
  },

  remove: (id) => async (dispatch) => {
    await del(API.locations.destroy(id));
    dispatch({ type: "locations/removeOne", payload: id });
    return true;
  },

  setItineraries: (id, itineraryIds) => async () => {
    await put(API.locations.setItineraries(id), { itineraryIds });
    return true;
  },
};