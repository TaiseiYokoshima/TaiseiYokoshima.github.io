import styles from "./NavBar.module.css";

import { useEffect, useState } from "react";


import Settings from "./Settings.tsx";


import { useSelector } from "react-redux";
import { type RootState, animationRunning, animationFinished } from "../store";

import { useRef } from "react";


function MenuOpener({ opener }: { opener: () => void }) {
   return <div className={styles.opener}>
      <div role="button" onClick={opener} className={styles.menuText}>»</div>
   </div>;
}

function Item({ children, selected }: { children: string, selected: string }) {
   const currentPage = useSelector((state: RootState) => state.app.currentPage);

   const active = currentPage === children;
   const isSelected = children === selected;

   return <div className={`${styles.item} ${active ? styles.active : ''} ${isSelected ? styles.selected : ''}`}>
      <div style={{ display: 'inline', visibility: (isSelected ? 'visible' : 'hidden')}}>{'>'}</div>
      <div style={{ display: 'inline'}}>{children}</div>
      <div style={{ display: 'inline', visibility: (active ? 'visible' : 'hidden') }}> *</div>
   </div>
}




export default function NavPage() {
   const [ opened, set ] = useState(false);
   const open = () => set(true);
   const close = () => set(false);

   const [settingsOpened, setSettings] = useState(false);
   const openSettings = () => setSettings(true);
   const closeSettings = () => setSettings(false);

   const [index, setIndex] = useState(0);
   const array = useRef(['about', 'projects', 'experience', 'education', 'contact']);

   const down = () => {
      let newI = index + 1;
      if (newI === array.current.length) {
         newI = 0;
      };
      setIndex(newI);
   };

   const up = () => {
      let newI = index - 1;
      if (newI < 0) {
         newI = array.current.length - 1;
      };
      setIndex(newI);
   };


   useEffect(() => {
      const callback = (event: KeyboardEvent) => {
         if (!opened) {
            return console.warn("navbar not open");
         };

         console.warn("key pressed");
         if (event.key === "ArrowUp") {
            return up();
         };

         if (event.key === "ArrowDown") {
            return down();
         };
      };


      window.addEventListener("keydown", callback);
      return () => window.removeEventListener("keydown", callback);
   }, [opened, index])

   return <>
      <div className={`${styles.page} terminal`} style={{ display: ( opened ? 'flex' : 'none') }}>
         <div>
            <div onClick={close} className={styles.closer}>✕</div>
            <Item selected={array.current[index]}>about</Item>
            <Item selected={array.current[index]}>projects</Item>
            <Item selected={array.current[index]}>experience</Item>
            <Item selected={array.current[index]}>education</Item>
            <Item selected={array.current[index]}>contact</Item>
            <div onClick={openSettings} className={styles.settingsOpener}>⚙</div>
         </div>
      </div>
      <MenuOpener opener={open}/>
      <Settings opened={settingsOpened} closeSettings={closeSettings}/>
   </>;
}
