import { PageController } from "../Controllers";

export default interface TyperProps {
   children: string;
   registry: PageController,

   speed?: number;
   email?: string,
   href?: string,
   onClick?: () => void,
}

