import "./Pages.css";
import "../App.css";


import { useSelector } from "react-redux";
import type { RootState } from "../store";

import About from "./About";
import Projects from "./Projects";
import Experience from "./Experience";
import Contact from "./Contact";
import Education from "./Education";

// const test_string = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

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
      case "experience":
         pageContent = <Experience/>;
         break;
      case "contact":
         pageContent = <Contact/>;
         break;
      case "education":
         pageContent = <Education/>;
         break;
   };

   return <>
      <div className="mx-[15vw]!">
            { pageContent }
            <div className="mt-[8rem]!"/>
      </div>
   </>;
}
