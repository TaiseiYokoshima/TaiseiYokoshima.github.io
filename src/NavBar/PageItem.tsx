import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { useRef, type RefObject } from "react";
import { changePage } from "../store";

import { type Page } from "./utils";
import styles from "./NavBar.module.css";

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
      ref.current.classList.add(styles.clicked);
      dispatch(changePage(thisPage));
   };

   return (
      <div 
         className={ 
            "flex-1 text-center font-[1.2rem] cursor-pointer " + 
            (isThisPage 
               ? "text-green-500 underline underline-offset-[5px] cursor-text" 
               : "hover:text-red-500" 
            )
         } 
         ref={ref} 
         onClick={isThisPage ? undefined : onClick}
      >
      {children.toUpperCase()}
      </div>
   );
}
