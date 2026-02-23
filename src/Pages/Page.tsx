import type Props from "./props";

import { useSelector } from "react-redux";
import type { RootState } from "../store";

import About from "./About";
import Projects from "./Projects";
import Experience from "./Experience";
import Contact from "./Contact";
import Education from "./Education";


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
      <div>
            { pageContent }
            <div style={{marginTop: '8rem'}}/>
      </div>
   </>;
}
