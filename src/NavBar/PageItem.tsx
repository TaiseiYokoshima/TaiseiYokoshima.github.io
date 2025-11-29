import "./NavBar.css";

import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { useRef, type RefObject } from "react";
import { changePage } from "../store";

import { type Page } from "./utils";

export default function PageItem({ children, cancelClose, contentRef }: { children: string, cancelClose: () => void, contentRef: RefObject<HTMLDivElement | null> }) {
   const currentPage = useSelector((state: RootState) => state.app.currentPage); 
   const dispatch = useDispatch();

   const ref = useRef<HTMLDivElement>(null);
   const thisPage = children.toLowerCase() as Page;
   const isThisPage = currentPage === thisPage;

   const onClick = async () => {
      if (contentRef.current && contentRef.current.scrollTop !== 0){
         contentRef.current.scrollTop = 0;
         await new Promise(r => setTimeout(r, 500));
      };
      cancelClose();
      if (ref.current === null) return;
      ref.current.classList.add("clicked");
      dispatch(changePage(thisPage));
   };

   return (
      <div 
         className={`page-item${isThisPage ? " selected" : ""}`} 
         ref={ref} 
         onClick={isThisPage ? undefined : onClick}
      >
         {children.toUpperCase()}
      </div>
   );
}
