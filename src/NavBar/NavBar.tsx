import styles from "./NavBar.module.css";
import "../App.css";
import PageItem from "./PageItem";

import { useDispatch } from "react-redux";
import { toggleSettings } from "../store";
import { useRef, useState, type RefObject } from "react";

import Settings from "./Settings";
import type { PageController } from "../Controllers";

function MenuOpener({ opener }: { opener: () => void }) {
   return <div className="absolute w-screen px-[1vw]! py-[1vh]!">
      <div role="button" onClick={opener} className="cursor-pointer hover:text-blue-500 inline text-[20px]">Menu »</div>
   </div>;
}

function MenuCloser({ closer }: { closer: () => void }) {
   return <div role="button" onClick={closer} className={styles["side-components"]}>«</div>;
}

function SettingsOpener({ cancelClose }: { cancelClose: () => void }) {
   const dispatch = useDispatch();
   const openSettings = () => { 
      cancelClose();
      dispatch(toggleSettings());
   };

   return <div role="button" onClick={openSettings} className={styles["side-components"]}>⚙</div>;
}

function NavBarCore({ closeMenuNow, cancelClose, contentRef, controller }: { closeMenuNow: () => void, cancelClose: () => void, contentRef: RefObject<HTMLDivElement | null>, controller: PageController }) {
   return <div className="min-w-screen flex pt-[1vh]!">
      <MenuCloser closer={closeMenuNow}/>
      <div className="flex flex-1 px-[20vw]!">
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
