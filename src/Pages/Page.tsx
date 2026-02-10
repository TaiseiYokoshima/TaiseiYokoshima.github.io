import "./Pages.css";
import "../App.css";

import type Props from "./props";

import { useSelector } from "react-redux";
import type { RootState } from "../store";

import About from "./About";
import Projects from "./Projects";
import Experience from "./Experience";
import Contact from "./Contact";
import Education from "./Education";

// const test_string = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

export default function PageContent({ registry }: Props) {
   const currentPage = useSelector((state: RootState) => state.app.currentPage);

   let pageContent;
   switch (currentPage) {
      case "about":
         pageContent = <About registry={registry}/>;
         break;
      case "projects":
         pageContent = <Projects registry={registry}/>;
         break;
      case "experience":
         pageContent = <Experience registry={registry}/>;
         break;
      case "contact":
         pageContent = <Contact registry={registry}/>;
         break;
      case "education":
         pageContent = <Education registry={registry}/>;
         break;
   };

   return <>
      <div style={{ marginLeft: '15vw', marginRight: '15vw'}}>
            { pageContent }
            <div style={{marginTop: '8rem'}}/>
      </div>
   </>;
}
