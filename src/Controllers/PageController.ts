import Controller from "./Controller";
import Registry from "./Registry";

const debug = false;

export default class PageController {
   public title: Controller;
   private headers: Registry;
   private divs: Registry;

   constructor(title: Controller, headers: Registry, contents: Registry) {
      this.title = title;
      this.headers = headers;
      this.divs = contents;
   }

   register(controller: Controller) {
      switch (controller.type) {
         case "div": {
            this.divs.register(controller);
            return
         };
         case "header": {
            this.headers.register(controller);
            return
         };
         case "title": {
            console.error("title cannot be registered");
            return;
         };
      };
   }

   unregister(controller: Controller) {
      switch (controller.type) {
         case "div": {
            this.divs.unregister(controller);
            return
         };
         case "header": {
            this.headers.unregister(controller);
            return
         };
         case "title": {
            console.error("title cannot be unregistered");
            return;
         };
      };
   }

   async close() {
      await this.title.close();
      if (debug) console.log("title closed");
      await this.headers.close();
      if (debug) console.log("headers closed");
      await this.divs.close();
      if (debug) console.log("contents closed");
   }

   async open() {
      await this.title.open();
      if (debug) console.log("title opened");
      await this.headers.open();
      if (debug) console.log("headers opened");
      await this.divs.open();
      if (debug) console.log("contents opened");
   }
}
