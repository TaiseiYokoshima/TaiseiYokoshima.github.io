import "./NavBar.css";
import "../App.css";
import PageItem from "./PageItem";

import { useSelector } from "react-redux";
import { type RootState } from "../store";

import { useEffect, useRef, useState } from "react";
import Settings from "./Settings";

function MenuOpener({callback}: { callback: () => void}) {
   return <div onClick={callback}> Menu » </div>;
}

export default function NavBar() {
   const lastAnimation = useSelector((state: RootState) => state.app.lastAnimation);


   const timeoutRef = useRef<number | null>(null);

   useEffect(() => {
      if (lastAnimation === 'open') {
         scheduleClose();
      };
   }, [lastAnimation]);



   const [ menuOpened, openMenu, closeMenu ] = (() => { 
      const [menuOpened, setter] = useState(false);
      const openMenu = () => setter(true);
      const closeMenu = () => setter(false);
      return [menuOpened, openMenu, closeMenu ];
   })();

   const cancelClose = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
   };

   const scheduleClose: () => void = () => {
      cancelClose();
      const id = setTimeout(closeMenu, 5000);
      timeoutRef.current = id;
   };


   var style = "navbar";
   if (!menuOpened) style += " closed";

   const callback = () => { 
      openMenu();
      scheduleClose();
   };

   return <>
      { (menuOpened) ? undefined : <MenuOpener callback={callback}/> }
      <div className={style}>
         <PageItem cancelClose={cancelClose}>About</PageItem>
         <PageItem cancelClose={cancelClose}>Projects</PageItem>
         <PageItem cancelClose={cancelClose}>Experience</PageItem>
         <PageItem cancelClose={cancelClose}>Education</PageItem>
         <PageItem cancelClose={cancelClose}>Contact</PageItem>
         <Settings cancelClose={cancelClose} scheduleClose={scheduleClose}/>
      </div>
   </>;
}
