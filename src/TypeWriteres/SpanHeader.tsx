import style from "./Cursor.module.css";
import { useRef, useEffect } from "react";
import React from "react";

import type TyperProps from "./Props";
import { clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Marker, type Animation, type RootState } from "../store";
import { register, deRegister, animationComplete, createMarker } from "../store";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Controller } from "../Controllers";



export default function SpanHeader({ children, speed = 10, href, email, registry }: TyperProps) {
   const I = React.forwardRef<HTMLDivElement>((_, ref) => {
      return (
         <div ref={ref} style={{ display: 'inline-block' }}>
            <FaExternalLinkAlt size={13} style={{ display: 'inline-block', margin: '0.5rem' }}/>
         </div>
      );
   });

   const ref = useRef<HTMLDivElement>(null);
   const controller = useRef(new Controller('header'));
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

   const iconRef = useRef<HTMLDivElement>(null);
   const spanRef = useRef<HTMLSpanElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   let char_count = 0;
   let span = <span ref={spanRef} style={{ opacity: 0 }}>
      {
         (() => {
            let char_i = 0;

            return children.split(" ").map((word, word_i) => {
               if (word_i !== 0) {
                  word = " " + word;
               };

               let wordSpan = <span key={word_i}>{
                  [...word].map(ch => {
                     let char_span = <span key={char_i} style={{ display: 'none' }} ref={ref}>{ch}</span>;
                     char_i++;
                     char_count++;
                     return char_span;
                  })
               }</span>;

               return wordSpan;
            })
         })()
      }
   </span>;

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
            console.error("span was null for span header during close");
            clear_interval(interval);
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

               console.log("completed span header close");
               resolve();
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
      if (!ref.current) return;

      let word_i = 0;
      let char_i = 0;

      if (iconRef.current) iconRef.current.style.display = 'none';
      if (spanRef.current) spanRef.current.style.opacity = '1';

      const interval = setInterval(() => {
         if (!spanRef.current) return;
         let word = spanRef.current.children[word_i] as HTMLElement;
         if (word.childElementCount === char_i) {
            word_i++;
            char_i = 0;

            if (spanRef.current.childElementCount === word_i) {
               clear_interval(interval);
               if (iconRef.current) iconRef.current.style.display = 'inline-block';
               else console.log("icon ref was null for span");
               resolve();
               console.log("finished open animation");
               return
            };

            word = spanRef.current.children[word_i] as HTMLElement;
         };

         let char = word.children[char_i] as HTMLElement;
         char.style.display = 'inline';
         char_i++;
      }, speed);
   });

   const animator = async (animation: Animation): Promise<void> => {
      if (!animationEnabled) {
         if (marker.current) dispatch(animationComplete(marker.current));
         return;
      };

      switch (animation) {
         case "open":
            await open();
            break;
         case "close":
            await close();
            break;
      };
      if (marker.current) dispatch(animationComplete(marker.current));
   };


   useEffect(() => {
      if (!animationEnabled && spanRef.current) {
         let word_i = 0;
         let char_i = 0;

         spanRef.current.style.display = 'inline';

         while (word_i < spanRef.current.childElementCount) {
            let word = spanRef.current.children[word_i];
            if (char_i === word.childElementCount) {
               char_i = 0;
               word_i++;
               continue;
            };

            let char = word.children[char_i] as HTMLElement;
            char.style.opacity = '1';
            char_i++;
         };

         spanRef.current.style.opacity = '1';
         if (iconRef.current) iconRef.current.style.opacity = '1';
      };

      marker.current = createMarker('header');
      dispatch(register(marker.current));
      return () => { if (marker.current) dispatch(deRegister(marker.current)) };
   }, []);

   useEffect(() => {
      if (currentAnimation === null) return;
      if (animationStage !== 'headers') return;
      animator(currentAnimation);
   }, [currentAnimation, animationStage])



   useEffect(() => {
      if (!animationEnabled) {
         return;
      };

      registry?.register(controller.current);
      return () => registry?.deRegister(controller.current);
   }, [animationEnabled])

   let content: React.ReactNode = span;
   let extraClasses = ' ';

   if (href) {
      content = <a role="button" href={`https://${href}`} target="_blank" rel="noopener noreferrer" className="inline-block">{span}<I ref={iconRef}/></a>;
      extraClasses += 'no-underline hover:underline hover:underline-offset-auto cursor-pointer hover:text-green-500!';
   } else if (email) {
      content = (<a role="button" href={`mailto:${email}`} className="inline-block">{span}<I ref={iconRef}/></a>);
      extraClasses += 'no-underline hover:underline hover:underline-offset-auto cursor-pointer hover:text-green-500!';
   };

   return <div>
      <div className={"inline-block text-[20px] whitespace-pre-wrap" + extraClasses} ref={ref}>
         {content}
      </div>
      <span ref={cursorRef} className={style.header}/>
   </div>;
}
