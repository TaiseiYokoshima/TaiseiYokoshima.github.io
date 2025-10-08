import { useRef, useEffect } from "react";
import { type TyperProps, clear_interval } from './utils';
import Controller from "./Controller";

export default function Div({ children, speed = 30, registry }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const to_measure = useRef<HTMLDivElement>(null);
   const useEffectHasRan = useRef(false);
   const controller = useRef(new Controller());
   const isOpen = useRef(false);

   const open = () => new Promise<void>((resolve, _) => {
      let new_char = true;
      let index = 0;
      const interval = setInterval(() => {
         if (textRef.current === null) return;

         if (index === children.length) {
            clear_interval(interval);
            resolve();
            console.log("finished open animation");
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
      if (useEffectHasRan.current) return;
      useEffectHasRan.current = true;

      if (registry) registry.current.register(controller);

      if (to_measure.current && to_set.current) {
         const { width, height } = to_measure.current.getBoundingClientRect();
         to_set.current.style.minWidth = `${width}px`;
         to_set.current.style.minHeight = `${height}px`;
      }


      const animate = async () => {
         while (true) await controller.current.animateOnSignal(animator);
      };

      animate();
   }, []);

   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={to_measure}>{children}</div>
         <div ref={to_set} style={{ display: "inline-block", verticalAlign: "bottom" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline", whiteSpace: "pre" }} ref={textRef} />
         </div>
      </div>
   )
}
