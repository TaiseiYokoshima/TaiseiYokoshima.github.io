import "./Cursor.css";
import { useRef, useEffect } from "react";

import type TyperProps from "./Props";
import {  clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Marker, type Animation, type RootState } from "../store";
import { createMarker, register, deRegister, animationComplete } from "../store";


export default function Header({ children, speed = 100 }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   const dispatch = useDispatch();
   const marker = useRef<Marker>(null);

   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const lastAnimation = useSelector((state: RootState) => state.app.lastAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);


   const open = () => new Promise<void>((resolve, _) => {
      let index = 0;
      const interval = setInterval(() => {
         if (textRef.current === null) return;

         if (index === children.length) {
            clear_interval(interval);
            return resolve();
         };

         const char = children[index];
         const old_text = textRef.current.textContent;
         const new_text = old_text + char;
         textRef.current.textContent = new_text;
         index++;
      }, speed);
   });

   const close = () => new Promise<void>((resolve, _) => {
      if (!textRef.current) return;
      let index = textRef.current.textContent.length - 1;
      const interval = setInterval(() => {
         if (!textRef.current) return;

         if (index === 0) {
            textRef.current.textContent = "";
            clear_interval(interval);
            resolve();
            return;
         };

         const oldText = textRef.current.textContent;
         const newText = oldText.substring(0, index);
         textRef.current.textContent = newText;
         index--;
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
      if (textRef.current) {
         const { width, height } = textRef.current.getBoundingClientRect();
         textRef.current.style.height = `${height}px`;
         textRef.current.style.width = `${width}px`;

         if (animationEnabled) textRef.current.textContent = '';
         textRef.current.style.opacity = '100';
      };

      if (cursorRef.current) {
         cursorRef.current.style.opacity = '100';
      };

      marker.current = createMarker('header');
      dispatch(register(marker.current));

      return () => { if (marker.current) dispatch(deRegister(marker.current)) };
   }, []);

   useEffect(() => {
      if (currentAnimation === null) return;
      if (animationStage !== 'headers') return;
      animator(currentAnimation);
   }, [currentAnimation, animationStage])

   let cursorStyle: React.CSSProperties;
   let textStyle: React.CSSProperties;
   if (!animationEnabled || lastAnimation === 'open') {
      cursorStyle = { opacity: 100, };
      textStyle = { opacity: 100, };
   } else {
      cursorStyle = { opacity: 0, };
      textStyle = { opacity: 0, };
   };

   return <div>
      <div className="inline text-[30px]" ref={textRef} style={textStyle}>{ children }</div>
      <span ref={cursorRef} className="header-cursor" style={cursorStyle}/>
   </div>;
}
