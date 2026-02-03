import style from "./Cursor.module.css";
import { useRef, useEffect } from "react";
import React from "react";

import { clear_interval } from "../Utils";

import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Controller, Registry } from "../Controllers";



export default function SpanHeader({ children, speed = 10, href, email, registry }: { children: string, speed?: number, href?: string, email?: string, registry: Registry }) {
   const I = React.forwardRef<HTMLDivElement>((_, ref) => {
      return (
         <div ref={ref} style={{ display: 'inline-block' }}>
            <FaExternalLinkAlt size={13} style={{ display: 'inline-block', margin: '0.5rem' }}/>
         </div>
      );
   });

   const controller = useRef(new Controller('header'));
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

   const iconRef = useRef<HTMLDivElement>(null);
   const spanRef = useRef<HTMLSpanElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   let char_count = 0;
   let span = <span ref={spanRef} style={{ display: 'inline', whiteSpace: 'pre-line'}}>{
         (() => {
            let char_i = 0;

            return children.split(" ").map((word, word_i) => {
               if (word_i !== 0) {
                  word = " " + word;
               };

               let wordSpan = <span key={word_i}>{
                  [...word].map(ch => {
                     let char_span = <span key={char_i} style={{ display: 'inline' }}>{ch}</span>;
                     char_i++;
                     char_count++;
                     return char_span;
                  })
               }</span>;

               return wordSpan;
            })
         })()
   }</span>;

   const close = () => new Promise<void>((resolve, _) => {
      console.log("close called for span header");

      if (!spanRef.current) return console.error("span was null for span header");

      let word_i = spanRef.current.childElementCount - 1;
      let char_i = spanRef.current.children[word_i].childElementCount - 1;

      if (word_i === -1) {
         console.error("span has no words for span header");
         resolve();
         return;
      };

      if (iconRef.current) {
         iconRef.current.style.display = 'none';
      } else {
         console.log("icon ref was null during close");
      };

      const interval = setInterval(() => {
         if (!spanRef.current) {
            clear_interval(interval);
            console.error("span was null for span header during close");
            resolve();
            return;
         };

         if (char_i === -1) {
            word_i--;
            if (word_i === -1) {
               clear_interval(interval);

               if (iconRef.current) {
                  iconRef.current.style.display = 'inline-block';
               } else {
                  console.error("icon ref was null for span header");
               };

               resolve();
               console.log("completed span header close");
               return;
            };
            char_i = spanRef.current.children[word_i].childElementCount - 1;
         };

         let word = spanRef.current.children[word_i];
         let char = word.children[char_i] as HTMLElement;
         char.style.display = 'none';
         char_i--;
      }, speed);
   });


   const open = () => new Promise<void>((resolve, _) => {
      console.log("open called on span header");
      let word_i = 0;
      let char_i = 0;

      if (iconRef.current) iconRef.current.style.display = 'none';
      if (spanRef.current) spanRef.current.style.opacity = '1';

      const interval = setInterval(() => {
         if (!spanRef.current) {
            clear_interval(interval);
            console.error("span was null for span header during open");
            resolve();
            return;
         };

         let word = spanRef.current.children[word_i] as HTMLElement;
         if (word.childElementCount === char_i) {
            word_i++;
            char_i = 0;

            if (spanRef.current.childElementCount === word_i) {
               clear_interval(interval);
               if (iconRef.current) iconRef.current.style.display = 'inline-block';
               else console.log("icon ref was null for span");
               console.log("finished open animation");
               resolve();
               return
            };

            word = spanRef.current.children[word_i] as HTMLElement;
         };

         let char = word.children[char_i] as HTMLElement;
         char.style.display = 'inline';
         char_i++;
      }, speed);
   });


   useEffect(() => {
      if (!containerRef.current) 
         return;
      const { height, width }  = containerRef.current.getBoundingClientRect();
      containerRef.current.style.height = `${height}px`;
      containerRef.current.style.width = `${width}px`;

      if (spanRef.current) {
         for (const word of spanRef.current.children) {
            for (const char of word.children) {
               const span = char as HTMLElement;
               span.style.display = 'none';
            };
         };
      };
   }, [])


   useEffect(() => {
      let killed = false;
      let task = async () => {
         while (!killed) {
            let [resolver, value] = await controller.current.consume();
            if (value) {
               await open();
            } else {
               await close();
            };
            resolver();
         };
      };

      controller.current.register();
      task();
      registry.register(controller.current);
      return () => {
         registry.deRegister(controller.current);
         controller.current.unregister();
         killed = true;
      };
   }, [])

   let content: React.ReactNode = span;
   let extraClasses = ' ';

   if (href) {
      content = <a role="button" href={`https://${href}`} target="_blank" rel="noopener noreferrer" className="inline-block">{span}<I ref={iconRef} /></a>;
      extraClasses += 'no-underline hover:underline hover:underline-offset-auto cursor-pointer hover:text-green-500!';
   } else if (email) {
      content = (<a role="button" href={`mailto:${email}`} className="inline-block">{span}<I ref={iconRef} /></a>);
      extraClasses += 'no-underline hover:underline hover:underline-offset-auto cursor-pointer hover:text-green-500!';
   };

   return <div>
      <div className={"inline-block text-[20px]" + extraClasses} ref={containerRef}>{content}<span ref={cursorRef} className={style.header}/></div>
   </div>;
}
