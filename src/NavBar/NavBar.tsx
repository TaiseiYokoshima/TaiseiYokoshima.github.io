import "./NavBar.css";
import "../App.css";
import PageItem from "./PageItem";

import { useDispatch, useSelector } from "react-redux";
import { type RootState, toggleSettings } from "../store";
import { useEffect, useRef, useState } from "react";

import Settings from "./Settings";

function MenuOpener({ opener }: { opener: () => void }) {
   return <div onClick={opener} className="opener"> Menu » </div>;
}

function MenuCloser({ closer }: { closer: () => void }) {
   return <div onClick={closer} className="side-components" >«</div>;
}

function SettingsOpener() {
   const dispatch = useDispatch();
   const openSettings = () => dispatch(toggleSettings());
   return <div onClick={openSettings} className="side-components" >⚙</div>;
}

function NavBarCore({ closeMenuNow, cancelClose }: { closeMenuNow: () => void, cancelClose: () => void }) {
   return <div className="navbar">
      <MenuCloser closer={closeMenuNow}/>
      <div className="pages-section">
         <PageItem cancelClose={cancelClose}>About</PageItem>
         <PageItem cancelClose={cancelClose}>Projects</PageItem>
         <PageItem cancelClose={cancelClose}>Experience</PageItem>
         <PageItem cancelClose={cancelClose}>Education</PageItem>
         <PageItem cancelClose={cancelClose}>Contact</PageItem>
      </div>
      <SettingsOpener/>
   </div>;
}




export default function Navbar() {
   const lastAnimation = useSelector((state: RootState) => state.app.lastAnimation);
   const timeoutRef = useRef<number | null>(null);
   const [menuOpened, openMenu, closeMenu] = (() => {
      const [menuOpened, setter] = useState(false);
      const openMenu = () => setter(true);
      const closeMenu = () => setter(false);
      return [menuOpened, openMenu, closeMenu];
   })();

   useEffect(() => {
      if (lastAnimation === 'open') {
         scheduleClose();
      };
   }, [lastAnimation]);


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


   const BarOrOpener = (menuOpened) ? <NavBarCore cancelClose={cancelClose} closeMenuNow={closeMenuNow}/> : <MenuOpener opener={openMenuNow}/>;
   return <>
      { BarOrOpener }
      <Settings/>
   </>;



}
