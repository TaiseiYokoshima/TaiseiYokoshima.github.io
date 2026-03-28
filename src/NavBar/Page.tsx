import styles from "./NavBar.module.css";

import { useEffect, useState } from "react";


import Settings from "./Settings.tsx";



import { useRef, type RefObject } from "react";


import { PageController } from "../Controllers";


import { useDispatch, useSelector } from "react-redux";
import { type RootState, type Page, animationRunning, animationFinished, changePage } from "../store";

import Item from "./Item.tsx";


function MenuOpener({ opener }: { opener: () => void }) {
   return <div className={styles.opener}>
      <div role="button" onClick={opener} className={styles.openerText}>»</div>
   </div>;
}

export default function NavPage({ contentRef, controller }: { contentRef: RefObject<HTMLDivElement | null>, controller: PageController }) {
   const [opened, set] = useState(false);
   const open = () => set(true);
   const close = () => set(false);

   const [settingsOpened, setSettings] = useState(false);
   const openSettings = () => setSettings(true);
   const closeSettings = () => setSettings(false);

   const [index, setIndex] = useState(0);
   const array = useRef(['about', 'projects', 'experience', 'education', 'contact']);


   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const currentPage = useSelector((state: RootState) => state.app.currentPage);
   const dispatch = useDispatch();

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

   const changePageFunc = async (page: Page) => {
      close();

      if (contentRef.current && contentRef.current.scrollTop !== 0) {
         contentRef.current.scrollTop = 0;
      };

      await new Promise(r => setTimeout(r, 300));

      if (animationEnabled) {
         dispatch(animationRunning());
         await controller.close();
         dispatch(animationFinished());
      };

      dispatch(changePage(page));
      window.history.replaceState({}, "", `/${page}`);
   };

   useEffect(() => {
      const callback = (event: KeyboardEvent) => {
         if (!opened) {
            return;
         };

         if (event.key === "ArrowUp") {
            return up();
         };

         if (event.key === "ArrowDown") {
            return down();
         };

         if (event.key === "Enter") {
            const selected = array.current[index];
            if (currentPage !== selected) {
               return changePageFunc(selected as Page);
            };

         };
      };

      window.addEventListener("keydown", callback);
      return () => window.removeEventListener("keydown", callback);
   }, [opened, index])

   return <>
      <div className={`${styles.page} terminal`} style={{ display: (opened ? 'flex' : 'none') }}>
         <div>
            <div onClick={close} className={styles.closer}>✕</div>
            <Item selected={array.current[index]} changePage={changePageFunc}>about</Item>
            <Item selected={array.current[index]} changePage={changePageFunc}>projects</Item>
            <Item selected={array.current[index]} changePage={changePageFunc}>experience</Item>
            <Item selected={array.current[index]} changePage={changePageFunc}>education</Item>
            <Item selected={array.current[index]} changePage={changePageFunc}>contact</Item>
            <div onClick={openSettings} className={styles.settingsOpener}>⚙</div>
         </div>
      </div>
      <MenuOpener opener={open} />
      <Settings opened={settingsOpened} closeSettings={closeSettings} />
   </>;
}
