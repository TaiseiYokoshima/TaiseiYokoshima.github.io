import { type Resolver, createReffedDefferedPromise } from "./utils";

export default class Controller {
   private signalNumber = 0;
   private animationNumber = 0;

   private signalReceiver: { promise: Promise<boolean>, number: number };
   private signalSender: { resolver: Resolver<boolean>, number: number };

   private animationWaiter: { promise: Promise<void>, number: number };
   private animationCompletor: { resolver: Resolver<void>, number: number };

   constructor() {
      {
         const { promise, resolver } = createReffedDefferedPromise<boolean>();
         const number = this.signalNumber;
         this.signalReceiver = { promise, number };
         this.signalSender = { resolver, number };
      };
      {
         const { promise, resolver } = createReffedDefferedPromise<void>();
         const number = this.animationNumber;
         this.animationWaiter = { promise, number };
         this.animationCompletor = { resolver, number };
      };
   }

   private registerAnimation() {
      this.animationNumber++;
      const number = this.animationNumber;
      const { promise, resolver } = createReffedDefferedPromise<void>();
      this.animationWaiter = { promise, number };
      this.animationCompletor = { resolver, number };
      console.log(`registering animation ${number}`);
   }

   private registerSignal() {
      this.signalNumber++;
      const number = this.signalNumber;
      const { promise, resolver } = createReffedDefferedPromise<boolean>();
      this.signalReceiver = { promise, number };
      this.signalSender = { resolver, number };
      console.log(`registering signal ${number}`);
   }


   private async send(value: boolean) {
      this.registerAnimation();

      {
         const { resolver, number } = this.signalSender;
         console.log(`signaling ${number}`);
         resolver(value);
      };

      {
         const { promise, number } = this.animationWaiter;
         console.log(`awaiting animation ${number}`);
         await promise;
      };
   }


   async open() {
      await this.send(true);
   }

   async close() {
      await this.send(false);
   }

   async receive(): Promise<boolean> {
      this.registerSignal();
      const { promise, number } = this.signalReceiver;
      console.log(`awaiting signal ${number}`);
      const opened = await promise;

      
      return opened;
   }

   animation_completed() {
      this.animationCompletor.resolver()
   }
}
