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

   return <>
      <div className={styles.page} style={{ display: ( opened ? 'block' : 'none') }}>
         <div></div>
         test
      </div>


      <MenuOpener opener={opener}/>
   </>;
}
