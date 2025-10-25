import "./NavBar.css";
import "../App.css";
import PageItem from "./PageItem";
import { useRef, useEffect, type RefObject } from "react";
import { type Props, type Page } from "./utils";

export default function NavBar({ pageController, page: currentPage, setPage, bringUp }: Props) {
   const projects = useRef<HTMLDivElement>(null);
   const experience = useRef<HTMLDivElement>(null);
   const education = useRef<HTMLDivElement>(null);
   const contact = useRef<HTMLDivElement>(null);
   const about = useRef<HTMLDivElement>(null);

   const page: RefObject<HTMLDivElement | null> = useRef(null);

   useEffect(() => {
      [projects, experience, education, contact, about].forEach(element => {
         if (element.current) {
            element.current.classList.remove("terminal-white");
            element.current.style.cursor = "pointer";
         }
      });

      switch (currentPage) {
         case "projects":
            page.current = projects.current;
            break;
         case "experience":
            page.current = experience.current;
            break;
         case "education":
            page.current = education.current;
            break;
         case "contact":
            page.current = contact.current;
            break;
         case "about":
            page.current = about.current;
            break;
      };

      if (page.current && page.current) {
         page.current.classList.add("terminal-white");
         page.current.style.cursor = "text";
      };
   }, [currentPage]);

   const noop = async (_: React.MouseEvent<HTMLDivElement>) => {};

   const onClick = async (event: React.MouseEvent<HTMLDivElement>) => {
      bringUp();

      const pageClicked = event.target as HTMLDivElement;

      pageClicked.classList.add("terminal-white");
      pageClicked.style.cursor = "text";
      pageClicked.onclick = () => {};



      console.log("navbar calling close");
      await pageController.close();
      console.log("navbar closed");
      const pageString = pageClicked.textContent;

      const firstChar = pageString.substring(0, 1).toLowerCase();
      const rest = pageString.substring(1);
      const newPage: Page = (firstChar + rest) as Page ;

      setPage(newPage);
   };

   return (
      <div className="container">
         <PageItem onClick={currentPage === "about" ? noop : onClick} ref={about}>About</PageItem>
         <PageItem onClick={currentPage === "projects" ? noop : onClick} ref={projects}>Projects</PageItem>
         <PageItem onClick={currentPage === "experience" ? noop : onClick} ref={experience}>Experience</PageItem>
         <PageItem onClick={currentPage === "education" ? noop : onClick} ref={education}>Education</PageItem>
         <PageItem onClick={currentPage === "contact" ? noop : onClick} ref={contact}>Contact</PageItem>
      </div>
   );
}
