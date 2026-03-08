import styles from "./NavBar.module.css";

import { useState } from "react";


function MenuOpener({ opener }: { opener: () => void }) {
   return <div className={styles.opener}>
      <div role="button" onClick={opener} className={styles.menuText}>»</div>
   </div>;
}



export default function NavPage() {
   const [ opened, set ] = useState(false);

   const opener = () => set(true);
   const close = () => set(false);

   return <>
      <div className={`${styles.page} terminal`} style={{ display: ( opened ? 'flex' : 'none') }}>
         <div onClick={close} style={{ position: 'fixed', fontSize: '2rem', color: 'white', zIndex: '101', top: '0', left: '0'}}>X</div>
         <div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>About</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Projects</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Experience</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Education</div>
            <div className={styles.test} style={{ fontSize: 'var(--l)'}}>Contact</div>
         </div>
      </div>
      <MenuOpener opener={opener}/>
   </>;
}
