import { type Resolver, createDeferredPromise } from "../Utils";


const debug = false;

let id = 1;


export default class Controller {
   private signalNumber = 0;
   private animationNumber = 0;

   private signalReceiver: { promise: Promise<boolean>, number: number };
   private signalSender: { resolver: Resolver<boolean>, number: number };

   private animationWaiter: { promise: Promise<void>, number: number };
   private animationCompletor: { resolver: Resolver<void>, number: number };

   public registered = false;
   public type: "title" | "header" | "div";
   public id: number;


   constructor(type: "title" | "header" | "div") {
      {
         const { promise, resolver } = createDeferredPromise<boolean>();
         const number = this.signalNumber;
         this.signalReceiver = { promise, number };
         this.signalSender = { resolver, number };
      };
      {
         const { promise, resolver } = createDeferredPromise<void>();
         const number = this.animationNumber;
         this.animationWaiter = { promise, number };
         this.animationCompletor = { resolver, number };
      };

      this.type = type;
      this.id = id;

      if (debug) console.log(`controller ${id} (${this.type}) created`);
      id++;

   }

   register() {
      this.registered = true;
   }

   private registerAnimation() {
      this.animationNumber++;
      const number = this.animationNumber;
      const { promise, resolver } = createDeferredPromise<void>();
      this.animationWaiter = { promise, number };
      this.animationCompletor = { resolver, number };
      // if (debug) console.log(`registering animation ${number}`);
   }

   private registerSignal() {
      this.signalNumber++;
      const number = this.signalNumber;
      const { promise, resolver } = createDeferredPromise<boolean>();
      this.signalReceiver = { promise, number };
      this.signalSender = { resolver, number };
      // if (debug) console.log(`registering signal ${number}`);
   }


   private async send(value: boolean) {
      this.registerAnimation();

      {
         const { resolver, number } = this.signalSender;
         if (debug) console.log(`signaling ${number}`);
         resolver(value);
      };

      {
         const { promise, number } = this.animationWaiter;
         if (debug) console.log(`awaiting animation ${number}`);
         await promise;
      };
   }


   async open() {
      if (!this.registered) return;
      await this.send(true);
   }

   async close() {
      if (!this.registered) return;
      await this.send(false);
   }

   async animateOnSignal(animator: (_: boolean) => Promise<void>) {
      this.registerSignal();
      const { promise, number } = this.signalReceiver;
      if (debug) console.log(`awaiting signal ${number}`);
      const opened = await promise;

      const animation = animator(opened);
      await animation;
      this.animationCompletor.resolver()
   }


   getInfo() {
      if (debug) console.log(`id: ${this.id}, type: ${this.type}, registered: ${this.registered}`);
   }
}
