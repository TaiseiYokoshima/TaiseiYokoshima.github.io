import "./Pages.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleSettings, toggleAnimation, toggleDarkMode } from "../store";


function Setting({callback, children, enabled }: { callback: () => void, children: string, enabled: boolean }) {
   return <div>
      <div style={{display: "inline-block"}}>{`${children}:`}</div>
      <div onClick={callback} style={{display: "inline-block", marginLeft: '10vw', cursor: 'pointer'}}>{`[${(enabled) ? "x" : " " }]`}</div>
   </div>;
}


export default function Settings()  {
   const settingsOpen = useSelector((state: RootState) => state.app.settingsOpened);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const darkModeEnabled = useSelector((state: RootState) => state.app.darkModeEnabled);
   const dispatch = useDispatch();
   const closer = () => dispatch(toggleSettings());
   const flipAnimation  = () =>  dispatch(toggleAnimation()); 
   const flipDarkMoode = () => dispatch(toggleDarkMode());


   return <>
      { settingsOpen ? 
         <>
            <div className="settings-page terminal">
               <Setting callback={flipAnimation} enabled={animationEnabled}>Animation Enabled</Setting>
               <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode Enabled</Setting>
            </div> 
            <div onClick={closer} style={{position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2}}/>
         </> 
      : null }
   </>;
}
