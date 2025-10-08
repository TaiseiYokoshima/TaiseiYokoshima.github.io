import "./Cursor.css";

import { useRef, useEffect } from "react";
import { type TyperProps, clear_interval } from './utils';

export default function Title({ children, speed = 100, controller }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const measured = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);
   const has_run = useRef<boolean>(false);

   useEffect(() => {
      if (has_run.current) return;
      has_run.current = true;

      if (to_set.current && measured.current) {
         const { width, height } = measured.current.getBoundingClientRect();
         to_set.current.style.minHeight = `${height}px`;
         to_set.current.style.minWidth = `${width}px`;
      };

      let index = 0;
      var interval: number;

      const animate = async () => {
         await controller?.current.await_signal();
         
         cursorRef.current?.classList.add("paused");

         interval = setInterval(() => {
            if (textRef.current === null) return;

            if (index === children.length) {
               cursorRef.current?.classList.remove("paused");
               controller?.current.animation_completed();
               return clear_interval(interval);
            };

            const char = children[index];
            const old_text = textRef.current.textContent;
            const new_text = old_text + char;
            textRef.current.textContent = new_text;
            index++;
         }, speed);
      };

      animate();
      return () => clear_interval(interval);
   }, []);

   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={measured}>{children}</div>
         <div ref={to_set} style={{ display: "inline-block" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline" }} ref={textRef}/>
            <span ref={cursorRef} className="cursor blinking"/>
         </div>
      </div>
   )
}
