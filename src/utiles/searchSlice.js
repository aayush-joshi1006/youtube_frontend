import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.value = action.payload ?? "";
    },
    clearSearch(state, action) {
      state.value = "";
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export const selectSearch = (state) => state.search.value;
export const selectHasSearch = (state) => state.search.value.trim().length > 0;

export default searchSlice.reducer;
