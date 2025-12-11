import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store";
import { useEffect, useRef, type RefObject } from "react";
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

   useEffect(() => {
      if (ref.current === null) return;
      ref.current.classList.remove(styles.clicked);
   }, [currentPage]);

   const conditional = isThisPage ? "text-green-500 underline underline-offset-[5px] cursor-text" : "cursor-pointer hover:text-red-500";

   return (
      <div ref={ref} className={ "flex-1 text-center font-[1.2rem] items-center flex justify-center" } >
         <div role="button" onClick={isThisPage ? undefined : onClick} className={conditional}>{children.toUpperCase()}</div>
      </div>
   );
}
