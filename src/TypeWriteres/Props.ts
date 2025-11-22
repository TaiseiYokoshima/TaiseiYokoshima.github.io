import { Controller, Registry } from "../Controllers";

export default interface TyperProps {
   children: string;
   speed?: number;
   controller?: Controller;
   registry?: Registry;
}

