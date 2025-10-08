import Controller from "./Controller"
import React from "react";

export default class Registry {
   private controllers: React.RefObject<Controller>[] = new Array();

   register(controller: React.RefObject<Controller>) {
      this.controllers.push(controller);
   }

   async open() {
      const promises: Promise<void>[] = [];
      this.controllers.forEach((contorller, _) => promises.push(contorller.current.open()));
      return await Promise.all(promises);
   }

   async close() {
      const promises: Promise<void>[] = [];
      this.controllers.forEach((contorller, _) => promises.push(contorller.current.close()));
      return await Promise.all(promises);
   }
}
