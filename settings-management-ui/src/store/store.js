import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import cacheReducer from "./slices/cacheSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cache: cacheReducer,
  },
});