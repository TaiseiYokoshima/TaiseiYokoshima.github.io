import "./Cursor.css";
import { useRef, useEffect } from "react";

import {  clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Animation, createMarker, register, deRegister, animationComplete, type RootState } from "../store";

export default function Title({ speed = 100 }: {speed?: number }) {
   const textRef = useRef<HTMLDivElement>(null);
   const measured = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   const dispatch = useDispatch();
   const marker = useRef(createMarker('title'));

   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);

   const open = () => new Promise<void>((resolve, _) => {
      let index = 0;
      const interval = setInterval(() => {
         if (textRef.current === null) return;

         if (index === currentPage.length) {
            clear_interval(interval);
            return resolve();
         };

         const char = currentPage[index];
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
      cursorRef.current?.classList.add("paused");
      switch(animation) {
         case "open":
            await open();
            break;
         case "close":
            await close();
            break;
      };
      cursorRef.current?.classList.remove("paused");
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
      if (animationStage !== 'title') return;
      animator(currentAnimation);
   }, [currentAnimation, animationStage])

   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={measured}>{currentPage}</div>
         <div ref={to_set} style={{ display: "inline-block" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline" }} ref={textRef} />
            <span ref={cursorRef} className="cursor" />
         </div>
      </div>
   )
}
