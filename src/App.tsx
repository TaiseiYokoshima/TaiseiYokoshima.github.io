import './App.css'
import "./index.css";

import { useEffect, useRef } from 'react';


import { NavBar } from './NavBar';
import type { RootState } from './store';

import { SpanTitle } from './TypeWriteres';
import { Controller, Registry, PageController } from './Controllers';
import PageContent from './Pages';


import { useSelector, useDispatch } from 'react-redux';
import { open, close, toggleAnimationStatus } from './store';

import AnimationStatus from './AnimationStatus';

export default function App() {
   const contentRef = useRef<HTMLDivElement>(null);

   const titleController = useRef(new Controller('title'));
   const divRegistry = useRef(new Registry('div'));
   const headerRegistry = useRef(new Registry('header'));
   const registry = useRef(new PageController(titleController.current, headerRegistry.current, divRegistry.current));


   const dispatch = useDispatch();

   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const opened = useSelector((state: RootState) => state.app.opened);

   const openAnimation = async () => {
      dispatch(toggleAnimationStatus());
      await registry.current.open();
      dispatch(open());
      dispatch(toggleAnimationStatus());
   };

   const closeAnimation = async () => {
      dispatch(toggleAnimationStatus());
      await registry.current.close();
      dispatch(close());
      dispatch(toggleAnimationStatus());
   };

   useEffect(() => {
      if (!animationEnabled) 
         return;

      if (!opened) {
         openAnimation();
      };

   }, [currentPage])

   return <div className='terminal top-container'>
      <NavBar contentRef={contentRef} controller={registry.current}/>
      <div style={{overflowY: 'auto', height: "100%"}} ref={contentRef}>
         <SpanTitle speed={100} registry={registry.current}>{currentPage as string}</SpanTitle>
         <PageContent registry={registry.current}/>
      </div>

      <button style={{backgroundColor: 'transparent'}} onClick={openAnimation}>open</button>
      <button style={{backgroundColor: 'transparent'}} onClick={closeAnimation}>close</button>
      <AnimationStatus/>
   </div>;
}
