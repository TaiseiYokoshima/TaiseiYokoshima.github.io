import "./NavBar.css";
import type PageItemProps from "./props";

export default function PageItem({ children, ref, onClick }: PageItemProps) {
   return (
      <div className="page-item" ref={ref} onClick={onClick}>
         {children}
      </div>
   );
}
