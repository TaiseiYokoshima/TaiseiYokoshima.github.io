import "./NavBar.css";
import "../App.css";
import PageItem from "./PageItem";

import { useDispatch, useSelector } from "react-redux";
import { toggleSettings } from "../store";
import { type RootState } from "../store";

export default function NavBar() {
   const dispatch = useDispatch();
   const settingsOpen = useSelector((state: RootState) => state.app.settingsOpened);

   const onClick = () => {
      console.log("settings opened");
      dispatch(toggleSettings()) 
   };

   return (
      <div className="navbar">
         <PageItem>About</PageItem>
         <PageItem>Projects</PageItem>
         <PageItem>Experience</PageItem>
         <PageItem>Education</PageItem>
         <PageItem>Contact</PageItem>
         <div 
            className={`page-item${(settingsOpen) ? ' selected' : ''}`} 
            onClick={(!settingsOpen)? onClick : undefined}
         >SETTINGS</div>
      </div>
   );
}
