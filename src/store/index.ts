import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./store.ts";

import { toggleSettings, toggleAnimation, toggleDarkMode, toggleAnimationStatus, open, close, changePage, } from "./store.ts";



import { saveState, loadState, initialState, type Page, isPage } from "./store.ts";


const persistedState = loadState();
const preloadedState = persistedState ?? initialState;

export const store = configureStore({
   reducer: {
      app: appReducer,
   },
   preloadedState: { app: preloadedState },
});

store.subscribe(() => {
   const app = store.getState().app;
   saveState(app);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { toggleSettings, toggleAnimation, toggleDarkMode, toggleAnimationStatus, open, close, changePage, type Page, isPage };
