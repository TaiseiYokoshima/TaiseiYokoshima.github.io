import styles from "./Cursor.module.css";
import { useRef, useEffect } from "react";
import React from "react";

import { clear_interval } from "../Utils";

import { useSelector } from "react-redux";
import { type RootState } from "../store";

import { Controller } from "../Controllers";
import type TyperProps from "./Props";


import Icon from "./Icon";

export default function SpanHeader({ children, speed = 10, href, email, registry, style, className }: TyperProps) {
   const controller = useRef(new Controller('header'));

   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const opened = useSelector((state: RootState) => state.app.opened);

   const iconRef = useRef<HTMLDivElement>(null);
   const spanRef = useRef<HTMLSpanElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);

   let char_count = 0;
   let span = <span ref={spanRef} style={{ whiteSpace: 'pre-line'}}>{
         (() => {
            let char_i = 0;

            return children.split(" ").map((word, word_i) => {
               if (word_i !== 0) {
                  word = " " + word;
               };

               let wordSpan = <span key={word_i}>{
                  [...word].map(ch => {
                     let char_span = <span key={char_i}>{ch}</span>;
                     char_i++;
                     char_count++;
                     return char_span;
                  })
               }</span>;

               return wordSpan;
            })
         })()
   }</span>;


   let content: React.ReactNode = span;
   if (href && email) {
      console.error("both email and href were provided");
   } else if (href) {
      const hrefStr = `https://${href}`;
      const rel = "noopener noreferrer";
      content = (<div className={styles.link}>
         <a role="button" href={hrefStr} target="_blank" rel={rel} style={{display: "inline"}} className={styles.link}>{span}</a>
         <Icon ref={iconRef}/>
      </div>);

   } else if (email) {
      const hrefStr = `mailto:${email}`;
      content = (<div className={styles.link}>
         <a role="button" href={hrefStr} style={{display: "inline"}} className={styles.link}>{span}</a>
         <Icon ref={iconRef} />
      </div>);
   };


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
         if (href || email) console.log("icon ref was null during close");
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
                  iconRef.current.style.display = 'none';
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

      const interval = setInterval(() => {
         if (!spanRef.current) {
            clear_interval(interval);
            resolve();
            console.error("span was null for span header during open");
            if (iconRef.current) iconRef.current.style.display = 'inline';
            return;
         };

         let word = spanRef.current.children[word_i] as HTMLElement;
         if (word.childElementCount === char_i) {
            word_i++;
            char_i = 0;

            if (spanRef.current.childElementCount === word_i) {
               clear_interval(interval);
               if (iconRef.current) iconRef.current.style.display = 'inline';
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

   const closeImmediate = () => {
      if (!animationEnabled || opened) {
         return;
      };

      if (containerRef.current) {
         containerRef.current.style.opacity = '0';
      };

      if (iconRef.current) iconRef.current.style.display = 'none';

      if (spanRef.current) {
         for (const word of spanRef.current.children) {
            for (const char of word.children) {
               const span = char as HTMLElement;
               span.style.display = 'none';
            };
         };
      };

      if (containerRef.current) {
         containerRef.current.style.opacity = '1';
      };
   };

   useEffect(() => {
      if (containerRef.current) { 
         const { height, width }  = containerRef.current.getBoundingClientRect();
         containerRef.current.style.height = `${height}px`;
         containerRef.current.style.width = `${width}px`;
      } else {
         console.error("container ref as well for span header when trying to stablize is height and width");
      };


      const resizeCallback = () => {
         if (containerRef.current) { 
            containerRef.current.style.display = 'inline';
            const { height, width }  = containerRef.current.getBoundingClientRect();
            containerRef.current.style.display = 'inline-block';
            containerRef.current.style.height = `${height}px`;
            containerRef.current.style.width = `${width}px`;
         } else {
            console.error("container ref as well for span header when trying to stablize is height and width");
         };
      };

      window.addEventListener("resize", resizeCallback);

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
         registry.unregister(controller.current);
         controller.current.unregister();
         killed = true;
         window.removeEventListener("resize", resizeCallback);
      };
   }, [])

   useEffect(() => {
      closeImmediate();
   }, [opened])

   return <div>
      <div className={className} style={{display: "inline-block", fontSize: 'var(--m)', ...style}} ref={containerRef}>
         {content}
         <span ref={cursorRef} className={styles.header}/>
      </div>
   </div>;
}
