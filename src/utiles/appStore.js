import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice.js";
import searchReducer from "./searchSlice.js";

// function for getting user from local storage
const getFromLocalStorage = () => {
  try {
    const serializedUser = localStorage.getItem("user");
    if (serializedUser === null) return undefined;
    return {
      user: JSON.parse(serializedUser) || null, // if user present send the user othervise return null
    };
  } catch (error) {
    console.warn("Could not load user from local storage ", error);
    return undefined;
  }
};

// setting user to the local storage
const setInLocalStorage = (state) => {
  try {
    const serializedUser = JSON.stringify(state.user);
    localStorage.setItem("user", serializedUser);
  } catch (error) {
    console.warn("Could not set user to local storage ", error);
  }
};

// Redux store for storing slices
const appStore = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
  preloadedState: getFromLocalStorage(), // getting user from local storage before store loads
});
// setting the user to the local sotrage after changes have been made in store 
appStore.subscribe(() => {
  setInLocalStorage(appStore.getState());
});

export default appStore;
