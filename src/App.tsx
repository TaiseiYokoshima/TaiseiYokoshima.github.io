import './App.css'
import "./index.css";

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { NavBar } from './NavBar';
import type { RootState } from './store';

import { SpanHeader, SpanTitle, Span } from './TypeWriteres';
import { Controller, Registry, PageController } from './Controllers';
import PageContent from './Pages';

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
   const registry = useRef(new PageController(titleController.current, headerRegistry.current, divRegistry.current));

   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const opened = useSelector((state: RootState) => state.app.opened);

   const open = async () => {
      await registry.current.open();
   };

   const close = async () => {
      await registry.current.close();
   };

   useEffect(() => {
      if (!animationEnabled) 
         return;

      if (!opened) {
         console.log("was already opened so not opening");
         registry.current.open();
      };
   }, [currentPage])

   return <div className='terminal top-container'>
      <NavBar contentRef={contentRef} controller={registry.current}/>
      <div className='overflow-y-auto h-full!' ref={contentRef}>
         <SpanTitle speed={100} registry={registry.current}>{currentPage as string}</SpanTitle>
         <PageContent registry={registry.current}/>
      </div>

      <button onClick={open}>open</button>
      <button onClick={close}>close</button>
   </div>;
}







