import { useRef, useEffect } from "react";

import { clear_interval } from "../Utils";

import { useSelector } from "react-redux";
import { type RootState } from "../store";

import { FaExternalLinkAlt } from "react-icons/fa";
import { Controller, type Registry } from "../Controllers";

function I({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) {
   return <div ref={ref} style={{ display: 'inline-block', opacity: 0 }}><FaExternalLinkAlt size={13} style={{ display: 'inline-block', margin: '0.5rem' }} /></div>;
}

export default function Span(
   { children, speed = 10, href, email, registry }: { children: string, speed?: number, href?: string, email?: string, registry: Registry }
) {
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

   const ref = useRef<HTMLDivElement>(null);
   const iconRef = useRef<HTMLDivElement>(null);
   const spanRef = useRef<HTMLSpanElement>(null);

   const controller = useRef(new Controller('div'));

   let char_count = 0;
   let span = <span ref={spanRef}>
      {
         (() => {
            let char_i = 0;

            return children.split(" ").map((word, word_i) => {
               if (word_i !== 0) {
                  word = " " + word;
               };

               let wordSpan = <span key={word_i}>{
                  [...word].map(ch => {
                     let char_span = <span key={char_i}  ref={ref}>{ch}</span>;
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
      let start_word = 0;
      let start_char = 0;


      let end_word: number;
      if (!spanRef.current) return console.error("span was null");
      end_word = spanRef.current.childElementCount - 1;
      let end_char = spanRef.current.children[end_word].childElementCount - 1;

      if (iconRef.current) iconRef.current.style.opacity = '0';

      const interval = setInterval(() => {
         if (start_word > end_word) {
            console.log("open finishing, calling resolve");
            clear_interval(interval);
            resolve();
            return
         };

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

   useEffect(() => {
      if (spanRef.current) {
         for (const word of spanRef.current.children) {
            for (const char of word.children) {
               const span = char as HTMLElement;
               span.style.opacity = '0';
            };
         };
      };
   }, []);

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
         registry.deRegister(controller.current);
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
      <div className={"inline-block text-[20px] whitespace-pre-wrap" + extraClasses} ref={ref}>
         {content}
      </div>
   </div>;
}
