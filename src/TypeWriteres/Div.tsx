import { useRef, useEffect } from "react";

import type TyperProps from "./Props";
import {  clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Marker, type Animation, type RootState } from "../store";
import { register, deRegister, animationComplete, createMarker } from "../store";


export default function Div({ children, speed = 30 }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const toSet = useRef<HTMLDivElement>(null);
   const toMeasure = useRef<HTMLDivElement>(null);

   const marker = useRef<Marker>(null);
   const dispatch = useDispatch();
   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);

   const open = () => new Promise<void>((resolve, _) => {
      let new_char = true;
      let index = 0;
      const interval = setInterval(() => {
         if (textRef.current === null) return;

         if (index === children.length) {
            clear_interval(interval);
            resolve();
            return 
         };

         if (new_char) {
            const code = Math.floor(Math.random() * (126 - 32 + 1)) + 32;
            const char = String.fromCharCode(code);
            textRef.current.textContent += char;
            new_char = false;
         } else {
            const char = children[index];
            const old_text = textRef.current.textContent;
            const new_text = old_text.substring(0, index) + char;
            textRef.current.textContent = new_text;
            index++;
            new_char = true;
         }
      }, speed);
   });


   const close = () => new Promise<void>((resolve, _) => {
      if (!textRef.current) return;

      let start = 0;
      let end = textRef.current.textContent.length - 1;

      const interval = setInterval(() => {
         if (textRef.current === null) return;

         if (start > end) {
            textRef.current.textContent = "";
            clear_interval(interval);
            resolve();
            console.log("finished close animation");
            return 
         };


         const chars = textRef.current.textContent.split("");
         chars[start] = " ";
         chars[end] = " ";
         const newText = chars.join("");
         textRef.current.textContent = newText;
         start++;
         end--;
      }, speed);
   });

   const animator = async (animation: Animation): Promise<void> => {
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
      if (toMeasure.current && toSet.current) {
         const { width, height } = toMeasure.current.getBoundingClientRect();
         toSet.current.style.minWidth = `${width}px`;
         toSet.current.style.minHeight = `${height}px`;
      };

      marker.current = createMarker('content');

      dispatch(register(marker.current));
      return () => { if (marker.current) dispatch(deRegister(marker.current)) };
   }, []);

   useEffect(() => {
      if (currentAnimation === null) return;
      if (animationStage !== 'contents') return;
      animator(currentAnimation);
   }, [currentAnimation, animationStage])


   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={toMeasure}>{children}</div>
         <div ref={toSet} style={{ display: "inline-block", verticalAlign: "bottom" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline", whiteSpace: "pre" }} ref={textRef} />
         </div>
      </div>
   )
}
