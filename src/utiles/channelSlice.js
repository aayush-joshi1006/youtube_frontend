import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channel: null,
  },
  reducers: {
    addChannel: (state, action) => {
      state.channel = action.payload;
    },
    removeChannel: (state, action) => {
      state.channel = null;
    },
    updateChannel: (state, action) => {
      state.channel = { ...state.channel, ...action.payload };
    },
  },
});

export const { addChannel, removeChannel, updateChannel } =
  channelSlice.actions;
export default channelSlice.reducer;
