import Controller from "./Controller";
import Registry from "./Registry";

const debug = false;

export default class PageController {
   private title: Controller;
   private headers: Registry;
   private contents: Registry;

   constructor(title: Controller, headers: Registry, contents: Registry) {
      this.title = title;
      this.headers = headers;
      this.contents = contents;
   }

   async close() {
      await this.title.close();
      if (debug) console.log("title closed");
      await this.headers.close();
      if (debug) console.log("headers closed");
      await this.contents.close();
      if (debug) console.log("contents closed");
   }

   async open() {
      await this.title.open();
      if (debug) console.log("title opened");
      await this.headers.open();
      if (debug) console.log("headers opened");
      await this.contents.open();
      if (debug) console.log("contents opened");
   }
}
