import "../App.css";
import "./Cursor.css";

import { useRef, useEffect } from "react";
import { type TyperProps, clear_interval } from './utils';

export default function Title({ children, speed = 100, signal, resolver }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const measured = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   let new_char = true;
   let index = 0;

   useEffect(() => {
      if (to_set.current && measured.current) {
         const { width, height } = measured.current.getBoundingClientRect();
         to_set.current.style.minHeight = `${height}px`;
         to_set.current.style.minWidth = `${width}px`;
      };


      var interval: number;

      const animate = async () => {
         if (signal) await signal.current;
         
         cursorRef.current?.classList.add("paused");

         interval = setInterval(() => {
            if (textRef.current === null) return;

            if (index === children.length) {
               resolver?.current();
               cursorRef.current?.classList.remove("paused");
               return clear_interval(interval);
            };

            if (new_char) {
               const code = Math.floor(Math.random() * (126 - 32 + 1)) + 32;
               const char = String.fromCharCode(code);
               const old_text = textRef.current.textContent;
               const new_text = old_text + char;
               textRef.current.textContent = new_text;
               new_char = false;
            } else {
               const char = children[index];
               const old_text = textRef.current.textContent;
               const new_text = old_text.substring(0, index) + char;
               textRef.current.textContent = new_text;
               index++;
               new_char = true;
            };
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
