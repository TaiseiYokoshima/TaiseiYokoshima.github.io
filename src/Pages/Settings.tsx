import "./Pages.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleSettings, toggleAnimation, toggleDarkMode } from "../store";

function Switch({ enabled, callback }: { enabled: boolean, callback: () => void }) {
   return <div style={{ flex: '0 0 50%', font: '10px', textAlign: 'left', paddingLeft: '1%', cursor: 'pointer' }}>

      <div onClick={(enabled) ? undefined : callback} style={{
         background: `${(enabled) ? 'green' : 'black'}`,
         borderStyle: 'solid',
         borderWidth: '1px',
         borderColor: `green`,
         display: 'inline-block',
         paddingLeft: '0.5vw',
         paddingRight: '0.5vw'
      }}>Enabled</div>

      <div onClick={(enabled) ? callback : undefined} style={{
         background: `${(enabled) ? '' : 'white'}`,
         color: `${(enabled) ? 'white' : 'black'}`,
         borderStyle: 'solid',
         borderWidth: '1px',
         borderColor: 'white',
         display: 'inline-block',
         paddingLeft: '0.5vw',
         paddingRight: '0.5vw'
      }}>Disabled</div>
   </div>;
}


function Setting({ callback, children, enabled }: { callback: () => void, children: string, enabled: boolean }) {
   return <div style={{ display: 'flex', width: "100%", justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ flex: "0 0 50%", textAlign: 'right', fontSize: '20px', }}>{`${children}`}</div>
      <Switch enabled={enabled} callback={callback} />
   </div>;
}


export default function Settings() {
   const settingsOpen = useSelector((state: RootState) => state.app.settingsOpened);
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);
   const darkModeEnabled = useSelector((state: RootState) => state.app.darkModeEnabled);
   const dispatch = useDispatch();
   const closer = () => dispatch(toggleSettings());
   const flipAnimation = () => dispatch(toggleAnimation());
   const flipDarkMoode = () => dispatch(toggleDarkMode());

   return <>
      {settingsOpen ?
         <>
            <div className="settings-page terminal">
               <div style={{ fontSize: '45px', textAlign: 'center', marginBottom: '2vh' }}>Settings</div>
               <div className="container">
                  <div onClick={closer}
                     style={{ position: 'absolute', right: 0, top: 0, cursor: 'pointer', background: 'white', color: 'black', width: '1.8em', height: '1.8em', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                  >X</div>
                  <Setting callback={flipAnimation} enabled={animationEnabled}>Animation | </Setting>
                  <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode | </Setting>
               </div>
            </div>
            <div onClick={closer} style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2 }} />
         </>
         : null}
   </>;
}



