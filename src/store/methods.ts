import { DEBUG } from "./config.ts";
import type { AppState, Marker } from "./store.ts";

export function equal(first: Marker, second: Marker): boolean {
   return (first.type === second.type) && (first.id === second.id);
}

export function exists(state: AppState, marker: Marker): boolean {
   let markers: Marker[];

   switch(marker.type) {
      case "title":
         if (state.title === null) return false;
         return equal(state.title, marker);
      case "header":
         markers = state.headers;
         break;
      case "content":
         markers = state.contents;
         break;
   };

   const index = markers.findIndex((passed) => equal(passed, marker));
   return index !== -1;
}

export function remove(state:AppState, marker: Marker): boolean {
   let markers: Marker[];

   switch(marker.type) {
      case "title":
         if (!state.title) return false;
         state.title = null;
         return true;
      case "header":
         markers = state.headers;
         break;
      case "content":
         markers = state.contents;
         break;
   };

   const index = markers.findIndex((passed) => equal(passed, marker));
   if (index === -1) return false;
   markers.splice(index, 1);
   return true;
}

export function removeRunning(state: AppState, marker: Marker): 'title received' | 'marker not found' | 'removed' {
   let markers: Marker[];
   switch(marker.type) {
      case "title":
         return 'title received';
      case "header":
         markers = state.runningHeaders;
         break;
      case "content":
         markers = state.runningContents;
         break;
   };

   const index = markers.findIndex((passed) => equal(passed, marker));
   if (index === -1) return 'marker not found';

   markers.splice(index, 1);
   return 'removed';
}

export function find(state: AppState, marker: Marker): number {
   if (marker.type === 'title') {
      return -1;
   };

   let markers: Marker[];
   switch(marker.type) {
      case "header":
         markers = state.headers;
         break;
      case "content":
         markers = state.contents;
         break;
   };

   const index = markers.findIndex((passed) => equal(passed, marker));
   return index;
}

export function nextStage(state: AppState) {
   if (DEBUG) console.log(`nextStage called on ${state.animationStage}`);
   if (state.currentAnimation === null) {
      if (DEBUG) console.error(`tried to move onto next stage from ${state.animationStage} stage but current animation was null`);
      return;
   };

   if (state.targetPage === null) {
      if (DEBUG) console.error(`tried to move onto next stage from ${state.animationStage} stage but the target page was null`);
      return;
   };

   switch(state.animationStage) {
      case "title": {
         if (state.runningHeaders.length !== 0 && DEBUG) console.error("moving to headers stage of animation but running contents array not empty");
         state.animationStage = 'headers';
         state.runningHeaders = state.headers.slice();
         return;
      };

      case "headers": {
         if (state.runningContents.length !== 0 && DEBUG) console.error("moving to contents stage of animation but running contents array not empty");
         state.animationStage = 'contents';
         state.runningContents = state.contents.slice();
         return;
      };

      case "contents": {
         state.animationStage = 'title';
         state.lastAnimation = state.currentAnimation;

         switch (state.currentAnimation) {
            case "open": 
               state.targetPage = null;
               break;
            case "close": 
               state.currentPage = state.targetPage;
               break;
         };

         state.currentAnimation = null;
      };
   };
}
