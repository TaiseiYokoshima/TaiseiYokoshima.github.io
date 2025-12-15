import { DEBUG } from "./config.ts";
import type { AppState, Marker } from "./store.ts";

export function equal(first: Marker, second: Marker): boolean {
   return (first.type === second.type) && (first.id === second.id);
}

export function exists(state: AppState, marker: Marker): boolean {
   let markers: Marker[];

   switch (marker.type) {
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

export function remove(state: AppState, marker: Marker): boolean {
   let markers: Marker[];

   switch (marker.type) {
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
   switch (marker.type) {
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
   switch (marker.type) {
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



// class NextStageComputer {
//    stages: ("title" | 'headers' | 'contents')[] = ['title', 'headers', 'contents'];
//    index: number;
//    start: number;
//    completed = false;
//
//    constructor(stage: 'title'  | 'headers' | 'contents') {
//       switch (stage) {
//          case "title": {
//             this.index = 0;
//             this.start = 0;
//             return;
//          }
//          case "headers": {
//             this.index = 1;
//             this.start = 1;
//             return;
//          };
//          case "contents": {
//             this.index = 2;
//             this.start = 2;
//             return;
//          }
//       }
//    }
//
//    next() : 'title' | 'headers' | 'contents' | 'completed' {
//       if (this.completed) return 'completed';
//       this.index++;
//       if (this.index === this.stages.length) this.index == 0;
//       if (this.index === this.start) {
//          this.completed = true;
//          return 'completed';
//       };
//       return this.stages[this.index];
//    }
// }




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

   let stage: 'title' | 'headers' | 'contents' = state.animationStage;
   while (true) {
      switch (stage) {
         case "title": {
            if (state.runningHeaders.length !== 0 && DEBUG) console.error("moving to headers stage of animation but running contents array not empty");
            if (state.headers.length === 0) {
               console.debug("no headers, moving to contents")
               stage = 'headers';
               continue;
            };
            state.animationStage = 'headers';
            state.runningHeaders = state.headers.slice();
            return;
         };

         case "headers": {
            if (state.runningContents.length !== 0 && DEBUG) console.error("moving to contents stage of animation but running contents array not empty");
            if (state.contents.length === 0) {
               console.debug("no contents, finished")
               stage = 'contents';
               continue;
            };
            state.animationStage = 'contents';
            state.runningContents = state.contents.slice();
            return;
         };

         case "contents": {
            state.animationStage = 'title';
            state.lastAnimation = state.currentAnimation;

            switch (state.currentAnimation) {
               case "open": {
                  state.targetPage = null;
                  state.currentAnimation = null;
                  return;
               };
               case "close": {
                  state.currentPage = state.targetPage;
                  state.currentAnimation = null;
                  return;
               };
            };

         };
      };

   };


}
