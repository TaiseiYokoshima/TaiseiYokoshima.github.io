import { type Resolver, createDeferredPromise } from "../Utils";


const debug = false;

let id = 1;

export default class Controller {
   public queue: Array<[Resolver<void>, boolean]> = [];

   public signal: Promise<void>;
   public signaler: Resolver<void>;


   private animationCount = 0;

   public registered = false;
   public type: "title" | "header" | "div";
   public id: number;

   constructor(type: "title" | "header" | "div") {
      this.type = type;
      this.id = id;
      if (debug) console.log(`controller ${id} (${this.type}) created`);
      id++;

      const { promise, resolver } = createDeferredPromise<void>();
      this.signal = promise;
      this.signaler = resolver;
   }

   register() {
      this.registered = true;
   }

   unregister() {
      this.registered = false;
   }

   async send(value: boolean): Promise<void> {
      if (!this.registered) {
         const { promise, resolver } = createDeferredPromise<void>();
         resolver();
         return promise;
      };

      let promise_to_return;

      {
         const { promise, resolver } = createDeferredPromise<void>();
         this.queue.push([resolver, value]);
         this.animationCount++;
         promise_to_return = promise;
      };

      {
         this.signaler();
         const { promise, resolver } = createDeferredPromise<void>();
         this.signal = promise;
         this.signaler = resolver;
      };

      return promise_to_return;
   }

   async open(): Promise<void> {
      return this.send(true);
   }

   async close() {
      return this.send(false);
   }


   async consume(): Promise<[Resolver<void>, boolean]> {
      while (this.queue.length === 0) {
         await this.signal;
      };

      return this.queue.shift()!;
   }

   getInfo() {
      if (debug) console.log(`id: ${this.id}, type: ${this.type}, registered: ${this.registered}, animation_count: ${this.animationCount}`);
   }
}
