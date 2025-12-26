import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducer from "./globalSlice.js"
import vehicleReducer from "./features/vehicleSlice.js"
const isServer = typeof window === "undefined"; // ✅ Check for server environment

let storage = null;
if (!isServer) {
  storage = require("redux-persist/lib/storage").default; // ✅ Dynamically import storage
}

// const persistConfig = {
//   key: "persist",
//   storage: storage || undefined,
// };

const rootReducer = combineReducers({
  global: globalReducer,
  vehicles:vehicleReducer
});


const makeConfiguredStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        seriablizableCheck: false,
      }),
  });
};

export const makeStore = () => {
  if (isServer) {
    return makeConfiguredStore();
  }

  let store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  // if (!isServer) {
  //   store.__persistor = persistStore(store); // ✅ Persistor only runs on client
  // }

  return store;
};
