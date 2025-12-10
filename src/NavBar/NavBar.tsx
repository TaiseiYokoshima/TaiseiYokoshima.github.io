import styles from "./NavBar.module.css";
import "../App.css";
import PageItem from "./PageItem";

import { useDispatch, useSelector } from "react-redux";
import { type RootState, toggleSettings } from "../store";
import { useEffect, useRef, useState, type RefObject } from "react";

import Settings from "./Settings";

function MenuOpener({ opener }: { opener: () => void }) {
   return <div className="w-screen px-[1vw]! py-[1vh]!">
      <div onClick={opener} className="cursor-pointer hover:text-blue-500 inline text-[20px]">Menu »</div>
   </div>;
}

function MenuCloser({ closer }: { closer: () => void }) {
   return <div onClick={closer} className={styles["side-components"]}>«</div>;
}

function SettingsOpener({ cancelClose }: { cancelClose: () => void }) {
   const dispatch = useDispatch();
   const openSettings = () => { 
      cancelClose();
      dispatch(toggleSettings());
   };

   return <div onClick={openSettings} className={styles["side-components"]}>⚙</div>;
}


function NavBarCore({ closeMenuNow, cancelClose, contentRef }: { closeMenuNow: () => void, cancelClose: () => void, contentRef: RefObject<HTMLDivElement | null> }) {
   return <div className="min-w-screen flex pt-[1vh]!">
      <MenuCloser closer={closeMenuNow}/>
      <div className="flex flex-1 px-[20vw]!">
         <PageItem cancelClose={cancelClose} contentRef={contentRef}>About</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef}>Projects</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef}>Experience</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef}>Education</PageItem>
         <PageItem cancelClose={cancelClose} contentRef={contentRef}>Contact</PageItem>
      </div>
      <SettingsOpener cancelClose={cancelClose}/>
   </div>;
}

export default function Navbar({ contentRef }: { contentRef: RefObject<HTMLDivElement | null> }) {
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
      // cancelClose();
      // const id = setTimeout(closeMenu, 5000);
      // timeoutRef.current = id;
   };


   const closeMenuNow = () => {
      cancelClose();
      closeMenu();
   };

   const openMenuNow = () => {
      openMenu();
      scheduleClose();
   };

   const BarOrOpener = (menuOpened) ? <NavBarCore cancelClose={cancelClose} closeMenuNow={closeMenuNow} contentRef={contentRef}/> : <MenuOpener opener={openMenuNow}/>;
   return <>
      { BarOrOpener }
      <Settings scheduleClose={scheduleClose}/>
   </>;
}
