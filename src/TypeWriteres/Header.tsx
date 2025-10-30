import "./Cursor.css";
import { useRef, useEffect } from "react";

import type TyperProps from "./Props";
import {  clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Animation, type RootState } from "../store";
import { createMarker, register, deRegister, animationComplete } from "../store";


export default function Header({ children, speed = 100 }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const measured = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   const dispatch = useDispatch();
   const marker = useRef(createMarker('header'));

   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);


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
      switch(animation) {
         case "open":
            await open();
            break;
         case "close":
            await close();
            break;
      };
      dispatch(animationComplete(marker.current));
   };


   useEffect(() => {
      if (to_set.current && measured.current) {
         const { width, height } = measured.current.getBoundingClientRect();
         to_set.current.style.minHeight = `${height}px`;
         to_set.current.style.minWidth = `${width}px`;
      };

      dispatch(register(marker.current));

      return () => { dispatch(deRegister(marker.current)) };
   }, []);

   useEffect(() => {
      if (currentAnimation === null) return;
      if (animationStage !== 'headers') return;
      animator(currentAnimation);
   }, [currentAnimation, animationStage])

   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={measured}>{children}</div>
         <div ref={to_set} style={{ display: "inline-block" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline" }} ref={textRef} />
            <span ref={cursorRef} className="header-cursor" />
         </div>
      </div>
   )
}
