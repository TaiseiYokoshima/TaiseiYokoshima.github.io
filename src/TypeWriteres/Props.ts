import { Controller, Registry } from "../Controllers";

export default interface TyperProps {
   children: String;
   speed?: number;
   controller?: Controller;
   registry?: Registry;
}

