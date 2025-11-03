import "./Pages.css";
import "../App.css";

import About from "./About/About";
import Projects from "./Projects/Projects";

import { useSelector } from "react-redux";
import type { RootState } from "../store";

import Settings from "./Settings";

export default function PageContent() {
   const currentPage = useSelector((state: RootState) => state.app.currentPage);

   let pageContent;
   switch (currentPage) {
      case "about":
         pageContent = <About/>;
         break;
      case "projects":
         pageContent = <Projects/>;
         break;
      default:
         pageContent = <Projects/>;
         break;
   };

   return <>
      <div className="page-content">
         { pageContent }
         <Settings/>
      </div>
   </>;
}
