import "./Pages.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleSettings, toggleAnimation, toggleDarkMode } from "../store";


function Setting({callback, children, enabled }: { callback: () => void, children: string, enabled: boolean }) {
   return <div style={{ display: 'flex', width: "100%", justifyContent: 'center', }}>
      <div style={{flex: "0 0 60%",  textAlign: 'right', fontSize: '30px',}}>{`${children}:`}</div>
      <div onClick={callback} style={{flex: "0 0 40%", fontSize: '30px', textAlign: 'left', paddingLeft: '1%', cursor: 'pointer'}}>{`[${(enabled) ? "x" : " " }]`}</div>
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
               <div style={{fontSize: '45px', textAlign: 'center', marginBottom: '2vh'}}>Settings</div>
               <div onClick={closer} style={{position: 'absolute', right: 0, top: 0, cursor: 'pointer', background: 'white', color: 'black', width: '1.8em', height: '1.8em', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>X</div>
               <div className="container">
                  <Setting callback={flipAnimation} enabled={animationEnabled}>Animation Enabled</Setting>
                  <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode Enabled</Setting>
               </div>
            </div> 
            <div onClick={closer} style={{position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2}}/>
         </> 
      : null }
   </>;
}
