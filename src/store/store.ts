// const DEBUG = false;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
type Page = 'about' | 'projects' | 'experience' | 'education' | 'contact';

export interface AppState {
   currentPage: Page,

   opened: boolean,
   animationRunning: boolean,
   animationEnabled: boolean,

   darkModeEnabled: boolean,
   settingsOpened: boolean,
}

const initialState: AppState = {
   currentPage: 'education',

   opened: false,
   animationRunning: false,
   animationEnabled: true,

   darkModeEnabled: true,
   settingsOpened: false,
};

const appStateSlice = createSlice({
   name: 'app',
   initialState,
   reducers: {

      toggleSettings: (state)  => {
         state.settingsOpened = !state.settingsOpened;
      },

      toggleAnimation: (state) => {
         state.animationEnabled = !state.animationEnabled;
         state.opened = true;
      },

      toggleDarkMode: (state) => {
         state.darkModeEnabled = !state.darkModeEnabled;
      },

      changePage: (state, action: PayloadAction<Page>) => {
         state.currentPage = action.payload;
         state.opened = false;
         console.log("page changed to " + state.currentPage);
      },

      toggleAnimationStatus: (state) => {
         state.animationRunning = !state.animationRunning;
      },

      open: (state) => {
         state.opened = true;
      },

      close: (state) => {
         state.opened = false;
      },
   },
});

export const { toggleSettings, toggleDarkMode, toggleAnimation, toggleAnimationStatus, open, close, changePage } = appStateSlice.actions;
export default appStateSlice.reducer;
