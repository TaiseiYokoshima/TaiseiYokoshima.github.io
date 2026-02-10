import "./NavBar.module.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleSettings, toggleAnimation, toggleDarkMode } from "../store";
import { useEffect } from "react";
import React from "react";


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


export default function Settings({ scheduleClose }: { scheduleClose: () => void }) {
   const settingsOpen = useSelector((state: RootState) => state.app.settingsOpened);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const darkModeEnabled = useSelector((state: RootState) => state.app.darkModeEnabled);
   const dispatch = useDispatch();
   const flipAnimation = () => dispatch(toggleAnimation());
   const flipDarkMoode = () => dispatch(toggleDarkMode());

   const closeSettings = () => {
      dispatch(toggleSettings());
   };

   useEffect(() => {
      if (!settingsOpen) return;
      scheduleClose();
   }, [settingsOpen]);

   return <>
      {settingsOpen ?
         <>
            <div className="terminal" style={{
               position: 'absolute',
               top: "50%",
               left: "50%",
               transform: 'translate(-50%, -50%)',
               width: '50vw',
               height: '50vh',
               zIndex: '10',
               boxShadow: 'inset 0 0 0 0.2rem white'
            }}>
               <div style={{fontSize: '45px', textAlign: 'center', marginBottom: '2vh'}}>Preferences</div><div>
                  <div role="button" onClick={closeSettings} style={{
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        color: 'black',
                        width: '1.8em',
                        height: '1.8em',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                     }}>X</div>
                  <Setting callback={flipAnimation} enabled={animationEnabled}>Animation | </Setting>
                  <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode | </Setting>
               </div>
            </div>
            <div role="button" onClick={closeSettings} style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '2'}}/> 
         </>
         : null}
   </>;
}
