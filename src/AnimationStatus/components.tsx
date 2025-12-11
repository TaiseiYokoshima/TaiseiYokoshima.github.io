import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { useEffect, useRef, useState } from "react";

function MouseClickWarningAndCover() {
   const canceler = useRef<number>(null);
   const closer = useRef<number>(null);

   const textRef = useRef<HTMLDivElement>(null);
   const firstClick = useRef(true);

   const [event, signal] = (() => {
      const [event, signaler] = useState<boolean | null>(null);
      const signal = () => signaler(!event);
      return [event, signal];
   })();

   const onClick = () => {
      console.warn("mouse disabled while animation is running");
      signal();
   };

   const cancel = () => {
      if (canceler.current) clearTimeout(canceler.current);
      if (closer.current) clearInterval(closer.current);

      canceler.current = null;
      closer.current = null;
   };
   
   const close = () => {
      if (!textRef.current) return;
      const str = textRef.current.textContent;
      if (str.length === 0) return cancel();
      const new_str = str.slice(1);
      textRef.current.textContent = new_str;
   };


   const scheduleCloser = () => {
      const id = setInterval(close, 50);
      cancel();
      closer.current = id;
   };
   
   const scheduleClose = () => {
      const id = setTimeout(scheduleCloser, 2000);
      canceler.current = id;
   };

   useEffect(() => {
      if (event === null) return;
      cancel();
      if (textRef.current) {
         textRef.current.textContent = 'mouse inputs are disabled during animation';

         if (firstClick.current) {
            textRef.current.style.width = textRef.current.offsetWidth + 'px';
         };
      };

      scheduleClose();
   }, [event]);

   return <>
      <div onClick={onClick} className="fixed left-0 top-0 min-h-screen min-w-screen z-1000 bg-transparent"/>
      <div className="text-red-500 inline pr-[1vw] flex-[0_0_auto] whitespace-nowrap" ref={textRef}/>
   </>;
}

function AnimationLoader() {
   const loaderRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
      const id = setInterval(() => {
         if (!loaderRef.current) return;
         let dotCount = loaderRef.current.textContent.split(".").length - 1;
         dotCount++;
         
         if (dotCount > 3) {
            dotCount = 1;
         };

         loaderRef.current.textContent = 'animation running ' + '.'.repeat(dotCount);
      }, 500);


      return () => {
         clearInterval(id);
      };
   }, []);


   return <div style={{ display: 'inline'}} ref={loaderRef}>animation running ...</div>;
}

function AnimationCapturer() {
   return <>
      <div className="w-screen! absolute flex justify-between bottom-0 left-0 bg-black px-[0.5vw]!">
         <AnimationLoader/>
         <MouseClickWarningAndCover/>
      </div>
   </>;
}

export default function AnimationStatus() {
   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const lastAnimation = useSelector((state: RootState) => state.app.lastAnimation);
   const targetPage = useSelector((state: RootState) => state.app.targetPage);

   var running: boolean;
   
   if (currentAnimation !== null || targetPage !== null) {
      running = true;
   } else if (targetPage === null && lastAnimation === 'close') {
      running = true;
   } else {
      running = false;
   };
   
   return (running) ? <AnimationCapturer/> : null; 
}

