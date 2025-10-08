import { type Resolver, createReffedDefferedPromise } from "./utils";

export default  class Controller {
   private signal_receiver: Promise<boolean>;
   private signal_sender: Resolver<boolean>;

   private animation_waiter: Promise<void>;
   private animation_completor: Resolver<void>;

   constructor() {
      {
         const {promise, resolver} = createReffedDefferedPromise<boolean>();
         this.signal_receiver = promise;
         this.signal_sender = resolver;
      };


      {
         const { promise, resolver } = createReffedDefferedPromise<void>();
         this.animation_waiter = promise;
         this.animation_completor = resolver;
      };
   }


   private restore_synchronization() {
      {
         const {promise, resolver} = createReffedDefferedPromise<boolean>();
         this.signal_receiver = promise;
         this.signal_sender = resolver;
      };


      {
         const { promise, resolver } = createReffedDefferedPromise<void>();
         this.animation_waiter = promise;
         this.animation_completor = resolver;
      };
   }

   async open() {
      this.signal_sender(true);
      await this.animation_waiter;
      this.restore_synchronization();
   }

   async close() {
      this.signal_sender(false);
      await this.animation_waiter;
      this.restore_synchronization();
   }


   async await_signal(): Promise<boolean> {
      const opened = await this.signal_receiver;
      return opened;
   }

   animation_completed() {
      this.animation_completor()
   }
}
