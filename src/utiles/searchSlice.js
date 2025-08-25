import { createSlice } from "@reduxjs/toolkit";

// initial value of search
const initialState = {
  value: "",
};
// Search slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch(state, action) {
      // for setting the search
      state.value = action.payload ?? "";
    },
    clearSearch(state, action) {
      // clearing the search
      state.value = "";
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export const selectSearch = (state) => state.search.value;  // gets search string for diresct access
export const selectHasSearch = (state) => state.search.value.trim().length > 0; // returns if search is empty or not

export default searchSlice.reducer;
