import { useSelector, useDispatch } from "react-redux";
import { type RootState, toggleAnimationStatus } from "../store";

import { useEffect, useRef, type RefObject } from "react";
import { changePage } from "../store";

import { type Page } from "./utils";
import type { PageController } from "../Controllers";

import styles from "./NavBar.module.css";

export default function PageItem({ children, cancelClose, contentRef, controller }: { children: string, cancelClose: () => void, contentRef: RefObject<HTMLDivElement | null>, controller: PageController }) {
   const currentPage = useSelector((state: RootState) => state.app.currentPage); 
   const animationEnabled = useSelector((state: RootState) => state.app.animationEnabled);

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

      if (animationEnabled) {
         dispatch(toggleAnimationStatus());
         await controller.close();
         dispatch(toggleAnimationStatus());
      };

      window.history.pushState(null, "", `/${thisPage}`)
      dispatch(changePage(thisPage));
   };

   useEffect(() => {
      if (ref.current === null) return;
      ref.current.classList.remove(styles.clicked);
   }, [currentPage]);

   // const conditional = isThisPage ? "text-green-500 underline underline-offset-[5px] cursor-text" : "cursor-pointer hover:text-red-500";
   const conditional = isThisPage ? styles.thisPage: styles.clickable;

   return (
      <div ref={ref} className={styles.item} >
         <div role="button" onClick={isThisPage ? undefined : onClick} className={conditional}>{children.toUpperCase()}</div>
      </div>
   );
}
