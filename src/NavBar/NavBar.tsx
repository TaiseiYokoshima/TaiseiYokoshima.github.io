import "./NavBar.css";
import "../App.css";
import PageItem from "./PageItem";

import { useDispatch, useSelector } from "react-redux";
import { type RootState, toggleSettings } from "../store";
import { useEffect, useRef, useState } from "react";

import Settings from "./Settings";

function MenuOpener({callback}: { callback: () => void}) {
   return <div onClick={callback} style={{ position: "absolute", left: 0, top: 0, marginTop: '1vh', marginLeft: '1vh', fontSize: '20px', cursor: 'pointer'}}> Menu » </div>;
}

function MenuCloser({ callback }: {callback: () => void}) {
   return <div onClick={callback} className="side-components" >«</div>;
}


function SettingsOpener({ callback }: { callback: () => void }) {
   return <div  onClick={callback} className="side-components" >⚙</div>;
}

export default function NavBar() {
   const lastAnimation = useSelector((state: RootState) => state.app.lastAnimation);
   const dispatch = useDispatch();
   const openSettings = () => dispatch(toggleSettings());
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


   const closeMenuNow = () => { 
      cancelClose();
      closeMenu();
   };

   const openMenuNow = () => {
      openMenu();
      scheduleClose();
   };

   return <>
      { (menuOpened) ? 
         <div className="navbar">
            <MenuCloser callback={closeMenuNow}/>
            <div className="pages-section">
               <PageItem cancelClose={cancelClose}>About</PageItem>
               <PageItem cancelClose={cancelClose}>Projects</PageItem>
               <PageItem cancelClose={cancelClose}>Experience</PageItem>
               <PageItem cancelClose={cancelClose}>Education</PageItem>
               <PageItem cancelClose={cancelClose}>Contact</PageItem>
            </div>
            <SettingsOpener callback={openSettings}/>
         </div>
         : <MenuOpener callback={openMenuNow}/> 
      }
      <Settings/>
   </>;
}
