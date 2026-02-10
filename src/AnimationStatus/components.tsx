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

   const callback = () => {
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
      <div onWheel={callback} onClick={callback} style={{
         position: "fixed",
         left: 0,
         top: 0,
         minHeight: '100vh',
         minWidth: '100vw',
         zIndex: '1000',
         backgroundColor: 'transparent',
      }}/>
      <div style={{
         color: '#ef4444',
         display: 'inline',
         paddingRight: '1vw',
         flex: '0 0 auto',
         whiteSpace: 'nowrap',
      }} ref={textRef}/>
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

   return <div style={{display: 'inline'}} ref={loaderRef}>animation running ...</div>;
}

function AnimationCapturer() {
   return <>
      <div style={{
         width: '100vw',
         position: 'absolute',
         display: 'flex',
         justifyContent: 'space-between',
         bottom: '0',
         left: '0',
         background: 'black',
         paddingLeft: '0.5vw',
         paddingRight: '0.5vw',
      }}>
         <AnimationLoader/>
         <MouseClickWarningAndCover/>
      </div>
   </>;
}

export default function AnimationStatus() {
   const running = useSelector((state: RootState) => state.app.animationRunning);
   return (running) ? <AnimationCapturer/> : null; 
}

