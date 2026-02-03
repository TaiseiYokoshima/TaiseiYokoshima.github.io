import './App.css'
import "./index.css";

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { NavBar } from './NavBar';
import type { RootState } from './store';
import { open } from './store';

import { SpanHeader, SpanTitle, Span } from './TypeWriteres';
import { Controller, Registry, PageController } from './Controllers';

// function Opener() {
//    const target = useSelector((state: RootState) => state.app.targetPage);
//    const currentPage = useSelector((state: RootState) => state.app.currentPage);
//
//    const dispatch = useDispatch();
//
//    useEffect(() => {
//       if (target === null) return;
//       dispatch(open());
//    }, [currentPage]);
//
//    return <></>;
// }

const divStr = `\
I'm a Computer Science graduate with a deep passion for both software and hardware. I thrive on understanding complex technologies, diving deep into the tools I use, optimising my workflow, and continuously improving my skills.
My curiosity has led me to explore and customise Linux environments and development setups, where I find joy in tailoring tools to enhance efficiency and productivity as a programmer.

I'm proficient in a wide range of languages, including Python, Rust, JavaScript, TypeScript, Java, C#, C, SQL, and technologies like Django, React, Flask, Actix-web, and Tokio. I'm also experienced with Docker, Git, Make, and other essential developer tools.

Recently,`;

const headerStr = 'TEST';


export default function App() {
   const contentRef = useRef<HTMLDivElement>(null);

   const titleController = useRef(new Controller('title'));
   const divRegistry = useRef(new Registry('div'));
   const headerRegistry = useRef(new Registry('header'));
   const pageController = useRef(new PageController(titleController.current, headerRegistry.current, divRegistry.current));


   const open = async () => {
      await pageController.current.open();
   };

   const close = async () => {
      await pageController.current.close();
   };

   return <div className='terminal top-container'>
      <NavBar contentRef={contentRef} controller={pageController.current}/>
      <SpanTitle speed={100} controller={titleController.current}/>
      <SpanHeader speed={10} registry={headerRegistry.current}>{headerStr}</SpanHeader>
      <Span speed={10} registry={divRegistry.current}>{divStr}</Span>

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







