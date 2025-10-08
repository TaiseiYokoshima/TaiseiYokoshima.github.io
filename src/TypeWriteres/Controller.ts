import { type Resolver, createReffedDefferedPromise } from "./utils";

export default class Controller {
   private signal_receiver: Promise<boolean>;
   private signal_sender: Resolver<boolean>;

   private animationWaiter: Promise<void>;
   private animationCompletor: Resolver<void>;

   constructor() {
      {
         const { promise, resolver } = createReffedDefferedPromise<boolean>();
         this.signal_receiver = promise;
         this.signal_sender = resolver;
      };
      {
         const { promise, resolver } = createReffedDefferedPromise<void>();
         this.animationWaiter = promise;
         this.animationCompletor = resolver;
      };
   }

   private resetAnimation() {
      const {promise, resolver} = createReffedDefferedPromise<void>();
      this.animationWaiter = promise;
      this.animationCompletor = resolver;
   }

   async open() {
      this.signal_sender(true);
      await this.animationWaiter;
      this.resetAnimation();
   }

   async close() {
      this.signal_sender(false);
      await this.animationWaiter;
      this.resetAnimation();
   }


   async await_signal(): Promise<boolean> {
      const opened = await this.signal_receiver;
      const { promise, resolver } = createReffedDefferedPromise<boolean>();
      this.signal_receiver = promise;
      this.signal_sender = resolver;
      return opened;
   }

   animation_completed() {
      this.animationCompletor()
   }
}
