import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./store.ts";

import { type Marker, type Animation, createMarker, toggleSettings, toggleAnimation, toggleDarkMode, open, changePage, register, deRegister, animationComplete } from "./store.ts";

export const store = configureStore({
   reducer: {
      app: appReducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { type Marker, type Animation, createMarker, toggleSettings, toggleAnimation, toggleDarkMode, open, changePage, register, deRegister, animationComplete };


