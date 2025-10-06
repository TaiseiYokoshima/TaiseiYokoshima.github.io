import './App.css'
import React, { useRef, useEffect } from "react";

interface TypeWriterProps {
   children: String;
   speed?: number;
   promises?: React.RefObject<Promise<void>[]>;
   signal: React.RefObject<{ promise: Promise<void>, resolve: (value: void | PromiseLike<void>) => void }>;
   onComplete?: () => void;
}

export default function TitleTyper({ children, speed = 30, signal }: TypeWriterProps) {
   const textRef = useRef<HTMLDivElement>(null);
   let new_char = true;
   let index = 0;

   useEffect(() => {

      var interval: number;

      const animate = async () => {
         await signal.current.promise;
         interval = setInterval(() => {
            if (textRef.current === null) return;
            if (index === children.length) return clear_interval(interval);

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
            }
         }, speed);
      };

      animate();
      return () => clear_interval(interval);
   }, []);

   const clear_interval = (interval: number) => {
      console.log("clearing internval");
      clearInterval(interval);
   };


   return (
      <h2 style={{ fontFamily: "monospace", fontSize: "20px", whiteSpace: "pre" }} ref={textRef}>
         {" ".repeat(children.length)}
      </h2>
   )
}

