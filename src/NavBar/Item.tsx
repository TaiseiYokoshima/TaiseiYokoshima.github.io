import styles from "./NavBar.module.css";
import { useSelector } from "react-redux";
import { type RootState, type Page } from "../store";

export default function Item({ children, selected, changePage }: { children: string, selected: string, changePage: (page: Page) => void}) {
   const currentPage = useSelector((state: RootState) => state.app.currentPage);

   const active = currentPage === children;
   const isSelected = children === selected;

   const onClick = () => {
      changePage(children as Page);
   };

   return <div className={`${styles.item} ${active ? styles.active : ''} ${isSelected ? styles.selected : ''}`} onClick={onClick}>
      <div style={{ display: 'inline', visibility: (isSelected ? 'visible' : 'hidden') }}>{'>'}</div>
      <div style={{ display: 'inline' }}>{children}</div>
      <div style={{ display: 'inline', visibility: (active ? 'visible' : 'hidden') }}> *</div>
   </div>
}

