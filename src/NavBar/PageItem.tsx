import "./NavBar.css";

import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { useRef } from "react";
import { changePage } from "../store";

import { type Page } from "./utils";

export default function PageItem({children}: {children: string}) {
   const currentPage = useSelector((state: RootState) => state.app.currentPage); 
   const dispatch = useDispatch();

   const ref = useRef<HTMLDivElement>(null);
   const thisPage = children.toLowerCase() as Page;
   const isThisPage = currentPage === thisPage;

   const onClick = () => {
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
         {children}
      </div>
   );
}
