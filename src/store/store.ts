import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { remove, nextStage, exists, removeRunning } from "./methods"; 

import { DEBUG } from "./config";

type Page = 'about' | 'projects' | 'experience' | 'education' | 'contact';

export type Animation = 'close' | 'open';
type AnimationStage = 'title' | 'headers' | 'contents';

let titleID = 1;
let headerID = 1;
let contentID = 1;

export interface Marker { type: 'title' | 'header' | 'content', id: number };
export function createMarker(type: 'title' | 'header' | 'content'): Marker {
   if (DEBUG) console.log(`create marker called with ${type} when ${titleID}:${headerID}:${contentID}`);

   let id: number;
   switch(type) {
      case "title":
         id = titleID;
         titleID++;
         break;
      case "header":
         id = headerID;
         headerID++;
         break;
      case "content":
         id = contentID;
         contentID++;
         break;
   };

   return { type, id };
}

export interface AppState {
   animationEnabled: boolean,
   darkModeEnabled: boolean,
   settingsOpened: boolean,

   currentPage: Page,
   targetPage: Page | null,

   lastAnimation: Animation,
   currentAnimation: Animation | null,
   animationStage: AnimationStage,

   title: Marker | null,

   headers: Marker[],
   runningHeaders: Marker[],

   contents: Marker[],
   runningContents: Marker[],
}

const initialState: AppState = {
   animationEnabled: true,
   darkModeEnabled: true,
   settingsOpened: false,

   currentPage: 'about',
   targetPage: 'about',

   lastAnimation: 'close',
   currentAnimation: null,
   animationStage: 'title',

   title: null,

   headers: [],
   runningHeaders: [],

   contents: [],
   runningContents: [],
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
      },

      toggleDarkMode: (state) => {
         state.darkModeEnabled = !state.darkModeEnabled;
      },

      changePage: (state, action: PayloadAction<Page>) => {
         if (state.lastAnimation === 'close') {
            if (DEBUG) console.error(`tried to close on change page but the last animation was also close`);
            return;
         };

         const page = action.payload;
         state.targetPage = page;
         state.currentAnimation = "close";
      },

      open: (state) => {
         if (DEBUG) console.log("open called");

         if (state.lastAnimation === 'open') {
            if (DEBUG) console.error(`tried to open but the last animation was also open`);
            return;
         };

         state.currentAnimation = 'open';
      },


      animationComplete: (state, action: PayloadAction<Marker>) => {
         if (DEBUG) console.log("animation complete called");
         const marker = action.payload;

         if (marker.type === 'title') {

            if (state.title === null) {
               if (DEBUG) console.error("title animation complete signal received but title is null");
               return;
            };

            if (state.title.id !== marker.id) {
               if (DEBUG) console.error("title animation complete signal received but does not match");
               return;
            };

            nextStage(state);
            return;
         };

         switch (marker.type) {
            case "header": {
               if (!exists(state, marker)) {
                  if (DEBUG) console.error("header animation complete signal received but is not registered");
                  return;
               };

               const result = removeRunning(state, marker);
               if (result !== 'removed') {
                  if (DEBUG) console.error(`animation complete signal failed to be processed for header due to ${result}`);
                  return;
               };

               if (state.runningHeaders.length === 0) nextStage(state);
               break;
            };

            case "content": {
               if (!exists(state, marker)) {
                  if (DEBUG) console.error("content animation complete signal received but not registered");
                  return;
               };

               const result = removeRunning(state, marker);
               if (result !== 'removed') {
                  if (DEBUG) console.error(`animation complete signal failed to be processed for content due to ${result}`);
                  return;
               };

               if (state.runningContents.length === 0) nextStage(state);
               break;
            };
         };
      },

      register: (state, action: PayloadAction<Marker>) => {
         const marker = action.payload;
         if (DEBUG) console.log(`register called with ${marker.type}:${marker.id}`);

         if (exists(state, marker)) {
            if (DEBUG) console.error(`tried to register ${marker.type} but is already registered`);
            return;
         };

         switch (marker.type) {
            case 'header':
               state.headers.push(marker);
               return;
            case 'content':
               state.contents.push(marker);
               return;
            case 'title':
               if (state.title && DEBUG) return console.error("title was already registered but received title registration request");
               state.title = marker;
         };
      },

      deRegister: (state, action: PayloadAction<Marker>) => {
         const marker = action.payload;
         if (DEBUG) console.log(`deRegister called with ${marker.type}:${marker.id}`);

         const success = remove(state, action.payload);
         if (success || !DEBUG)  return;

         switch(action.payload.type) {
            case "title":
               return console.error("deRegister request for title received but it is null");
            case "header":
               return console.error("deRegister request for header received but not found");
            case "content":
               return console.error("deRegister request for content received but not found");
         };
      },
   },
});

export const { toggleSettings, toggleDarkMode, toggleAnimation, open, changePage, register, deRegister, animationComplete } = appStateSlice.actions;
export default appStateSlice.reducer;
