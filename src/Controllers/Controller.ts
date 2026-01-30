import { type Resolver, createDeferredPromise } from "../Utils";


const debug = false;

let id = 1;

export default class Controller {
   public queue: Array<[Resolver<void>, boolean]> = [];

   private animationCount = 0;

   public registered = false;
   public type: "title" | "header" | "div";
   public id: number;

   constructor(type: "title" | "header" | "div") {
      this.type = type;
      this.id = id;
      if (debug) console.log(`controller ${id} (${this.type}) created`);
      id++;
   }

   register() {
      this.registered = true;
   }

   unregister() {
      this.registered = false;
   }

   private async send(value: boolean): Promise<void> {
      const { promise, resolver } = createDeferredPromise<void>();
      this.queue.push([resolver, value]);
      this.animationCount++;
      return promise;
   }

   async open(): Promise<void> {
      return this.send(true);
   }

   async close() {
      return this.send(false);
   }


   consume(): [Resolver<void>, boolean] | undefined {
      return this.queue.shift();
   }

   getInfo() {
      if (debug) console.log(`id: ${this.id}, type: ${this.type}, registered: ${this.registered}, animation_count: ${this.animationCount}`);
   }
}
