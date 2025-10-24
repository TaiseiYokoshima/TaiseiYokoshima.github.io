import './App.css'
import { useState, useEffect, useRef, } from 'react';

import { Controller, Registry } from './TypeWriteres';
import NavBar from './NavBar/NavBar';

import PageController from './PageController';


import { Title } from './TypeWriteres';


import { type Page } from './NavBar/utils';

import { About, Projects } from './Pages';

function App() {
   const [page, setPage] = useState<Page>("about");

   const title = new Controller("title");
   const headers = new Registry("headers");
   const contents = new Registry("contents");
   const pageController = new PageController(title, headers, contents);

   const coverer = useRef<HTMLDivElement>(null);
   const isRunning = useRef(false);

   useEffect(() => {
      const initialization = async () => {
         if (isRunning.current) return;
         isRunning.current = true;

         await pageController.open();
         console.log("opened");

         if (coverer.current) {
            console.log("remove coverer");
            coverer.current.style.visibility = "hidden";
         };

         isRunning.current = false;
      };

      initialization();
   }, [page]);


   const covererOnClick = () => console.warn("mouse disabled while animation is running");
   const bringUp = () => {
      if (coverer.current) coverer.current.style.visibility = "visible";
   };



   let pageContent;
   switch (page) {
      case "about":
         pageContent = <About contents={contents} headers={headers}/>;
         break;
      case "projects":
         pageContent = <Projects contents={contents} headers={headers}/>;
         break;
      default:
         pageContent = <Projects contents={contents} headers={headers}/>;
   };

   return (
      <>
         <div className='terminal'>
            <div ref={coverer} onClick={covererOnClick} style={{
               position: "absolute", 
               left: 0, top: 0, 
               minHeight: "100vh", minWidth: "100vw", 
               backgroundColor: "transparent"
            }}/>

            <NavBar setPage={setPage} page={page} pageController={pageController} bringUp={bringUp}/>
            <Title controller={title} speed={30}>{ page }</Title>
            { pageContent }
         </div>
      </>
   );
}

export default App;
