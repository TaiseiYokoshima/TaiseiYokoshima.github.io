import { useRef, useEffect } from "react";
import { type TyperProps, clear_interval } from './utils';
import Controller from "./Controller";

import { createDeferredPromise } from "./utils";

export default function Div({ children, speed = 30, registry }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const toSet = useRef<HTMLDivElement>(null);
   const toMeasure = useRef<HTMLDivElement>(null);

   const isOpen = useRef(false);

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

   const animator = async (opened: boolean): Promise<void> => {
      if (isOpen.current === opened) return;
      if (opened) await open();
      else await close();
      isOpen.current = opened;
   };


   useEffect(() => {
      if (toMeasure.current && toSet.current) {
         const { width, height } = toMeasure.current.getBoundingClientRect();
         toSet.current.style.minWidth = `${width}px`;
         toSet.current.style.minHeight = `${height}px`;
      };
   }, []);

   useEffect(() => {
      const controller = new Controller("div");
      controller.register();
      registry?.register(controller);

      const { promise, resolver: kill } = createDeferredPromise<void>();
      const killed = promise.then(() => true);

      const animate = async () => {
         while (true) {
            const animationCompleted = controller.animateOnSignal(animator).then(() => false);
            const result = await Promise.race([killed, animationCompleted]);
            if (result) return;
         }
      };

      animate();
      return () => { 
         kill();
         registry?.deRegister(controller);
      };
   }, [children]);

   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={toMeasure}>{children}</div>
         <div ref={toSet} style={{ display: "inline-block", verticalAlign: "bottom" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline", whiteSpace: "pre" }} ref={textRef} />
         </div>
      </div>
   )
}
