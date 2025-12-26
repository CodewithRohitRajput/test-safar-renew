import { toast } from "sonner";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDeals,
  fetchDesserts,
  fetchDips,
  fetchDrinks,
  fetchPizzas,
  fetchSides,
} from "../actions/products";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    isLoading: false,
    pizzas: [],
    sides: [],
    dips: [],
    drinks: [],
    desserts: [],
    deals: [],
    collectionDeals: [],
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.pizzas = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchPizzas.rejected, (state, action) => {
        toast(action.payload);
      })

      .addCase(fetchSides.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchSides.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.sides = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchSides.rejected, (state, action) => {
        toast(action.payload);
      })

      .addCase(fetchDips.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchDips.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.dips = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchDips.rejected, (state, action) => {
        toast(action.payload);
      })

      .addCase(fetchDrinks.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchDrinks.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.drinks = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchDrinks.rejected, (state, action) => {
        toast(action.payload);
      })

      .addCase(fetchDesserts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchDesserts.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.desserts = action.payload.data;
        state.isLoading = false;
      })
      .addCase(fetchDesserts.rejected, (state, action) => {
        toast(action.payload);
      })

      .addCase(fetchDeals.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        if (action.payload.payload) {
          state.collectionDeals = action.payload.data.data;
        } else {
          state.deals = action.payload.data.data;
        }
        state.isLoading = false;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        toast(action.payload);
      });
  },
});

export default productsSlice.reducer;
