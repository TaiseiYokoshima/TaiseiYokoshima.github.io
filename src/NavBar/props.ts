export default interface PageItemProps {
   children: String;
   ref: React.RefObject<HTMLDivElement | null>;
   onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}
