import './App.css'
import "./index.css";

import { useEffect, useRef } from 'react';


import { NavBar } from './NavBar';
import type { RootState } from './store';

import { SpanTitle } from './TypeWriteres';
import { Controller, Registry, PageController } from './Controllers';
import PageContent from './Pages';


import { useSelector, useDispatch } from 'react-redux';
import { open, close, toggleAnimationStatus, changePage, isPage, type Page } from './store';

import AnimationStatus from './AnimationStatus';

export default function App() {
   const contentRef = useRef<HTMLDivElement>(null);

   const titleController = useRef(new Controller('title'));
   const divRegistry = useRef(new Registry('div'));
   const headerRegistry = useRef(new Registry('header'));
   const registry = useRef(new PageController(titleController.current, headerRegistry.current, divRegistry.current));


   const dispatch = useDispatch();

   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
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
      const endpoints = window.location.pathname.split('/').filter((value) => value !== "");

      if (endpoints.length !== 1) {
         return;
      };

      const pageStr = endpoints[0];

      if (!isPage(pageStr)) {
         return
      };

      const page = pageStr as Page;
      if (page !== currentPage) {
         dispatch(changePage(page));
         return;
      };
   }, []);


   useEffect(() => {
      const cb = async () => {
         const endpoints = window.location.pathname.split('/').filter((value) => value !== "");

         if (endpoints.length !== 1) {
            console.error("in the popstate handler the endpoints length was not 1");
            return;
         };

         const page = endpoints[0] as Page;

         if (animationEnabled) {
            dispatch(toggleAnimationStatus());
            await registry.current.close();
            dispatch(toggleAnimationStatus());
         };

         dispatch(changePage(page));
      };

      window.addEventListener("popstate", cb);
      return () => {
         console.warn("main navigator unbinding popstate");
         window.removeEventListener("popstate", cb);
      };
   }, []);


   useEffect(() => {
      const endpoints = window.location.pathname.split('/').filter((value) => value !== "");
      if (endpoints.length === 1 && endpoints[0] as Page === currentPage) {
         return;
      };

      window.history.pushState(null, "", `/${currentPage}`);
   }, [currentPage])


   useEffect(() => {
      if (!animationEnabled)
         return;

      if (!opened) {
         openAnimation();
      };

   }, [currentPage])

   return <div className='terminal top-container'>
      <NavBar contentRef={contentRef} controller={registry.current} />
      <div className='overflow-y-auto h-full!' ref={contentRef}>
         <SpanTitle speed={100} registry={registry.current}>{currentPage as string}</SpanTitle>
         <PageContent registry={registry.current} />
      </div>

      <button onClick={openAnimation}>open</button>
      <button onClick={closeAnimation}>close</button>
      <AnimationStatus />
   </div>;
}
