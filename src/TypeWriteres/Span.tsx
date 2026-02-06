import { useRef, useEffect } from "react";

import { clear_interval } from "../Utils";

import { useSelector } from "react-redux";
import { type RootState } from "../store";

import { Controller } from "../Controllers";
import type TyperProps from "./Props";


import Icon from "./Icon";

export default function Span( { children, speed = 10, href, email, registry }: TyperProps) {

   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const opened = useSelector((state: RootState) => state.app.opened);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);

   const containerRef = useRef<HTMLDivElement>(null);
   const iconRef = useRef<HTMLDivElement>(null);
   const spanRef = useRef<HTMLSpanElement>(null);

   const controller = useRef(new Controller('div'));

   let charI = 0;
   let wordCount =  0;
   const span = <span ref={spanRef} style={{ whiteSpace: 'pre-line'}}>
      {
         (() => {
            return children.split(" ").map((word, word_i) => {
               if (word_i !== 0) {
                  word = " " + word;
               };

               let wordSpan = <span key={word_i}>{
                  [...word].map(ch => {
                     let char_span = <span key={charI}  ref={containerRef}>{ch}</span>;
                     charI++;
                     return char_span;
                  })
               }</span>;

               wordCount++;
               return wordSpan;
            });
         })()
      }
   </span>;


   let content: React.ReactNode = span;
   const classes = 'no-underline hover:underline hover:underline-offset-auto cursor-pointer hover:text-green-500!';
   if (href && email) {
      console.error("both email and href were provided");
   } else if (href) {
      const hrefStr = `https://${href}`;
      const rel = "noopener noreferrer";
      content = (<div style={{ display: 'inline'}} className={classes}>
         <a role="button" href={hrefStr} target="_blank" rel={rel} className="inline">{span}</a>
         <Icon ref={iconRef}/>
      </div>);

   } else if (email) {
      const hrefStr = `mailto:${email}`;
      content = (<div style={{display: 'inline'}} className={classes}>
         <a role="button" href={hrefStr} className="inline">{span}</a>
         <Icon ref={iconRef} />
      </div>);
   };

   const close = () => new Promise<void>((resolve, _) => {
      if (!spanRef.current) { 
         console.error("span was null");
         resolve();
         if (iconRef.current) iconRef.current.style.opacity = '0';
         return;
      };

      let start_word = 0;
      let start_char = 0;
      let gCStart = 0;

      let end_word = spanRef.current.childElementCount - 1;
      let end_char = spanRef.current.children[end_word].childElementCount - 1;
      let gCEnd = charI;

      if (iconRef.current) iconRef.current.style.opacity = '0';

      const interval = setInterval(() => {
         if (gCStart > gCEnd) {
            console.log("open finishing, calling resolve");
            clear_interval(interval);
            resolve();
            return
         };

         if (!spanRef.current) {
            console.error("span was null");
            clear_interval(interval);
            resolve();
            return
         };

         {
            let s_word = spanRef.current.children[start_word];
            let s_char = s_word.children[start_char] as HTMLElement;
            s_char.style.opacity = '0';
            gCStart++;
            start_char++;

            if (start_char === s_word.childElementCount) {
               start_char = 0;
               start_word++;
            };
         };

         {
            let e_word = spanRef.current.children[end_word];
            let e_char = e_word.children[end_char] as HTMLElement;
            e_char.style.opacity = '0';
            gCEnd--;
            end_char--;

            if (end_char === -1) {
               end_word--;
               let word = spanRef.current.children[end_word];
               end_char = word.childElementCount - 1;
            };
         };
      }, speed);
   });

   const open = () => new Promise<void>((resolve, _) => {
      if (!containerRef.current) return;

      let word_i = 0;
      let char_i = 0;

      const interval = setInterval(() => {
         if (!spanRef.current) return;
         let word = spanRef.current.children[word_i] as HTMLElement;
         if (word.childElementCount === char_i) {
            word_i++;
            char_i = 0;

            if (spanRef.current.childElementCount === word_i) {
               clear_interval(interval);
               if (iconRef.current) iconRef.current.style.opacity = '1';
               else console.log("icon ref was null for span");
               resolve();
               return
            };

            word = spanRef.current.children[word_i] as HTMLElement;
         };

         let char = word.children[char_i] as HTMLElement;
         char.style.opacity = '1';
         char_i++;
      }, speed);
   });

   const closeImmediate = () => {
      if (!animationEnabled || opened) {
         return;
      };

      if (!iconRef.current && (href || email)) {
         console.error("href or email were enabled but the icon ref was null: span");
      };

      if (containerRef.current) {
         containerRef.current.style.opacity = '0';
      };

      if (iconRef.current) {
         iconRef.current.style.opacity = '0';
      };

      if (spanRef.current) {
         for (const word of spanRef.current.children) {
            for (const char of word.children) {
               const span = char as HTMLElement;
               span.style.opacity = '0';
            };
         };
      };

      if (containerRef.current) {
         containerRef.current.style.opacity = '1';
      };
   };

   useEffect(() => {
      controller.current.register();
      registry.register(controller.current);


      let killed = false;
      const task = async () => {
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

      task();
      
      return () => {
         controller.current.unregister();
         registry.unregister(controller.current);
         killed = true;
      };
   }, [])


   useEffect(() => {
      closeImmediate();
   }, [opened]);


   return <div>
      <div className="inline-block text-[20px]"  ref={containerRef}>
         {content}
      </div>
   </div>;
}
