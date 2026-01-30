import { useRef, useEffect } from "react";

import type TyperProps from "./Props";
import { clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Marker, type Animation, type RootState } from "../store";
import { register, deRegister, animationComplete, createMarker } from "../store";


import { FaExternalLinkAlt } from "react-icons/fa";

function I({ ref }: {ref: React.RefObject<HTMLDivElement | null>}) {
   return <div ref={ref} style={{ display: 'inline-block', opacity: 0 }}><FaExternalLinkAlt size={13} style={{ display: 'inline-block', margin: '0.5rem' }}/></div>;
}

export default function Span({ children, speed = 10, href, email }: TyperProps) {
   const ref = useRef<HTMLDivElement>(null);

   const marker = useRef<Marker>(null);
   const dispatch = useDispatch();
   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

   const iconRef = useRef<HTMLDivElement>(null);

   const spanRef = useRef<HTMLSpanElement>(null);
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
                     let char_span = <span key={char_i} style={{ opacity: 0 }} ref={ref}>{ch}</span>;
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

   console.log("char count: " + char_count);

   const close = () => new Promise<void>((resolve, _) => {
      console.log("close called for span");

      let start_word = 0;
      let start_char = 0;


      let end_word: number;
      if (!spanRef.current) return console.error("span was null");
      end_word = spanRef.current.childElementCount - 1;
      let end_char = spanRef.current.children[end_word].childElementCount - 1;

      const interval = setInterval(() => {
         if (start_word > end_word) {
            console.log("open finishing, calling resolve");
            clear_interval(interval);
            resolve();
            return
         };

         console.log("iterating");
         if (spanRef.current) {
            {
               let s_word = spanRef.current.children[start_word];
               let s_char = s_word.children[start_char] as HTMLElement;
               s_char.style.opacity = '0';
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
               end_char--;

               if (end_char === -1) {
                  end_word--;
                  let word = spanRef.current.children[end_word];
                  end_char = word.childElementCount - 1;
               };
            };
         } else {
            console.error("span was null");
            clear_interval(interval);
            resolve();
            return
         };
      }, speed);
   });


   const open = () => new Promise<void>((resolve, _) => {
      if (!ref.current) return;

      let word_i = 0;
      let char_i = 0;

      if (spanRef.current) spanRef.current.style.opacity = '1';

      const interval = setInterval(() => {
         if (!spanRef.current) return;
         let word = spanRef.current.children[word_i] as HTMLElement;
         if (word.childElementCount === char_i) {
            word_i++;
            char_i = 0;

            if (spanRef.current.childElementCount === word_i) {
               clear_interval(interval);
               if (iconRef.current) iconRef.current.style.opacity = '1';
               resolve();
               console.log("finished open animation");
               return
            };

            word = spanRef.current.children[word_i] as HTMLElement;
         };

         let char = word.children[char_i] as HTMLElement;
         char.style.opacity = '1';
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

         spanRef.current.style.opacity = '0';

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

      marker.current = createMarker('content');
      dispatch(register(marker.current));
      return () => { if (marker.current) dispatch(deRegister(marker.current)) };
   }, []);

   useEffect(() => {
      if (currentAnimation === null) return;
      if (animationStage !== 'contents') return;
      animator(currentAnimation);
   }, [currentAnimation, animationStage])



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
   </div>;
}
