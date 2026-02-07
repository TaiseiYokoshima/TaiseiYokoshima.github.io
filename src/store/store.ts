// const DEBUG = false;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


const pages: Page[] = ['about', 'projects', 'experience', 'education', 'contact'];

export function isPage(str: string): boolean {
   return pages.includes(str as Page);
}

export type Page = 'about' | 'projects' | 'experience' | 'education' | 'contact';

export interface AppState {
   currentPage: Page,

   opened: boolean,
   animationRunning: boolean,
   animationEnabled: boolean,

   darkModeEnabled: boolean,
   settingsOpened: boolean,
}

export const initialState: AppState = {
   currentPage: 'education',

   opened: false,
   animationRunning: false,
   animationEnabled: true,

   darkModeEnabled: true,
   settingsOpened: false,
};


export function loadState() {
   console.debug("load state ran");
   try {
      const serializedState = localStorage.getItem("app_state");
      if (!serializedState) return undefined;
      const persisted = JSON.parse(serializedState);
      const state = { ...initialState, ...persisted, animationRunning: false };
      console.debug("success for load state: ", state);
      return state;
   } catch (e) {
      console.error("Failed to load state from localStorage", e);
      return undefined; // fallback to default
   }
}

export function saveState(state: any) {
   try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("app_state", serializedState);
   } catch (e) {
      console.error("Failed to save state to localStorage", e);
   }
}



const appStateSlice = createSlice({
   name: 'app',
   initialState,
   reducers: {

      toggleSettings: (state) => {
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
         // console.warn("page changed to " + state.currentPage);
         // window.history.pushState("", `/${action.payload}`);
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
