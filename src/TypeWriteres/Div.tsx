import "../App.css";
import { useRef, useEffect } from "react";
import { type TyperProps, clear_interval, createReffedDefferedPromise } from './utils';

function get_resolver(promises: React.RefObject<Promise<void>[]> | undefined) {
   if (promises) {
      const { promise, resolver } = createReffedDefferedPromise<void>();
      promises.current.push(promise);
      return resolver;
   };

   return undefined;
}

export default function Div({ children, speed = 30, signal, promises }: TyperProps) {
   const textRef = useRef<HTMLDivElement>(null);
   const to_set = useRef<HTMLDivElement>(null);
   const to_measure = useRef<HTMLDivElement>(null);
   const has_run = useRef(false);

   useEffect(() => {
      if (has_run.current) return console.log("use effect has already ran for div");
      has_run.current = true;

      console.log("use effect ran");
      if (to_measure.current && to_set.current) {
         const {width, height} = to_measure.current.getBoundingClientRect();
         to_set.current.style.minWidth = `${width}px`;
         to_set.current.style.minHeight = `${height}px`;
      }

      let new_char = true;
      let index = 0;

      const maybe_resolver = get_resolver(promises);
      let interval: number;
      const animate = async () => {
         if (signal) await signal.current;

         interval = setInterval(() => {
            if (textRef.current === null) return;

            if (index === children.length) {
               maybe_resolver?.();
               return clear_interval(interval)
            };

            if (new_char) {
               const code = Math.floor(Math.random() * (126 - 32 + 1)) + 32;
               const char = String.fromCharCode(code);
               textRef.current.textContent += char;
               new_char = false;
            } else {
               const char = children[index];
               const old_text = textRef.current.textContent;
               const new_text = old_text.substring(0, index) + char;
               textRef.current.textContent = new_text;
               index++;
               new_char = true;
            }
         }, speed);
      };

      animate();
      return () => clear_interval(interval);
   }, []);

   return (
      <div>
         <div style={{ position: "absolute", visibility: "hidden", fontFamily: "monospace", fontSize: "20px", }} ref={to_measure}>{children}</div>
         <div ref={to_set} style={{ display: "inline-block", verticalAlign: "bottom" }}>
            <div style={{ fontFamily: "monospace", fontSize: "20px", display: "inline" }} ref={textRef}/>
         </div>
      </div>
   )
}

