import "./Cursor.css";

import { useRef, useEffect } from "react";
import { type TyperProps, clear_interval } from './utils';

export default function Title({ children, speed = 100, controller }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const measured = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);
   const has_run = useRef<boolean>(false);



   const open = () => new Promise<void>((resolve, _) => {
      let index = 0;
      const interval = setInterval(() => {
         if (textRef.current === null) return;

         if (index === children.length) {
            controller?.current.animation_completed();
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
            controller?.current.animation_completed();
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





   useEffect(() => {
      if (has_run.current) return;
      has_run.current = true;

      if (to_set.current && measured.current) {
         const { width, height } = measured.current.getBoundingClientRect();
         to_set.current.style.minHeight = `${height}px`;
         to_set.current.style.minWidth = `${width}px`;
      };


      let isOpen = false;

      const animate = async () => {
         if (!controller) return;

         while (true) {
            const newState = await controller.current.receive();

            if (newState === isOpen) {
               controller.current.animation_completed();
               continue;
            };

            isOpen = newState;
            cursorRef.current?.classList.add("paused");
            if (isOpen) await open()
            else await close();
            cursorRef.current?.classList.remove("paused");
            controller.current.animation_completed();
         };
      };
      animate();
   }, []);

   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={measured}>{children}</div>
         <div ref={to_set} style={{ display: "inline-block" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline" }} ref={textRef} />
            <span ref={cursorRef} className="cursor blinking" />
         </div>
      </div>
   )
}
