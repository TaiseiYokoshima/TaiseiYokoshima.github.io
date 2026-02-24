import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./store.ts";

import { toggleSettings, toggleAnimation, toggleDarkMode, animationRunning, animationFinished, open, close, changePage, } from "./store.ts";
import { saveState, loadState, initialState, type Page, isPage } from "./store.ts";

function getPage(path: string): Page | null {
   const components = path.split('/').filter((value, _) => value.length !== 0);

   if (components.length === 0) {
      return null;
   };

   if (components.length !== 1) {
      return 'invalid';
   };

   switch (components[0]) {
      case 'about': 
         return 'about';

      case 'projects': 
         return 'projects';

      case 'experience': 
         return 'experience';

      case 'education': 
         return 'education';

      case 'contact': 
         return 'contact';

      default: 
         return 'invalid';
   };
}


function normalizePage(object: any): any {
   const urlPage = getPage(window.location.pathname);
   if (urlPage === null) {
      console.warn("url page was null");
      return object;
   };

   if (urlPage === object.currentPage) {
      console.warn("url page matched");
      return object;
   };


   console.warn("url page mismatched, correcting...");

   object.currentPage = urlPage;
   object.opened = false;
   return object;
}

const persistedState = loadState();
const preloadedState = persistedState ?? initialState;

export const store = configureStore({
   reducer: {
      app: appReducer,
   },
   preloadedState: { 
      app: normalizePage(preloadedState),
   },
});

store.subscribe(() => {
   const app = store.getState().app;
   saveState(app);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { toggleSettings, toggleAnimation, toggleDarkMode, animationRunning, animationFinished, open, close, changePage, type Page, isPage };
