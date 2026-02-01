import style from "./Cursor.module.css";

import { clear_interval } from "../Utils";
import { type RootState } from "../store";

import { useRef, useEffect } from "react";
import {  useSelector } from "react-redux";
import type { Controller } from "../Controllers";

export default function SpanTitle({ speed = 10, controller }: { speed?: number, controller: Controller }) {
   const cursorRef = useRef<HTMLSpanElement>(null);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const spanRef = useRef<HTMLSpanElement>(null);

   const page_string = currentPage as string;
   let char_count = 0;
   let span = <span ref={spanRef}>
      {
         (() => {
            let char_i = 0;
            return [...page_string].map(ch => {
               let char_span = <span key={char_i} style={{ display: 'none'}}>{ch}</span>;
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
