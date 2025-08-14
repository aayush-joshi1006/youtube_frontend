import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import channelReducer from "./channelSlice.js";

const getFromLocalStorage = () => {
  try {
    const serializedUser = localStorage.getItem("user");
    const serializedChannel = localStorage.getItem("channel");
    if (serializedUser === null) return undefined;
    if (serializedChannel === null) return undefined;
    return {
      user: JSON.parse(serializedUser) || null,
      channel: JSON.parse(serializedChannel) || null,
    };
  } catch (error) {
    console.warn("Could not load user from local storage ", error);
    return undefined;
  }
};

const setInLocalStorage = (state) => {
  try {
    const serializedUser = JSON.stringify(state.user);
    const serializedChannel = JSON.stringify(state.channel);
    localStorage.setItem("user", serializedUser);
    localStorage.setItem("channel", serializedChannel);
  } catch (error) {
    console.warn("Could not set user to local storage ", error);
  }
};

const appStore = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
  },
  preloadedState: getFromLocalStorage(),
});

appStore.subscribe(() => {
  setInLocalStorage(appStore.getState());
});

export default appStore;
