// const DEBUG = false;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Page = 'about' | 'projects' | 'experience' | 'education' | 'contact';


export interface AppState {
   animationEnabled: boolean,
   darkModeEnabled: boolean,
   settingsOpened: boolean,
   currentPage: Page,
   opened: boolean,
}

const initialState: AppState = {
   animationEnabled: true,
   darkModeEnabled: true,
   settingsOpened: false,
   currentPage: 'about',
   opened: false,
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
         console.log("page changed to " + state.currentPage);
      },

      open: (state) => {
         state.opened = true;
      },

      close: (state) => {
         state.opened = false;
      },
   },
});

export const { toggleSettings, toggleDarkMode, toggleAnimation, open, close, changePage } = appStateSlice.actions;
export default appStateSlice.reducer;
