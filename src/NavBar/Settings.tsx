import "./NavBar.module.css";
import "../App.css";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { toggleSettings, toggleAnimation, toggleDarkMode } from "../store";
import { useEffect } from "react";


function Switch({ enabled, callback, h='20px', w='30px', style={}, }: { enabled: boolean, callback: () => void, h?: string, w?: string, style?: React.CSSProperties }) {
   const button = (<div className="bg-white-500 bg-white flex-1" />);
   const bg = (<div className="bg-white-500 flex-1" />);
   const color = " " + (enabled ?  "bg-green-500" : "bg-gray-500");

   style.height = h;
   style.width = w;

   return <div onClick={callback} className={"flex p-[0.4%]!" + color} style={style} >
      { enabled ? <>{button}{bg}</> : <>{bg}{button}</> }
   </div>;
}

function Setting({ callback, children, enabled }: { callback: () => void, children: string, enabled: boolean }) {
   return <div className="flex w-full justify-center items-center">
      <div className="flex-[0_0_45%] text-right text-[20px]">{`${children}`}</div>
      <div className="flex-[0_0_45%]">
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
            <div className="shadow-[inset_0_0_0_0.2rem_white] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] z-10 terminal">
               <div className="text-[45px] text-center mb-[2vh]" 
               >Preferences</div>
               <div>
                  <div 
                     role="button"
                     onClick={closeSettings} 
                     className="absolute right-0 top-0 cursor-pointer bg-white text-black w-[1.8em] h-[1.8em] flex justify-center items-center text-center"
                  >X</div>
                  <Setting callback={flipAnimation} enabled={animationEnabled}>Animation | </Setting>
                  <Setting callback={flipDarkMoode} enabled={darkModeEnabled}>Dark Mode | </Setting>
               </div>
            </div>
            <div role="button" onClick={closeSettings} className="absolute top-0 left-0 w-full h-full z-2"/>
         </>
         : null}
   </>;
}
