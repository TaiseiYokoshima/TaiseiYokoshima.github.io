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

   const page: RefObject<RefObject<HTMLDivElement | null> | null> = useRef(null);

   useEffect(() => {
      [projects, experience, education, contact, about].forEach(element => {
         if (element.current) {
            element.current.classList.remove("terminal-white");
            element.current.style.cursor = "pointer";
         }
      });

      switch (currentPage) {
         case "projects":
            page.current = projects;
            break;
         case "experience":
            page.current = experience;
            break;
         case "education":
            page.current = education;
            break;
         case "contact":
            page.current = contact;
            break;
         case "about":
            page.current = about;
            break;
      };

      if (page.current && page.current.current) {
         page.current.current.classList.add("terminal-white");
         page.current.current.style.cursor = "text";
      };
   }, [currentPage]);

   const onClick = async (event: React.MouseEvent<HTMLDivElement>) => {
      bringUp();
      console.log("navbar calling close");
      await pageController.close();
      console.log("navbar closed");
      const page = event.target as HTMLDivElement;
      const pageString = page.textContent;

      const firstChar = pageString.substring(0, 1).toLowerCase();
      const rest = pageString.substring(1);
      const newPage: Page = (firstChar + rest) as Page ;
      setPage(newPage);
   };

   return (
      <div className="container">
         <PageItem onClick={onClick} ref={about}>About</PageItem>
         <PageItem onClick={onClick} ref={projects}>Projects</PageItem>
         <PageItem onClick={onClick} ref={experience}>Experience</PageItem>
         <PageItem onClick={onClick} ref={education}>Education</PageItem>
         <PageItem onClick={onClick} ref={contact}>Contact</PageItem>
      </div>
   );
}
