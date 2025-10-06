import { useRef, useEffect } from "react";
import { type TyperProps, clear_interval } from './utils';

export default function Title({ children, speed = 30, signal, resolver }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   let new_char = true;
   let index = 0;

   useEffect(() => {

      var interval: number;

      const animate = async () => {
         if (signal) await signal.current;

         interval = setInterval(() => {
            if (textRef.current === null) return;

            if (index === children.length) {
               resolver?.current();
               return clear_interval(interval);
            };

            if (new_char) {
               const code = Math.floor(Math.random() * (126 - 32 + 1)) + 32;
               const char = String.fromCharCode(code);
               const old_text = textRef.current.textContent;
               const new_text = old_text.substring(0, index) + char + old_text.substring(index + 1);
               textRef.current.textContent = new_text;
               new_char = false;
            } else {
               const char = children[index];
               const old_text = textRef.current.textContent;
               const new_text = old_text.substring(0, index) + char + old_text.substring(index + 1);
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
      <h2 style={{ fontFamily: "monospace", fontSize: "20px", whiteSpace: "pre" }} ref={textRef}>
         {" ".repeat(children.length)}
      </h2>
   )
}
