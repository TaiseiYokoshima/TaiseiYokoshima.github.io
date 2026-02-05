import style from "./Cursor.module.css";

import { clear_interval } from "../Utils";
import { type RootState } from "../store";

import { useRef, useEffect } from "react";
import {  useSelector } from "react-redux";
import type TyperProps from "./Props";

export default function SpanTitle({ speed = 10, registry, children }: TyperProps) {
   const cursorRef = useRef<HTMLSpanElement>(null);
   const spanRef = useRef<HTMLSpanElement>(null);

   const opened = useSelector((state: RootState) => state.app.opened);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

   const controller = registry.title;

   const pageString = children;
   let char_count = 0;
   let span = <span ref={spanRef}>
      {
         (() => {
            let char_i = 0;
            return [...pageString].map(ch => {
               let char_span = <span key={char_i}>{ch}</span>;
               char_i++;
               char_count++;
               return char_span;
            });
         })()
      }
   </span>;

   const open = () => new Promise<void>((resolve, _) => {
      if (!spanRef.current) {
         console.error("open called on span title but the span ref as well");
         resolve();
         return;
      };


      let index = 0;
      const end = spanRef.current.childElementCount - 1;

      if (cursorRef.current) cursorRef.current.classList.add(style.paused);

      const interval = setInterval(() => {
         if (!spanRef.current) {
            clear_interval(interval);
            console.error("open animation for title interval killed because span ref was null");
            if (cursorRef.current) cursorRef.current.classList.remove(style.paused);
            resolve();
            return;
         };

         if (index > end) {
            clear_interval(interval);
            console.log("open animation finished killing interval: span title");
            if (cursorRef.current) cursorRef.current.classList.remove(style.paused);
            resolve();
            return;
         };


         const char = spanRef.current.children[index] as HTMLTimeElement;
         char.style.display = 'inline';
         index++;
      }, speed);
   });

   const close = () => new Promise<void>((resolve, _) => {
      if (!spanRef.current) {
         console.error("close called on span title but the span ref as well");
         resolve();
         return;
      };

      if (cursorRef.current) cursorRef.current.classList.add(style.paused);

      let i = spanRef.current.childElementCount - 1;

      const interval = setInterval(() => {
         if (!spanRef.current) {
            clear_interval(interval);
            console.error("open animation for title interval killed because span ref was null");
            resolve();
            if (cursorRef.current) cursorRef.current.classList.remove(style.paused);
            return;
         };

         if (i < 0) {
            clear_interval(interval);
            console.log("close animation finished killing interval: span title");
            if (cursorRef.current) cursorRef.current.classList.remove(style.paused);
            resolve();
            return;
         };


         const char = spanRef.current.children[i] as HTMLElement;
         char.style.display = 'none';
         i--;
      }, speed);
   });


   useEffect(() => {
      if (!animationEnabled || opened) {
         return;
      };

      if (!spanRef.current)  {
         return;
      };

      spanRef.current.style.opacity = '0';
      for (const char of spanRef.current.children) {
         const element = char as HTMLElement;
         element.style.display = 'none';
      };

      spanRef.current.style.opacity = '1';
   }, [])

   useEffect(() => {
      controller.register();

      let killed = false;
      const task = async () => {
         while (!killed) {
            let [resolver, value] = await controller.consume();
            if (value) {
               await open();
            } else {
               await close();
            };
            resolver();
         };
      };
      task();

      return () => {
         killed = true;
         controller.unregister();
      };
   }, [])



   return <div className="flex justify-center mt-[20vh]!">
      <div>
         { span }
         <span ref={cursorRef} className={style.cursor}/>
      </div>
   </div>;
}
