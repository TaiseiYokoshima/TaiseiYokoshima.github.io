import style from "./Cursor.module.css";
import { useRef, useEffect } from "react";

import type TyperProps from "./Props";
import {  clear_interval } from "../Utils";

import { useDispatch, useSelector } from "react-redux";
import { type Marker, type Animation, type RootState } from "../store";
import { createMarker, register, deRegister, animationComplete } from "../store";


import { FaExternalLinkAlt } from "react-icons/fa";


function I() {
   return <FaExternalLinkAlt size={13} style={{ display: 'inline-block', margin: '0.5rem'}}/>;
}

export default function Header({ children, speed = 100, href, email }: TyperProps) {
   const toMeasure = useRef<HTMLDivElement>(null);
   const cursorRef = useRef<HTMLSpanElement>(null);

   const textRef = useRef<HTMLDivElement | null>(null);
   
   const dispatch = useDispatch();
   const marker = useRef<Marker>(null);

   const currentAnimation = useSelector((state: RootState) => state.app.currentAnimation);
   const lastAnimation = useSelector((state: RootState) => state.app.lastAnimation);
   const animationStage = useSelector((state: RootState) => state.app.animationStage);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);


   const open = () => new Promise<void>((resolve, _) => {
      let index = 0;
      const interval = setInterval(() => {
         if (textRef.current === null) return;

         if (index === children.length) {
            clear_interval(interval);
            return resolve();
         };

         const char = children[index];
         const old_text = textRef.current.textContent;
         const new_text = old_text + char;
         textRef.current.textContent = new_text;
         index++;
      }, speed);
   });

   const close = () => new Promise<void>((resolve, _) => {
      if (!textRef.current) return;

      let index = textRef.current.textContent.length - 1;
      const interval = setInterval(() => {
         if (!textRef.current) return;

         if (index === 0) {
            textRef.current.textContent = "";

            clear_interval(interval);
            resolve();
            return;
         };

         const oldText = textRef.current.textContent;
         const newText = oldText.substring(0, index);
         textRef.current.textContent = newText;
         index--;
      }, speed);
   });


   const animator = async (animation: Animation): Promise<void> => {
      if (!animationEnabled) {
         if (marker.current) dispatch(animationComplete(marker.current));
         return;
      };

      switch(animation) {
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
      if (toMeasure.current) {
         const { width, height } = toMeasure.current.getBoundingClientRect();
         toMeasure.current.style.height = `${height}px`;
         toMeasure.current.style.width = `${width}px`;

         if (animationEnabled && textRef.current) textRef.current.textContent = '';
         if (textRef.current) textRef.current.style.opacity = '100';
      };

      if (cursorRef.current) {
         cursorRef.current.style.opacity = '100';
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

   let extraClasses = ' ';
   if (href || email) {
      extraClasses += 'text-[30px] no-underline! hover:underline! hover:underline-offset-auto! cursor-pointer hover:text-green-500!';
   };

   let cursorStyle: React.CSSProperties;
   let textStyle: React.CSSProperties;
   let content: React.ReactNode; 



   // after open loaded and no animation is currently running
   if (!animationEnabled || (lastAnimation === 'open' && currentAnimation === null )) {
      cursorStyle = { opacity: 100, };
      textStyle = { opacity: 100, };

      if (href) {
         content = (<a href={`https://${href}`} target="_blank" rel="noopener noreferrer" className={"inline-block" + extraClasses}>{children}<I/></a>);
      } else if (email) {
            content = (<a href={`mailto:${href}`} className={"inline-block" + extraClasses}>{children}</a>);
      } else {
         content = <div className={"inline text-[30px]" + extraClasses} ref={textRef} style={textStyle}>{ children }</div>;
      };
   } 
   else if (currentAnimation === 'close') {
      cursorStyle = { opacity: 100, };
      textStyle = { opacity: 100, };
      content = <div className={"inline text-[30px]" + extraClasses} ref={textRef} style={textStyle}>{ children }</div>;
   } 
   else {
      cursorStyle = { opacity: 0, };
      textStyle = { opacity: 0, };
      content = <div className="inline text-[30px]" ref={textRef} style={textStyle}>{ children }</div>;
   };


   return <div ref={toMeasure}>
      {content}
      <span ref={cursorRef} className={style.header} style={cursorStyle}/>
   </div>;
}
