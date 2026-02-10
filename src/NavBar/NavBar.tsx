import styles from "./NavBar.module.css";
import "../App.css";
import PageItem from "./PageItem";

import { useDispatch } from "react-redux";
import { toggleSettings } from "../store";
import { useRef, useState, type RefObject } from "react";

import Settings from "./Settings";
import type { PageController } from "../Controllers";



function MenuOpener({ opener }: { opener: () => void }) {
   return <div style={{
      position: 'absolute',
      width: '100vw',
      paddingLeft: '1vw',
      paddingRight: '1vw',
      paddingTop: '1vw',
      paddingBottom: '1vw',
   }}>
      <div role="button" onClick={opener} className={styles.menuText}>Menu »</div>
   </div>;
}

function MenuCloser({ closer }: { closer: () => void }) {
   return <div role="button" onClick={closer} className={styles.sideComponents}>«</div>;
}

function SettingsOpener({ cancelClose }: { cancelClose: () => void }) {
   const dispatch = useDispatch();
   const openSettings = () => { 
      cancelClose();
      dispatch(toggleSettings());
   };

   return <div role="button" onClick={openSettings} className={styles.sideComponents}>⚙</div>;
}

function NavBarCore({ closeMenuNow, cancelClose, contentRef, controller }: { closeMenuNow: () => void, cancelClose: () => void, contentRef: RefObject<HTMLDivElement | null>, controller: PageController }) {
   return <div style={{minWidth: '100vw', display: 'flex', paddingTop: '1vh'}}>
      <MenuCloser closer={closeMenuNow}/>
      <div style={{display: 'flex', flex: '1', paddingLeft: '20vw', paddingRight: '20vw'}}>
         <PageItem cancelClose={cancelClose} contentRef={contentRef} controller={controller}>About</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef} controller={controller}>Projects</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef} controller={controller}>Experience</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef} controller={controller}>Education</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef} controller={controller}>Contact</PageItem>
      </div>
      <SettingsOpener cancelClose={cancelClose}/>
   </div>;
}

export default function Navbar({ contentRef, controller }: { contentRef: RefObject<HTMLDivElement | null>, controller: PageController }) {
   const timeoutRef = useRef<number | null>(null);
   const [menuOpened, openMenu, closeMenu] = (() => {
      const [menuOpened, setter] = useState(false);
      const openMenu = () => setter(true);
      const closeMenu = () => setter(false);
      return [menuOpened, openMenu, closeMenu];
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

   const BarOrOpener = (menuOpened) ? <NavBarCore cancelClose={cancelClose} closeMenuNow={closeMenuNow} contentRef={contentRef} controller={controller}/> : <MenuOpener opener={openMenuNow}/>;
   return <>
      { BarOrOpener }
      <Settings scheduleClose={scheduleClose}/>
   </>;
}
