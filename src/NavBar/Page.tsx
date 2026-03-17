import styles from "./NavBar.module.css";

import { useState } from "react";


import Settings from "./Settings.tsx";


function MenuOpener({ opener }: { opener: () => void }) {
   return <div className={styles.opener}>
      <div role="button" onClick={opener} className={styles.menuText}>»</div>
   </div>;
}


export default function NavPage() {
   const [ opened, set ] = useState(false);
   const open = () => {
      // console.warn("menu opened");
      set(true);
   };
   const close = () => set(false);


   const [settingsOpened, setSettings] = useState(false);
   const openSettings = () => {
      console.warn("settings opened");
      setSettings(true);
   };
   const closeSettings = () => setSettings(false);


   return <>
      <div className={`${styles.page} terminal`} style={{ display: ( opened ? 'flex' : 'none') }}>
         <div>
            <div onClick={close} className={styles.closer}>✕</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>About</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Projects</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Experience</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Education</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Contact</div>
            <div onClick={openSettings} className={styles.settingsOpener}>⚙</div>
         </div>
      </div>
      <MenuOpener opener={open}/>
      <Settings opened={settingsOpened} closeSettings={closeSettings}/>
   </>;
}
