import { createSlice } from "@reduxjs/toolkit";

const cacheSlice = createSlice({
  name: "cache",

  initialState: {
    settings: null,
    categories: null,
    logs: null,
  },

  reducers: {

    setSettingsCache: (
      state,
      action
    ) => {

      state.settings = action.payload;
    },

    setCategoriesCache: (
      state,
      action
    ) => {

      state.categories = action.payload;
    },

    setLogsCache: (
      state,
      action
    ) => {

      state.logs = action.payload;
    },
  },
});

export const {
  setSettingsCache,
  setCategoriesCache,
  setLogsCache,
} = cacheSlice.actions;

export default cacheSlice.reducer;