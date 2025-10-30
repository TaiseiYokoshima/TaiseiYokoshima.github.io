import "./NavBar.css";
import "../App.css";
import PageItem from "./PageItem";
import { useRef } from "react";

export default function NavBar() {
   const settings = useRef<HTMLDivElement>(null);
   return (
      <div className="container">
         <PageItem>About</PageItem>
         <PageItem>Projects</PageItem>
         <PageItem>Experience</PageItem>
         <PageItem>Education</PageItem>
         <PageItem>Contact</PageItem>
         <div className="page-item" ref={settings}>Settings</div>
      </div>
   );
}
