import { createSlice } from "@reduxjs/toolkit";

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    addUser: (state, action) => {
      //for adding user in the store
      state.user = action.payload;
    },
    removeUser: (state, action) => {
      // for removing user from store
      state.user = null;
    },
    updateUser: (state, action) => {
      // for editing the user in store
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { addUser, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
