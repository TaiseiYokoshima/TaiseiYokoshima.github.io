import About from "./About/About";
import Projects from "./Projects/Projects";

import { useSelector } from "react-redux";
import type { RootState } from "../store";


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
   };

   return pageContent;
}
