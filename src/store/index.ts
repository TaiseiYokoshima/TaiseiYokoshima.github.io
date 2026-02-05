import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./store.ts";

import { toggleSettings, toggleAnimation, toggleDarkMode, toggleAnimationStatus, open, close, changePage, } from "./store.ts";

export const store = configureStore({
   reducer: {
      app: appReducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { toggleSettings, toggleAnimation, toggleDarkMode, toggleAnimationStatus, open, close, changePage };
