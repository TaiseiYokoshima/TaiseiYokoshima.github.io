import Controller from "./Controller"
// import { type RefObject } from "react";

export default class Registry {
   private controllers: Controller[] = new Array();
   private type: "contents" | "headers";

   constructor(type: "contents" | "headers") {
      this.type = type;
   }

   register(controller: Controller) {
      this.controllers.push(controller);
   }

   async open() {
      console.log(`${this.type} registry open was called, count: ${this.controllers.length}`);
      this.list();



      const promises: Promise<void>[] = [];
      this.controllers.forEach((contorller, _) => promises.push(contorller.open()));
      
      if (promises.length === 1) console.log(`${this.type} registry is empty`);


      await Promise.allSettled(promises);
      // const results = await Promise.allSettled(promises);
      // console.log(results);
   }


   list() {
      this.controllers.forEach(element => {
         element.getInfo();
      });
   }

   async close() {
      console.log(`${this.type} registry close was called`);
      const promises: Promise<void>[] = [];
      this.controllers.forEach((contorller, _) =>  promises.push(contorller.close()));

      if (promises.length === 1) console.log(`${this.type} registry is empty`);

      await Promise.allSettled(promises);
      // const results = await Promise.allSettled(promises);
      // console.log(results);
   }
}
