import { useRef, useEffect } from "react";

import type TyperProps from "./Props";
import {  clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Marker, type Animation, type RootState } from "../store";
import { register, deRegister, animationComplete, createMarker } from "../store";


export default function Div({ children, speed = 10 }: TyperProps) {
   const ref = useRef<HTMLDivElement>(null);

   const marker = useRef<Marker>(null);
   const dispatch = useDispatch();
   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const lastAnimation = useSelector((state: RootState) => state.app.lastAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

   const open = () => new Promise<void>((resolve, _) => {
      let new_char = true;
      let index = 0;
      const interval = setInterval(() => {
         if (ref.current === null) return;

         console.debug(`this is the ${index}`);

         if (index === children.length) {
            clear_interval(interval);
            resolve();
            return 
         };

         if (new_char) {
            const code = Math.floor(Math.random() * (126 - 32 + 1)) + 32;
            const char = String.fromCharCode(code);
            ref.current.textContent += char;
            new_char = false;
         } else {
            const char = children[index];
            const old_text = ref.current.textContent;
            const new_text = old_text.substring(0, index) + char;
            ref.current.textContent = new_text;
            index++;
            new_char = true;
         }
      }, speed);
   });


   const close = () => new Promise<void>((resolve, _) => {
      if (!ref.current) return;

      let start = 0;
      let end = ref.current.textContent.length - 1;

      const interval = setInterval(() => {
         if (ref.current === null) return;

         if (start > end) {
            ref.current.textContent = "";
            clear_interval(interval);
            resolve();
            console.log("finished close animation");
            return 
         };


         const chars = ref.current.textContent.split("");
         chars[start] = " ";
         chars[end] = " ";
         const newText = chars.join("");
         ref.current.textContent = newText;
         start++;
         end--;
      }, speed);
   });

   const animator = async (animation: Animation): Promise<void> => {
      if (!animationEnabled) {
         if (marker.current) dispatch(animationComplete(marker.current));
         return;
      };

      switch(animation) {
         case "open":
            await open();
            break;
         case "close":
            await close();
            break;
      };
      if (marker.current) dispatch(animationComplete(marker.current));
   };


   useEffect(() => {
      if (ref.current) {
         const { width, height } = ref.current.getBoundingClientRect();
         ref.current.style.width = `${width}px`;
         ref.current.style.height = `${height}px`;
         ref.current.style.opacity = '100';
         if (animationEnabled) ref.current.textContent = '';
      };

      marker.current = createMarker('content');

      dispatch(register(marker.current));
      return () => { if (marker.current) dispatch(deRegister(marker.current)) };
   }, []);

   useEffect(() => {
      if (currentAnimation === null) return;
      if (animationStage !== 'contents') return;
      console.debug("useEffect runnign animation");
      animator(currentAnimation);
   }, [currentAnimation, animationStage])



   let style: React.CSSProperties;

   if (!animationEnabled || lastAnimation === 'open') {
      style = { opacity: '100' };
   } else {
      style = { opacity: '0' };
   };

   return <div>
      <div className="inline-block text-[20px] whitespace-pre-wrap" style={style} ref={ref}>
         {children}
      </div>
   </div>;
}
