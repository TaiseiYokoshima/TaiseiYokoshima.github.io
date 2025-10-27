import "./Cursor.css";
import { useRef, useEffect } from "react";

import type TyperProps from "./Props";
import { Controller } from "../Controllers";
import { createDeferredPromise, clear_interval } from "../Utils";

export default function Header({ children, speed = 100, registry }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const measured = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   const isOpen = useRef(false);

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


   const animator = async (opened: boolean): Promise<void> => {
      if (isOpen.current === opened) return;

      cursorRef.current?.classList.add("paused");
      if (opened) await open();
      else await close();
      isOpen.current = opened;
      cursorRef.current?.classList.remove("paused");
   };


   useEffect(() => {
      if (to_set.current && measured.current) {
         const { width, height } = measured.current.getBoundingClientRect();
         to_set.current.style.minHeight = `${height}px`;
         to_set.current.style.minWidth = `${width}px`;
      };
   }, []);


   useEffect(() => {
      const controller = new Controller("header");
      controller.register();
      registry?.register(controller);

      const { promise, resolver: kill } = createDeferredPromise<void>();
      const cleanup = promise.then(() => true);

      const animate = async () => {
         if (!controller) return;

         while (true)  {
            const animationComplete = controller.animateOnSignal(animator).then(() => false);
            const killed = await Promise.race([cleanup, animationComplete]);
            if (killed) return;
         };
      };

      animate();
      return () => { 
         kill();
         registry?.deRegister(controller);
      };
   });

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
