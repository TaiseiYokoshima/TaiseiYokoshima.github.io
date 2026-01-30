import Controller from "./Controller"
const debug = true;
let id = 1;

export default class Registry {
   private controllers: Controller[] = new Array();
   private type: "contents" | "headers";
   private id: number;

   constructor(type: "contents" | "headers") {
      this.type = type;
      this.id = id;
      id++;
      if (debug) console.log(`registry ${this.type}:${this.id} created`);
   }

   register(controller: Controller) {
      if (this.type as string !== controller.type as string) {
         console.error("the controller is not the same type so cannot register");
         return;
      };

      if (debug) console.log(`registry ${this.id}:${this.type} - registering ${controller.type}:${controller.id}`);
      this.controllers.push(controller);
   }

   deRegister(controller: Controller) {
      const index = this.controllers.findIndex(c => c === controller);
      if (index !== -1) {
         if (debug) console.log(`registry ${this.id}:${this.type} - deregistering ${controller.type}:${controller.id}`);
         this.controllers.splice(index, 1)
      } else {
         if (debug) console.log(`registry ${this.id}:${this.type} - deregistering called on ${controller.type}:${controller.id} but not found`);
      };
   }

   async open() {
      if (debug) {
         console.log(`${this.type} registry open was called, count: ${this.controllers.length}`);
         this.list();
      };


      const promises: Promise<void>[] = [];
      this.controllers.forEach((contorller, _) => promises.push(contorller.open()));
      
      if (promises.length === 1) if (debug) console.log(`${this.type} registry is empty`);


      await Promise.allSettled(promises);
      const results = await Promise.allSettled(promises);
      if (debug) console.log(results);
   }


   list() {
      this.controllers.forEach(element => {
         element.getInfo();
      });
   }

   async close() {
      if (debug) console.log(`${this.type} registry close was called`);

      const promises: Promise<void>[] = [];
      this.controllers.forEach((contorller, _) =>  promises.push(contorller.close()));

      if (promises.length === 1) if (debug) console.log(`${this.type} registry is empty`);

      await Promise.allSettled(promises);
      const results = await Promise.allSettled(promises);
      if (debug) console.log(results);
   }
}
