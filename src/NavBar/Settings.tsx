import "./NavBar.module.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleAnimation, toggleDarkMode } from "../store";
import React from "react";


import styles from "./Settings.module.css";


function Switch({ enabled, callback, h='20px', w='30px', style={}, }: { enabled: boolean, callback: () => void, h?: string, w?: string, style?: React.CSSProperties }) {
   const button = (<div style={{backgroundColor: "#ffffff", flex: '1'}} />);
   const bg = (<div style={{backgroundColor: "transparent", flex: '1'}} />);

   const switchStyle: React.CSSProperties = {
      ...style,
      height: h,
      width: w,
      display: 'flex',
      padding: '0.4%',
      backgroundColor: (enabled) ? '#22c55e' : '#6b7280', 
   };

   return <div onClick={callback} style={switchStyle} >
      { enabled ? <>{button}{bg}</> : <>{bg}{button}</> }
   </div>;
}

function Setting({ callback, children, enabled }: { callback: () => void, children: string, enabled: boolean }) {
   return <div style={{ width: '100%', display: 'flex', justifyContent: "center", alignItems: 'center'}}>
      <div style={{flex: "0 0 45%", textAlign: 'right', fontSize: '20px'}}>{`${children}`}</div>
      <div style={{flex: "0 0 45%"}}>
         <Switch enabled={enabled} callback={callback} w="50px"/>
      </div>
   </div>;
}


export default function Settings({ opened, closeSettings }: { opened: boolean, closeSettings: () => void }) {

   console.warn("settings open state: ", opened);


   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const darkModeEnabled = useSelector((state: RootState) => state.app.darkModeEnabled);
   const dispatch = useDispatch();
   const flipAnimation = () => dispatch(toggleAnimation());
   const flipDarkMoode = () => dispatch(toggleDarkMode());

   return <>
      <div className={`terminal ${styles.container}`} style={{ display: (opened ? 'block' : 'none') }}>
         <div className={styles.closer} role="button" onClick={closeSettings}>X</div>
         <div style={{ fontSize: '45px', textAlign: 'center', marginBottom: '2vh'}}>Preferences</div><div>
            <Setting callback={flipAnimation} enabled={animationEnabled}>Animation | </Setting>
            <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode | </Setting>
         </div>
      </div>
      <div role="button" className={styles.catcher} onClick={closeSettings} style={{ display: (opened ? 'block' : 'none')  }}/> 
   </>;
}
