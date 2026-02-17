import { PageController } from "../Controllers";
import React from "react";

export default interface TyperProps {
   children: string;
   registry: PageController,

   speed?: number;
   email?: string,
   href?: string,
   onClick?: () => void,

   style?: React.CSSProperties,
   className?: string,
}

