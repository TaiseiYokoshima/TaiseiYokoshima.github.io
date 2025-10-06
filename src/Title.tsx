import './App.css'

import { motion } from "framer-motion";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

interface TypeWriterProps {
   children: String;
   speed?: number;
   promises: React.RefObject<Promise<void>[]>;
   onComplete?: () => void;
}

export default function Title({ children, speed = 25, onComplete }: TypeWriterProps) {
   const textRef = useRef<HTMLDivElement>(null);
   let new_char = true;
   let index = 0;

   useEffect(() => {
      const interval = setInterval(() => {
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

      return () => clear_interval(interval);
   }, []);

   const clear_interval = (interval: number) => {
      console.log("clearing internval");
      clearInterval(interval);
   };


   return (
      <div style={{ position: "relative", display: "inline-block" }}>
         <div style={{ position:"absolute", top: 0, left: 0, fontFamily: "monospace", fontSize: "20px", visibility:"hidden" }}>
            {children}
         </div>

         <div style={{  fontFamily: "monospace", fontSize: "20px"  }} ref={textRef}>
            { " ".repeat(children.length) }
         </div>
      </div>
   )
}


