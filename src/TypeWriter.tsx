import './App.css'

import { motion } from "framer-motion";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";


interface TypeWriterProps {
   text: String;
   speed?: number;
   onComplete?: () => void;
}

export default function TypeWriter({ text, speed = 10, onComplete }: TypeWriterProps) {
   const coverRef = useRef<HTMLDivElement>(null);

   const textRef = useRef<HTMLDivElement>(null);
   const [textWidth, setTextWidth] = useState(0);

   const charRef = useRef<HTMLDivElement>(null);
   const [charWidth, setCharWidth] = useState(0);

   const [measured, setMeasured] = useState(false);

   useLayoutEffect(() => {
      if (textRef.current && charRef.current) {
         let width = textRef.current.getBoundingClientRect().width;
         setTextWidth(width);

         width = charRef.current.getBoundingClientRect().width;
         setCharWidth(width);

         setMeasured(true);
      }
   }, []);

   const clear_interval = (interval: number) => {
      console.log("clearing internval");
      clearInterval(interval);
   };

   useEffect(() => {
      if (!measured) return;

      const interval = setInterval(() => {
         if (coverRef.current) {
            
            const cover_size = coverRef.current.getBoundingClientRect().width;

            if (cover_size <= charWidth) {
               clear_interval(interval);
               coverRef.current.style.width = "0px";
               console.log("came here");
               onComplete?.();
               return;
            }

            coverRef.current.style.width = `${cover_size - charWidth}px`;
         }
      }, speed);

      return () => clear_interval(interval);
   }, [measured]);

   return (
      <div style={{ position: "relative", display: "inline-block", background: "black" }}>
         <div style={{ fontFamily: "monospace", fontSize: "20px", position: "absolute", top: 0, left: 0, visibility: "hidden", pointerEvents: "none" }} ref={charRef}>
            a
         </div>

         <div style={{ fontFamily: "monospace", fontSize: "20px" }} ref={textRef}>
            {text}
         </div>

         <div style={{ position: "absolute", height: "100%", width: `${textWidth}px`, top: 0, right: 0, pointerEvents: "none", background: "black" }} ref={coverRef}>
         </div>
      </div>
   )
}
