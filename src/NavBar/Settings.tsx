import "./NavBar.module.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleSettings, toggleAnimation, toggleDarkMode } from "../store";
import { useEffect } from "react";

function Switch({ enabled, callback }: { enabled: boolean, callback: () => void }) {
   return <div className="flex-[0_0_55%] text-[10px] text-left pl-[1%!important] cursor-pointer">

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
   return <div className="flex w-full justify-center items-center">
      <div className="flex-[0_0_45%] text-right text-[20px]">{`${children}`}</div>
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
               <div className="text-[45px] text-center mb-[2vh]" 
               >Preferences</div>
               <div>
                  <div 
                     onClick={closeSettings} 
                     className="absolute right-0 top-0 cursor-pointer bg-white text-black w-[1.8em] h-[1.8em] flex justify-center items-center text-center"
                  >X</div>
                  <Setting callback={flipAnimation} enabled={animationEnabled}>Animation | </Setting>
                  <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode | </Setting>
               </div>
            </div>
            <div onClick={closeSettings} className="absolute top-0 left-0 w-full h-full z-2"/>
         </>
         : null}
   </>;
}
