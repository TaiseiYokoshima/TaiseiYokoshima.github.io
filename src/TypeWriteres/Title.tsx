import style from "./Cursor.module.css";

import {  clear_interval } from "../Utils";
import { type Marker, type Animation, createMarker, register, deRegister, animationComplete, type RootState } from "../store";

import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Title({ speed = 10 }: {speed?: number }) {
   const textRef = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   const dispatch = useDispatch();
   const marker = useRef<Marker>(null);

   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

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
      if (!animationEnabled) {
         if (marker.current)  dispatch(animationComplete(marker.current));
         return;
      };

      cursorRef.current?.classList.add(style.paused);
      switch(animation) {
         case "open":
            await open();
            break;
         case "close":
            await close();
            break;
      };
      cursorRef.current?.classList.remove(style.paused);
      if (marker.current) dispatch(animationComplete(marker.current));
   };

   useEffect(() => {
      marker.current = createMarker('title');
      dispatch(register(marker.current));
      return () => { if (marker.current) dispatch(deRegister(marker.current)) };
   }, []);

   useEffect(() => {
      if (currentAnimation === null) return;
      if (animationStage !== 'title') return;
      animator(currentAnimation);
   }, [currentAnimation, animationStage])

   return <div className="flex justify-center my-[5vh]!">
      <div>
         <div className="text-[30px] inline text-center" ref={textRef}/>
         <span ref={cursorRef} className={style.cursor}/>
      </div>
   </div>;
}
