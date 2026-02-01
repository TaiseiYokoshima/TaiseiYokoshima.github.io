import './App.css'
import "./index.css";

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { NavBar } from './NavBar';
import { SpanHeader, Title } from './TypeWriteres';
import PageContent from './Pages';
import type { RootState } from './store';
import { open } from './store';

import AnimationStatus from './AnimationStatus';
import SpanTitle from './TypeWriteres/SpanTitle';
import { Controller, Registry } from './Controllers';

function Opener() {
   const target = useSelector((state: RootState) => state.app.targetPage);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);

   const dispatch = useDispatch();

   useEffect(() => {
      if (target === null) return;
      dispatch(open());
   }, [currentPage]);

   return <></>;
}

const string = `\
I'm a Computer Science graduate with a deep passion for both software and hardware. I thrive on understanding complex technologies, diving deep into the tools I use, optimising my workflow, and continuously improving my skills.
My curiosity has led me to explore and customise Linux environments and development setups, where I find joy in tailoring tools to enhance efficiency and productivity as a programmer.

I'm proficient in a wide range of languages, including Python, Rust, JavaScript, TypeScript, Java, C#, C, SQL, and technologies like Django, React, Flask, Actix-web, and Tokio. I'm also experienced with Docker, Git, Make, and other essential developer tools.

Recently,`;



export default function App() {
   // const contentRef = useRef<HTMLDivElement>(null);

   const controller = useRef(new Controller('title'));
   const registry = useRef(new Registry('header'));


   const open = async () => {
      await controller.current.open();
      await registry.current.open();
   };

   const close = async () => {
      await controller.current.close();
      await registry.current.close();
   };


   return <div className='terminal top-container'>
      <SpanTitle speed={100} controller={controller.current}/>
      <SpanHeader speed={500} registry={registry.current}>{string}</SpanHeader>

      <button onClick={open}>open</button>
      <button onClick={close}>close</button>
   </div>;


   // return (
   //    <>
   //       <div className='terminal top-container'>
   //          <NavBar contentRef={contentRef}/>
   //
   //          <div  className='overflow-y-auto h-full!' ref={contentRef}>
   //             <Title speed={30}/>
   //             <PageContent/>
   //          </div>
   //
   //          <AnimationStatus/>
   //          <Opener/>
   //       </div>
   //    </>
   // );
}







