import "./NavBar.module.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleSettings, toggleAnimation, toggleDarkMode } from "../store";
import { useEffect } from "react";

function Switch({ enabled, callback }: { enabled: boolean, callback: () => void }) {
   return <div style={{ flex: '0 0 55%', font: '10px', textAlign: 'left', paddingLeft: '1%', cursor: 'pointer' }}>

      <div onClick={(enabled) ? undefined : callback } 
         className={"border-solid border-green-500 border inline-block px-[0.5vw] "  + (
            enabled ? "bg-green-500" : "bg-black"
         )}
      >Enabled</div>

      <div onClick={(enabled) ? callback : undefined} 
         className={ 
            "border border-white px-[0.5vw] inline-block border-solid " + 
            ( enabled ? " " : "bg-white ") + 
            ( enabled ? "text-white" : "text-black")
         }
      >Disabled</div>
   </div>;
}


function Setting({ callback, children, enabled }: { callback: () => void, children: string, enabled: boolean }) {
   return <div style={{ display: 'flex', width: "100%", justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ flex: "0 0 45%", textAlign: 'right', fontSize: '20px', }}>{`${children}`}</div>
      <Switch enabled={enabled} callback={callback} />
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
            <div className="shadow-[inset_0_0_0_0.2rem_white] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] z-10 terminal">
               <div style={{ fontSize: '45px', textAlign: 'center', marginBottom: '2vh' }}>Preferences</div>
               <div className="container">
                  <div onClick={closeSettings}
                     style={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer', background: 'white', color: 'black', width: '1.8em', height: '1.8em', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                  >X</div>
                  <Setting callback={flipAnimation} enabled={animationEnabled}>Animation | </Setting>
                  <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode | </Setting>
               </div>
            </div>
            <div onClick={closeSettings} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2 }} />
         </>
         : null}
   </>;
}
